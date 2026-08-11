// src/modules/admin/controllers/admin.controller.js
import asyncHandler from "../../../utils/asyncHandler.js";
import * as adminService from "../services/admin.service.js";

/**
 * GET /api/admin/analytics
 */
export const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.getAnalyticsService();
  res.status(200).json(analytics);
});

/**
 * GET /api/admin/analytics/advanced
 */
export const getAdvancedAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.getAdvancedAnalyticsService();
  res.status(200).json(analytics);
});

/**
 * GET /api/admin/users
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const result = await adminService.getAllUsersService({
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    search: search || "",
  });
  res.status(200).json(result);
});

/**
 * DELETE /api/admin/users/:id
 */
export const deleteUser = asyncHandler(async (req, res) => {
  const result = await adminService.deleteUserService(req.params.id);
  res.status(200).json(result);
});

/**
 * PATCH /api/admin/users/:id
 */
export const updateUser = asyncHandler(async (req, res) => {
  const user = await adminService.updateUserService(req.params.id, req.body);
  res.status(200).json(user);
});

/**
 * POST /api/admin/content
 */
export const createContent = asyncHandler(async (req, res) => {
  const content = await adminService.createContentService(req.body);
  res.status(201).json(content);
});

/**
 * GET /api/admin/content
 */
export const getAllContent = asyncHandler(async (req, res) => {
  const { type, search, page, limit } = req.query;

  const result = await adminService.getAllContentService({
    type,
    search,
    page: parseInt(page) || 1,
    limit: parseInt(limit) || 10,
    onlyPublished: req.query.onlyPublished === "true" || req.baseUrl === "/api/content",
  });

  res.status(200).json(result);
});

/**
 * PUT /api/admin/content/:id
 */
export const updateContent = asyncHandler(async (req, res) => {
  const content = await adminService.updateContentService(
    req.params.id,
    req.body
  );
  if (!content) {
    res.status(404);
    throw new Error("Content not found");
  }
  res.status(200).json(content);
});

/**
 * DELETE /api/admin/content/:id
 */
export const deleteContent = asyncHandler(async (req, res) => {
  await adminService.deleteContentService(req.params.id);
  res.status(200).json({ message: "Content deleted successfully" });
});

/**
 * GET /api/admin/settings
 */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await adminService.getSettingsService();
  res.status(200).json(settings);
});

/**
 * PUT /api/admin/settings
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await adminService.updateSettingsService(req.body);
  res.status(200).json(settings);
});
