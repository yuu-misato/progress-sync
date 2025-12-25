// src/lib/actions.ts
'use server';

import { PrismaClient } from '@prisma/client';
import { notifyClient } from './notifier';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// Seed function for demo
export async function seedDemoData() {
    const project = await prisma.project.create({
        data: {
            name: "株式会社サンプル 新規Webサイト制作",
            clientName: "株式会社サンプル 御中",
            status: "active",

            // Default notification settings for demo
            notificationEmail: "client@example.com",
            notifyViaLine: true,
            notifyViaEmail: true,

            steps: {
                create: [
                    { label: "要件定義", order: 1, status: "completed", date: "2025/12/01" },
                    { label: "デザイン", order: 2, status: "completed", date: "2025/12/10" },
                    { label: "実装・構築", order: 3, status: "active", date: "現在進行中" },
                    { label: "テスト・修正", order: 4, status: "pending", date: "12/28 予定" },
                    { label: "納品", order: 5, status: "pending", date: "12/31 予定" },
                ]
            },
            tasks: {
                create: [
                    { title: "トップページの実装 (コーディング)", deadline: new Date("2025-12-25"), isUrgent: true },
                    { title: "下層ページ (About/Service) の実装", deadline: new Date("2025-12-27"), isUrgent: false },
                ]
            }
        }
    });
    return project;
}

export async function getProject(id: string) {
    // If no ID provided or not found, try to find the first one (for demo)
    if (!id || id === 'demo-project') {
        const first = await prisma.project.findFirst({
            include: { steps: { orderBy: { order: 'asc' } }, logs: { orderBy: { date: 'desc' } } }
        });
        if (!first) return await seedDemoData(); // Auto-seed if empty
        return first;
    }

    return await prisma.project.findUnique({
        where: { id },
        include: { steps: { orderBy: { order: 'asc' } }, logs: { orderBy: { date: 'desc' } } }
    });
}

export async function getWorkerTasks() {
    return await prisma.task.findMany({
        orderBy: { deadline: 'asc' },
        include: { project: true }
    });
}

export async function updateStepStatus(stepId: string, status: string, projectId: string) {
    await prisma.projectStep.update({
        where: { id: stepId },
        data: { status }
    });

    // Notify Client (Auto-dispatch to Email/LINE based on settings)
    try {
        await notifyClient(projectId, `ステータスが「${status}」に更新されました。`);
    } catch (e) {
        console.error("Failed to notify client", e);
    }

    revalidatePath(`/client/${projectId}`);
}

export async function submitTask(formData: FormData) {
    const taskId = formData.get('taskId') as string;
    const projectId = formData.get('projectId') as string;
    const taskTitle = formData.get('taskTitle') as string;

    if (!taskId || !projectId) return;

    // 1. Mark task as done
    await prisma.task.update({
        where: { id: taskId },
        data: { isDone: true }
    });

    // 2. Add Activity Log
    await prisma.activityLog.create({
        data: {
            projectId,
            title: `タスク「${taskTitle}」が提出・完了しました`,
        }
    });

    // 3. Notify Client
    try {
        await notifyClient(projectId, `タスク「${taskTitle}」の提出が完了しました。ご確認をお願いします。`);
    } catch (e) {
        console.error("Failed to notify", e);
    }

    revalidatePath('/worker');
    revalidatePath(`/client/${projectId}`);
}
