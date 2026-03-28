import User from "../../auth/models/User.js";
import QuizAttempt from "../../quiz/models/QuizAttempt.js";
import AptitudeAttempt from "../../practices/aptitude/models/AptitudeAttempt.js";
import LogicalReasoningAttempt from "../../practices/logicalReasoning/models/LogicalReasoningAttempt.js";
import VerbalReasoningAttempt from "../../practices/verbalReasoning/models/VerbalReasoningAttempt.js";
import Content from "../models/Content.js";
import Settings from "../models/Settings.js";
import Ticket from "../../tickets/models/Ticket.js";
import mongoose from "mongoose";

/* =====================================================
   HELPERS
===================================================== */
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const CONTENT_ALLOWED_FIELDS = [
  "title",
  "type",
  "description",
  "body",
  "topic",
  "difficulty",
  "fileUrl",
  "status",
  "isPublic",
];

// Normalize and sanitize content fields to keep queries consistent
const normalizeContentFields = (data = {}) => {
  const normalized = { ...data };

  if (normalized.type) {
    normalized.type = String(normalized.type).toLowerCase().trim();
  }

  if (normalized.difficulty) {
    normalized.difficulty = String(normalized.difficulty).toLowerCase().trim();
  }

  if (normalized.topic) {
    normalized.topic = String(normalized.topic).trim();
  }

  return normalized;
};

const pickFields = (obj, allowed) => {
  const result = {};
  for (const key of allowed) {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  }
  return result;
};

/* =====================================================
   ANALYTICS
===================================================== */
export const getAnalyticsService = async () => {
  try {
    const totalUsers = await User.countDocuments().catch(() => 0);

    // New users this week and month
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
    const newUsersWeek = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    }).catch(() => 0);
    const newUsersMonth = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    }).catch(() => 0);

    // Ticket KPIs
    const [ticketsTotal, ticketsResolved, ticketsPending] = await Promise.all([
      Ticket.countDocuments().catch(() => 0),
      Ticket.countDocuments({ status: "resolved" }).catch(() => 0),
      Ticket.countDocuments({ status: { $in: ["open", "in_progress"] } }).catch(() => 0),
    ]);

    // Content published (excluding soft-deleted)
    const contentPublished = await Content.countDocuments({
      status: "published",
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
    }).catch(() => 0);

    // Quiz performance — compute average as percentage
    const quizStats = await QuizAttempt.aggregate([
      { $match: { completed: true, deletedAt: null } },
      {
        $group: {
          _id: null,
          avgScorePercent: {
            $avg: {
              $cond: [
                { $gt: ["$totalQuestions", 0] },
                {
                  $multiply: [
                    { $divide: [{ $ifNull: ["$score", 0] }, "$totalQuestions"] },
                    100,
                  ],
                },
                0,
              ],
            },
          },
          totalAttempts: { $sum: 1 },
        },
      },
    ]).catch((err) => {
      console.error("Aggregation Failed (Quiz Stats):", err);
      return [];
    });

    // Tests per day (last 7 days)
    const testsPerDay = await QuizAttempt.aggregate([
      {
        $match: {
          completed: true,
          deletedAt: null,
          completedAt: { $gte: oneWeekAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$completedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]).catch((err) => {
      console.error("Aggregation Failed (Tests Per Day):", err);
      return [];
    });

    // Compute real trend: compare this week vs last week
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const lastWeekUsers = await User.countDocuments({
      createdAt: { $gte: twoWeeksAgo, $lt: oneWeekAgo },
    }).catch(() => 0);

    const userTrend =
      lastWeekUsers > 0
        ? Math.round(((newUsersWeek - lastWeekUsers) / lastWeekUsers) * 100)
        : newUsersWeek > 0
          ? 100
          : 0;

    return {
      overview: {
        totalUsers,
        newUsersWeek,
        newUsersMonth,
        avgQuizScore: Math.round(quizStats[0]?.avgScorePercent || 0),
        totalQuizzes: quizStats[0]?.totalAttempts || 0,
        userTrend,
        ticketsTotal,
        ticketsResolved,
        ticketsPending,
        contentPublished,
      },
      charts: {
        testsPerDay,
      },
    };
  } catch (error) {
    console.error("Admin Analytics Error (Service):", error);
    return {
      overview: {
        totalUsers: 0,
        newUsersWeek: 0,
        newUsersMonth: 0,
        avgQuizScore: 0,
        totalQuizzes: 0,
        userTrend: 0,
        ticketsTotal: 0,
        ticketsResolved: 0,
        ticketsPending: 0,
        contentPublished: 0,
      },
      charts: { testsPerDay: [] },
      error: error.message,
    };
  }
};

/* =====================================================
   USER MANAGEMENT
===================================================== */
export const getAllUsersService = async ({
  page = 1,
  limit = 10,
  search = "",
}) => {
  const query = search
    ? {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }
    : {};

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .select("-password")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  // Enrich users with quiz attempt counts
  const userIds = users.map((u) => u._id);
  const quizCounts = await QuizAttempt.aggregate([
    {
      $match: {
        userId: { $in: userIds },
        deletedAt: null,
        completed: true,
      },
    },
    { $group: { _id: "$userId", count: { $sum: 1 } } },
  ]).catch(() => []);

  const countMap = {};
  for (const item of quizCounts) {
    countMap[item._id.toString()] = item.count;
  }

  const enrichedUsers = users.map((u) => {
    const obj = u.toObject();
    obj.quizCount = countMap[u._id.toString()] || 0;
    return obj;
  });

  return {
    users: enrichedUsers,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Delete a user by ID (hard delete)
 */
export const deleteUserService = async (id) => {
  if (!isValidObjectId(id)) {
    const err = new Error("Invalid user ID");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findById(id);
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  // Clean up related data
  await QuizAttempt.updateMany(
    { userId: user._id },
    { $set: { deletedAt: new Date() } }
  ).catch(() => { });

  await User.findByIdAndDelete(id);
  return { message: "User and related data deleted successfully" };
};

/**
 * Update user status (suspend/activate) or role
 */
export const updateUserService = async (id, updates) => {
  if (!isValidObjectId(id)) {
    const err = new Error("Invalid user ID");
    err.statusCode = 400;
    throw err;
  }

  // Only allow safe fields
  const allowed = {};
  if (updates.status !== undefined) {
    if (!["active", "suspended"].includes(updates.status)) {
      const err = new Error("Invalid status value");
      err.statusCode = 400;
      throw err;
    }
    allowed.status = updates.status;
  }

  if (Object.keys(allowed).length === 0) {
    const err = new Error("No valid fields to update");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findByIdAndUpdate(id, { $set: allowed }, { new: true }).select(
    "-password"
  );

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  return user;
};

/* =====================================================
   CONTENT MANAGEMENT
===================================================== */
export const createContentService = async (contentData) => {
  const cleaned = normalizeContentFields(
    pickFields(contentData, CONTENT_ALLOWED_FIELDS)
  );

  if (!cleaned.title || !cleaned.body) {
    const err = new Error("Title and body are required");
    err.statusCode = 400;
    throw err;
  }

  return await Content.create(cleaned);
};

export const getAllContentService = async ({
  type,
  search,
  page = 1,
  limit = 10,
  onlyPublished = false,
}) => {
  const query = {};

  if (onlyPublished) {
    query.status = "published";
    query.isPublic = true;
  }
  const normalizedType = type
    ? String(type).toLowerCase().trim()
    : undefined;

  if (normalizedType) {
    query.type = normalizedType;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { topic: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Content.countDocuments(query);
  const content = await Content.find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });

  return {
    content,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  };
};

export const updateContentService = async (id, updateData) => {
  if (!isValidObjectId(id)) {
    const err = new Error("Invalid content ID");
    err.statusCode = 400;
    throw err;
  }

  const cleaned = normalizeContentFields(
    pickFields(updateData, CONTENT_ALLOWED_FIELDS)
  );
  return await Content.findByIdAndUpdate(id, cleaned, { new: true });
};

export const deleteContentService = async (id) => {
  if (!isValidObjectId(id)) {
    const err = new Error("Invalid content ID");
    err.statusCode = 400;
    throw err;
  }

  // Soft delete instead of hard delete
  const content = await Content.findByIdAndUpdate(
    id,
    { $set: { deletedAt: new Date() } },
    { new: true }
  );

  if (!content) {
    const err = new Error("Content not found");
    err.statusCode = 404;
    throw err;
  }

  return content;
};

/* =====================================================
   SETTINGS
===================================================== */
export const getSettingsService = async () => {
  return await Settings.getAll();
};

export const updateSettingsService = async (updates) => {
  if (!updates || typeof updates !== "object") {
    const err = new Error("Invalid settings data");
    err.statusCode = 400;
    throw err;
  }
  return await Settings.bulkSet(updates);
};

/* =====================================================
   ADVANCED ANALYTICS ENGINE
===================================================== */
export const getAdvancedAnalyticsService = async () => {
  const now = new Date();
  const dayAgo = new Date(now).setDate(now.getDate() - 1);
  const weekAgo = new Date(now).setDate(now.getDate() - 7);
  const monthAgo = new Date(now).setDate(now.getDate() - 30);

  const attemptModels = [
    { name: "Quiz", model: QuizAttempt },
    { name: "Aptitude", model: AptitudeAttempt },
    { name: "Logical", model: LogicalReasoningAttempt },
    { name: "Verbal", model: VerbalReasoningAttempt },
  ];

  // 1. Retention & Active Users (DAU/WAU/MAU)
  const [dau, wau, mau] = await Promise.all([
    User.countDocuments({ updatedAt: { $gte: new Date(dayAgo) } }),
    User.countDocuments({ updatedAt: { $gte: new Date(weekAgo) } }),
    User.countDocuments({ updatedAt: { $gte: new Date(monthAgo) } }),
  ]);

  // 2. Completion Rates per Module
  const completionStats = await Promise.all(attemptModels.map(async ({ name, model }) => {
    const stats = await model.aggregate([
      { $match: { deletedAt: null } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: { $sum: { $cond: ["$completed", 1, 0] } }
        }
      }
    ]);
    const { total = 0, completed = 0 } = stats[0] || {};
    return {
      module: name,
      totalAttempts: total,
      completedAttempts: completed,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  }));

  // 3. Dropout Analysis (Heatmap of where users stop in Quizzes)
  const dropouts = await QuizAttempt.aggregate([
    { $match: { completed: false, deletedAt: null } },
    {
      $group: {
        _id: "$currentIndex",
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // 4. Score Trends (Engagement Quality)
  const scoreTrends = await QuizAttempt.aggregate([
    { $match: { completed: true, deletedAt: null } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$completedAt" } },
        avgScore: { $avg: "$score" }
      }
    },
    { $sort: { _id: 1 } },
    { $limit: 14 }
  ]);

  // 5. Recent platform activity (merge from users, tickets, content, quiz attempts)
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [recentUsers, recentTickets, recentContent, recentQuizCompletions] = await Promise.all([
    User.find({ createdAt: { $gte: thirtyDaysAgo } })
      .select("email createdAt")
      .sort({ createdAt: -1 })
      .limit(15)
      .lean(),
    Ticket.find()
      .select("ticketNumber status createdAt resolvedAt")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean(),
    Content.find({
      $or: [{ deletedAt: null }, { deletedAt: { $exists: false } }],
      status: "published",
    })
      .select("title createdAt updatedAt status")
      .sort({ updatedAt: -1 })
      .limit(15)
      .lean(),
    QuizAttempt.find({ completed: true, deletedAt: null, completedAt: { $exists: true, $ne: null } })
      .select("completedAt score totalQuestions")
      .sort({ completedAt: -1 })
      .limit(15)
      .lean(),
  ]);

  const activityItems = [];

  recentUsers.forEach((u) => {
    activityItems.push({
      type: "user_signup",
      date: u.createdAt,
      label: "New user registered",
      meta: { email: u.email },
    });
  });
  recentTickets.forEach((t) => {
    activityItems.push({
      type: "ticket_created",
      date: t.createdAt,
      label: "Support ticket created",
      meta: { ticketNumber: t.ticketNumber },
    });
    if (t.resolvedAt) {
      activityItems.push({
        type: "ticket_resolved",
        date: t.resolvedAt,
        label: "Ticket resolved",
        meta: { ticketNumber: t.ticketNumber },
      });
    }
  });
  recentContent.forEach((c) => {
    const date = c.updatedAt || c.createdAt;
    activityItems.push({
      type: "content_published",
      date,
      label: "Content published",
      meta: { title: c.title },
    });
  });
  recentQuizCompletions.forEach((q) => {
    const pct = q.totalQuestions > 0 ? Math.round((q.score / q.totalQuestions) * 100) : 0;
    activityItems.push({
      type: "quiz_completed",
      date: q.completedAt,
      label: "Quiz attempt completed",
      meta: { score: pct },
    });
  });

  activityItems.sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentActivity = activityItems.slice(0, 25);

  return {
    activeUsers: { dau, wau, mau },
    completionRates: completionStats,
    dropoutHeatmap: dropouts,
    scoreTrends: scoreTrends,
    recentActivity,
  };
};
