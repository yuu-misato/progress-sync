import { PrismaClient } from '@prisma/client';
import { sendProgressNotification as sendLine } from './line-bot';
import { sendEmailNotification as sendEmail } from './mail';

const prisma = new PrismaClient();

export async function notifyClient(projectId: string, message: string) {
    const project = await prisma.project.findUnique({ where: { id: projectId } });

    if (!project) return;

    const notifications = [];

    // 1. LINE通知
    if (project.notifyViaLine && project.lineUserId) {
        notifications.push(sendLine(project.lineUserId, message));
    }

    // 2. Email通知
    if (project.notifyViaEmail && project.notificationEmail) {
        const subject = `【Progress Sync】進捗更新のお知らせ: ${project.name}`;
        const body = `${project.clientName} ご担当者様\n\nお世話になっております。\n進捗管理システムよりお知らせです。\n\n${message}\n\n詳細はダッシュボードをご確認ください。\nhttp://localhost:3000/client/${projectId}\n\n--------------------------\nProgress Sync`;
        notifications.push(sendEmail(project.notificationEmail, subject, body));
    }

    // 並行して送信
    await Promise.all(notifications);
}
