"use client";

import { useEffect, useState } from "react";
import styles from "./client.module.css";
// import { getProject } from "@/lib/actions"; // Server Actions cannot be called directly in static export if not careful

type ProjectWithDetails = {
    id: string;
    name: string;
    clientName: string;
    steps: { id: string; label: string; status: string; date: string | null }[];
    logs: { id: string; title: string; date: Date }[];
};

// Mock Data for Static Export Fallback
const MOCK_PROJECT = {
    name: "株式会社サンプル 新規Webサイト制作",
    clientName: "株式会社サンプル 御中",
    steps: [
        { id: "1", label: "要件定義", order: 1, status: "completed", date: "2025/12/01" },
        { id: "2", label: "デザイン", order: 2, status: "completed", date: "2025/12/10" },
        { id: "3", label: "実装・構築", order: 3, status: "active", date: "現在進行中" },
        { id: "4", label: "テスト・修正", order: 4, status: "pending", date: "12/28 予定" },
        { id: "5", label: "納品", order: 5, status: "pending", date: "12/31 予定" },
    ],
    logs: []
};

// Required for static export: generate params for known paths
export async function generateStaticParams() {
    return [{ projectId: 'demo-project' }];
}

export default function ClientPage() {
    // In a real static export, we would fetch from an API endpoint here.
    // For now, we use state initialized with mock/empty to ensure it builds.
    const [project, setProject] = useState<any>(MOCK_PROJECT);

    // If using dynamic routes in static export, we need generateStaticParams.
    // For this prototype, we'll just render the view.

    const currentStep = project.steps.find((s: any) => s.status === 'active') || project.steps[project.steps.length - 1];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <h1 className={styles.projectName}>{project.name}</h1>
                    <p className={styles.clientName}>{project.clientName}</p>
                </div>
            </header>

            <main className="container">
                <section className={styles.section}>
                    <div className={styles.statusCard}>
                        <div className={styles.statusHeader}>
                            <h2>現在の進捗状況</h2>
                            <span className={styles.statusBadge}>
                                {currentStep?.label} (進行中)
                            </span>
                        </div>

                        <div className={styles.tracker}>
                            {project.steps.map((step: any, index: number) => (
                                <div
                                    key={step.id || index}
                                    className={`${styles.step} ${styles[step.status]}`}
                                >
                                    <div className={styles.stepBubble}>
                                        {step.status === "completed" ? (
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        ) : (
                                            index + 1
                                        )}
                                    </div>
                                    <div className={styles.stepInfo}>
                                        <div className={styles.stepLabel}>{step.label}</div>
                                        <div className={styles.stepDate}>{step.date}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={styles.section}>
                    <h3>最新のアクティビティ</h3>
                    <div className={styles.timeline}>
                        {project.logs.length === 0 && <p className={styles.logDate}>まだアクティビティはありません</p>}
                        {project.logs.map((log: any) => (
                            <div key={log.id} className={styles.logItem}>
                                <span className={styles.logDate}>{new Date(log.date).toLocaleDateString()}</span>
                                <span className={styles.logTitle}>{log.title}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
