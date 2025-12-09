/**
 * Email Service
 * Handles sending transactional emails (verification, password reset, invitations)
 *
 * Note: This implementation uses nodemailer. In production, you may want to use
 * a service like SendGrid, Postmark, or AWS SES.
 */

import { createTransport, Transporter } from 'nodemailer';
import { config } from '../config/index.js';
import { logger } from '../lib/logger.js';

// Email templates
interface EmailTemplate {
  subject: string;
  text: string;
  html: string;
}

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html: string;
}

// Lazy-loaded transporter
let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  if (config.SMTP_HOST && config.SMTP_PORT) {
    transporter = createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE,
      auth: config.SMTP_USER && config.SMTP_PASS ? {
        user: config.SMTP_USER,
        pass: config.SMTP_PASS,
      } : undefined,
    });
  } else {
    // Development: use ethereal email (fake SMTP)
    transporter = createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal_password',
      },
    });

    logger.warn('Email service using development mode (ethereal email)');
  }

  return transporter;
}

/**
 * Send an email
 */
async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const transport = getTransporter();

    const result = await transport.sendMail({
      from: config.EMAIL_FROM ?? 'Q CSAT <noreply@qcsat.io>',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    logger.info('Email sent successfully', {
      to: options.to,
      subject: options.subject,
      messageId: result.messageId,
    });

    return true;
  } catch (error) {
    logger.error('Failed to send email', {
      to: options.to,
      subject: options.subject,
    }, error as Error);

    return false;
  }
}

/**
 * Generate email verification template
 */
function verificationEmailTemplate(name: string, verifyUrl: string): EmailTemplate {
  const subject = 'Verify your Q CSAT account';

  const text = `
Hi ${name},

Welcome to Q CSAT! Please verify your email address by clicking the link below:

${verifyUrl}

This link will expire in 24 hours.

If you didn't create an account with Q CSAT, you can safely ignore this email.

Thanks,
The Q CSAT Team
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Q CSAT</h1>
  </div>
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
    <h2 style="margin-top: 0;">Hi ${name},</h2>
    <p>Welcome to Q CSAT! Please verify your email address by clicking the button below:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verifyUrl}" style="display: inline-block; background: #22c55e; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600;">Verify Email Address</a>
    </div>
    <p style="font-size: 14px; color: #666;">This link will expire in 24 hours.</p>
    <p style="font-size: 14px; color: #666;">If you didn't create an account with Q CSAT, you can safely ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${verifyUrl}" style="color: #22c55e;">${verifyUrl}</a>
    </p>
  </div>
</body>
</html>
`.trim();

  return { subject, text, html };
}

/**
 * Generate password reset template
 */
function passwordResetEmailTemplate(name: string, resetUrl: string): EmailTemplate {
  const subject = 'Reset your Q CSAT password';

  const text = `
Hi ${name},

We received a request to reset your password. Click the link below to choose a new password:

${resetUrl}

This link will expire in 1 hour.

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

Thanks,
The Q CSAT Team
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Q CSAT</h1>
  </div>
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
    <h2 style="margin-top: 0;">Hi ${name},</h2>
    <p>We received a request to reset your password. Click the button below to choose a new password:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="display: inline-block; background: #22c55e; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600;">Reset Password</a>
    </div>
    <p style="font-size: 14px; color: #666;">This link will expire in 1 hour.</p>
    <p style="font-size: 14px; color: #666;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${resetUrl}" style="color: #22c55e;">${resetUrl}</a>
    </p>
  </div>
</body>
</html>
`.trim();

  return { subject, text, html };
}

/**
 * Generate organization invitation template
 */
function invitationEmailTemplate(
  inviterName: string,
  organizationName: string,
  role: string,
  inviteUrl: string
): EmailTemplate {
  const subject = `You've been invited to join ${organizationName} on Q CSAT`;

  const text = `
Hi there,

${inviterName} has invited you to join ${organizationName} on Q CSAT as a ${role}.

Click the link below to accept the invitation and create your account:

${inviteUrl}

This invitation will expire in 7 days.

If you don't want to join this organization, you can safely ignore this email.

Thanks,
The Q CSAT Team
`.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Q CSAT</h1>
  </div>
  <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px;">
    <h2 style="margin-top: 0;">You've been invited!</h2>
    <p><strong>${inviterName}</strong> has invited you to join <strong>${organizationName}</strong> on Q CSAT as a <strong>${role}</strong>.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${inviteUrl}" style="display: inline-block; background: #22c55e; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600;">Accept Invitation</a>
    </div>
    <p style="font-size: 14px; color: #666;">This invitation will expire in 7 days.</p>
    <p style="font-size: 14px; color: #666;">If you don't want to join this organization, you can safely ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    <p style="font-size: 12px; color: #9ca3af; text-align: center;">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <a href="${inviteUrl}" style="color: #22c55e;">${inviteUrl}</a>
    </p>
  </div>
</body>
</html>
`.trim();

  return { subject, text, html };
}

/**
 * Send email verification email
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  token: string
): Promise<boolean> {
  const verifyUrl = `${config.APP_URL}/verify-email?token=${token}`;
  const template = verificationEmailTemplate(name, verifyUrl);

  return sendEmail({
    to: email,
    ...template,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  token: string
): Promise<boolean> {
  const resetUrl = `${config.APP_URL}/reset-password?token=${token}`;
  const template = passwordResetEmailTemplate(name, resetUrl);

  return sendEmail({
    to: email,
    ...template,
  });
}

/**
 * Send organization invitation email
 */
export async function sendInvitationEmail(
  email: string,
  inviterName: string,
  organizationName: string,
  role: string,
  token: string
): Promise<boolean> {
  const inviteUrl = `${config.APP_URL}/accept-invite?token=${token}`;
  const template = invitationEmailTemplate(inviterName, organizationName, role, inviteUrl);

  return sendEmail({
    to: email,
    ...template,
  });
}

/**
 * Verify SMTP connection
 */
export async function verifyEmailConnection(): Promise<boolean> {
  try {
    const transport = getTransporter();
    await transport.verify();
    logger.info('Email service connection verified');
    return true;
  } catch (error) {
    logger.error('Email service connection failed', {}, error as Error);
    return false;
  }
}
