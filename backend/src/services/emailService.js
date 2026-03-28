// src/services/emailService.js
import nodemailer from "nodemailer";

/* =====================================================
   StudexaAI Email Service — Nodemailer (Gmail SMTP)
   Requires: EMAIL_USER + EMAIL_PASS env vars
===================================================== */

const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("[EmailService] EMAIL_USER or EMAIL_PASS not configured. Emails will not be sent.");
        return null;
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

const SUBJECT_LABELS = {
    suggestion: "Suggestion / Idea",
    bug: "Bug Report",
    support: "Support / Help",
    privacy: "Account Deletion / Data Request",
};

/* =====================================================
   TICKET RESOLVED EMAIL TEMPLATE
===================================================== */
const buildResolvedEmailHtml = (ticket) => {
    const subjectLabel = SUBJECT_LABELS[ticket.subject] || ticket.subject;
    const resolvedDate = new Date(ticket.resolvedAt || Date.now()).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your Support Ticket Has Been Resolved</title>
</head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#2563eb 0%,#06b6d4 100%);padding:36px 40px;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:12px;padding:10px 20px;">
                      <span style="font-size:22px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">StudexaAI</span>
                    </div>
                    <p style="margin:16px 0 0;font-size:14px;color:rgba(255,255,255,0.85);font-weight:500;">Support Team</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Success Badge -->
          <tr>
            <td style="padding:32px 40px 0;text-align:center;">
              <div style="display:inline-block;background:#dcfce7;border:1px solid #86efac;border-radius:50px;padding:8px 20px;margin-bottom:24px;">
                <span style="font-size:13px;font-weight:700;color:#15803d;">✓ &nbsp;Ticket Resolved</span>
              </div>
              <h1 style="margin:0 0 8px;font-size:26px;font-weight:900;color:#0f172a;letter-spacing:-0.5px;">
                Your issue has been resolved
              </h1>
              <p style="margin:0;font-size:15px;color:#64748b;line-height:1.6;">
                Hi <strong style="color:#0f172a;">${ticket.name}</strong>, we've reviewed and resolved your support ticket.
              </p>
            </td>
          </tr>

          <!-- Ticket Info -->
          <tr>
            <td style="padding:28px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Ticket Number</td>
                        <td align="right" style="font-size:13px;font-weight:800;color:#2563eb;">${ticket.ticketNumber}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;border-bottom:1px solid #e2e8f0;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Category</td>
                        <td align="right" style="font-size:13px;font-weight:600;color:#0f172a;">${subjectLabel}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Resolved On</td>
                        <td align="right" style="font-size:13px;font-weight:600;color:#0f172a;">${resolvedDate}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Original Message -->
          <tr>
            <td style="padding:24px 40px 0;">
              <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Your Original Message</p>
              <div style="background:#f1f5f9;border-left:3px solid #cbd5e1;border-radius:8px;padding:16px 20px;">
                <p style="margin:0;font-size:14px;color:#475569;line-height:1.7;">${ticket.message.replace(/\n/g, "<br/>")}</p>
              </div>
            </td>
          </tr>

          ${ticket.resolutionNote ? `
          <!-- Resolution Note -->
          <tr>
            <td style="padding:24px 40px 0;">
              <p style="margin:0 0 10px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.06em;">Resolution from Our Team</p>
              <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:20px 24px;">
                <p style="margin:0;font-size:15px;color:#1e40af;line-height:1.7;font-weight:500;">${ticket.resolutionNote.replace(/\n/g, "<br/>")}</p>
              </div>
            </td>
          </tr>
          ` : ""}

          <!-- CTA -->
          <tr>
            <td style="padding:28px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:0;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 6px;font-size:14px;font-weight:700;color:#0f172a;">Not satisfied with the resolution?</p>
                    <p style="margin:0 0 16px;font-size:13px;color:#64748b;line-height:1.6;">
                      If your issue persists or you have more questions, feel free to submit a new ticket from the Contact page.
                    </p>
                    <a href="${process.env.CLIENT_URL || "http://localhost:5173"}/contact"
                       style="display:inline-block;background:linear-gradient(135deg,#2563eb,#06b6d4);color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:10px 24px;border-radius:8px;">
                      Submit Another Ticket
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-size:13px;font-weight:700;color:#0f172a;">StudexaAI Support</p>
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                This is an automated message. Please do not reply to this email.
              </p>
              <p style="margin:8px 0 0;font-size:11px;color:#cbd5e1;">
                © ${new Date().getFullYear()} StudexaAI. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
};

/* =====================================================
   EXPORTED FUNCTIONS
===================================================== */

/**
 * Send a resolution confirmation email to the ticket submitter
 * @param {Object} ticket - The resolved Ticket document
 */
export const sendTicketResolvedEmail = async (ticket) => {
    const transporter = createTransporter();
    if (!transporter) {
        console.warn("[EmailService] Skipping email — transporter not configured.");
        return { sent: false, reason: "not_configured" };
    }

    try {
        const info = await transporter.sendMail({
            from: `"StudexaAI Support" <${process.env.EMAIL_USER}>`,
            to: ticket.email,
            subject: `✓ Ticket Resolved: ${ticket.ticketNumber} — StudexaAI Support`,
            html: buildResolvedEmailHtml(ticket),
        });

        console.log(`[EmailService] Resolution email sent to ${ticket.email}: ${info.messageId}`);
        return { sent: true, messageId: info.messageId };
    } catch (error) {
        console.error("[EmailService] Failed to send resolution email:", error.message);
        return { sent: false, reason: error.message };
    }
};

export default { sendTicketResolvedEmail };
