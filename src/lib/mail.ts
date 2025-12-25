import nodemailer from 'nodemailer';

// 開発用(MailHogなど) または 本番用(SES/SendGrid)の設定
// ここでは環境変数がなければコンソール出力のみのMockモードで動作させます
const transporter = process.env.SMTP_HOST
    ? nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    })
    : null;

export async function sendEmailNotification(to: string, subject: string, text: string) {
    if (!transporter) {
        console.log(`
========== [MOCK EMAIL SENT] ==========
To: ${to}
Subject: ${subject}
Body:
${text}
=======================================
    `);
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM || '"Progress Sync" <noreply@example.com>',
            to,
            subject,
            text,
        });
        console.log(`Email sent to ${to}`);
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}
