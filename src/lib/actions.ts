// src/lib/actions.ts
'use server';

import { PrismaClient } from '@prisma/client';
import { sendProgressNotification } from './line-bot';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

// Seed function for demo
export async function seedDemoData() {
    const project = await prisma.project.create({
        data: {
            name: "株式会社サンプル 新規Webサイト制作",
            clientName: "株式会社サンプル 御中",
            status: "active",
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

    // Notify LINE
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (project && project.lineUserId) {
        await sendProgressNotification(project.lineUserId, `[進捗更新] プロジェクト「${project.name}」のステータスが更新されました。`);
    }

    revalidatePath(`/client/${projectId}`);
}
