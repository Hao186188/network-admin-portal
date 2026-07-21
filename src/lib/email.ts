// src/lib/email.ts
// SMTP EMAIL SERVICE - GỬI EMAIL XÁC THỰC

import nodemailer from "nodemailer";

// ✅ Cấu hình SMTP từ environment variables
const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.SMTP_PORT || "587");
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";

console.log("📧 [Email] SMTP Configuration:", {
  host: smtpHost,
  port: smtpPort,
  user: smtpUser ? "✅ Configured" : "❌ Not configured",
});

// ✅ Tạo transporter
export const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: smtpPort === 465, // true cho 465, false cho 587
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

// ✅ Gửi email xác thực
export async function sendVerificationEmail(
  to: string,
  name: string,
  verificationToken: string,
) {
  try {
    const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: `"Mạng 3 Hub" <${smtpUser}>`,
      to: to,
      subject: "Xác thực tài khoản - Mạng 3 Hub",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Xác thực tài khoản</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Mạng 3 Hub</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Xác thực tài khoản</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #333333; margin-top: 0;">Xin chào ${name}!</h2>

              <p style="color: #666666; line-height: 1.6; margin: 20px 0;">
                Cảm ơn bạn đã đăng ký tài khoản tại <strong>Mạng 3 Hub</strong>.
                Vui lòng nhấn nút bên dưới để xác thực email của bạn:
              </p>

              <!-- Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}"
                   style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                  Xác thực tài khoản
                </a>
              </div>

              <p style="color: #666666; line-height: 1.6; margin: 20px 0;">
                Hoặc copy link sau vào trình duyệt:
              </p>

              <p style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #666666;">
                ${verificationUrl}
              </p>

              <p style="color: #999999; font-size: 14px; margin-top: 30px;">
                Link này sẽ hết hạn sau 24 giờ.
              </p>

              <p style="color: #999999; font-size: 14px;">
                Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
              <p style="color: #999999; font-size: 12px; margin: 0;">
                © 2024 Mạng 3 Hub. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ [Email] Verification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ [Email] Error sending verification email:", error);
    return { success: false, error: error.message };
  }
}

// ✅ Gửi email chào mừng
export async function sendWelcomeEmail(to: string, name: string) {
  try {
    const mailOptions = {
      from: `"Mạng 3 Hub" <${smtpUser}>`,
      to: to,
      subject: "Chào mừng bạn đến với Mạng 3 Hub!",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Chào mừng</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Mạng 3 Hub</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; opacity: 0.9;">Chào mừng bạn!</p>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #333333; margin-top: 0;">Xin chào ${name}!</h2>

              <p style="color: #666666; line-height: 1.6; margin: 20px 0;">
                Chào mừng bạn đến với <strong>Mạng 3 Hub</strong> - nền tảng học tập và quản lý tài liệu hàng đầu.
              </p>

              <p style="color: #666666; line-height: 1.6; margin: 20px 0;">
                Tài khoản của bạn đã được xác thực thành công. Bây giờ bạn có thể:
              </p>

              <ul style="color: #666666; line-height: 1.8;">
                <li>📚 Truy cập kho tài liệu phong phú</li>
                <li>📝 Quản lý bài tập và đề thi</li>
                <li>💬 Tham gia thảo luận với cộng đồng</li>
                <li>📊 Theo dõi tiến độ học tập</li>
              </ul>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXTAUTH_URL}/dashboard"
                   style="display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                  Bắt đầu ngay
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
              <p style="color: #999999; font-size: 12px; margin: 0;">
                © 2024 Mạng 3 Hub. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ [Email] Welcome email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ [Email] Error sending welcome email:", error);
    return { success: false, error: error.message };
  }
}

// ✅ Gửi email thông báo
export async function sendNotificationEmail(
  to: string,
  name: string,
  subject: string,
  message: string,
) {
  try {
    const mailOptions = {
      from: `"Mạng 3 Hub" <${smtpUser}>`,
      to: to,
      subject: subject,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Mạng 3 Hub</h1>
            </div>

            <!-- Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #333333; margin-top: 0;">${subject}</h2>

              <p style="color: #666666; line-height: 1.6; margin: 20px 0;">
                Xin chào ${name},
              </p>

              <p style="color: #666666; line-height: 1.6; margin: 20px 0;">
                ${message}
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
              <p style="color: #999999; font-size: 12px; margin: 0;">
                © 2024 Mạng 3 Hub. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ [Email] Notification email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ [Email] Error sending notification email:", error);
    return { success: false, error: error.message };
  }
}
