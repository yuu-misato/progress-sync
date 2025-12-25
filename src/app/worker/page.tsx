"use client";

import { useState } from "react";
import styles from "./worker.module.css";
// import { getWorkerTasks, submitTask } from "@/lib/actions";

// Mock Data for Static Export
const MOCK_TASKS = [
    {
        id: "1", projectId: "p1", title: "トップページの実装 (コーディング)", deadline: new Date("2025-12-25"), isUrgent: true, isDone: false,
        project: { name: "株式会社サンプル Web制作" }
    },
    {
        id: "2", projectId: "p1", title: "下層ページ (About/Service) の実装", deadline: new Date("2025-12-27"), isUrgent: false, isDone: false,
        project: { name: "株式会社サンプル Web制作" }
    },
];

export default function WorkerDashboard() {
    const [tasks, setTasks] = useState<any[]>(MOCK_TASKS);

    // Basic stats
    const unfinished = tasks.filter(t => !t.isDone).length;
    const urgent = tasks.filter(t => !t.isDone && t.isUrgent).length;
    const completed = tasks.filter(t => t.isDone).length;

    const handleSubmit = (taskId: string) => {
        // Client-side optimistic update for demo
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isDone: true } : t));
        alert("提出完了しました（デモモード）");
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <h1 className={styles.title}>お疲れ様です、田中さん</h1>
                </div>
            </header>

            <main className="container">
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>未完了タスク</span>
                        <span className={styles.statValue}>{unfinished}</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>今日締切/至急</span>
                        <span
                            className={styles.statValue}
                            style={{ color: "var(--danger)" }}
                        >
                            {urgent}
                        </span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>今月の納品完了</span>
                        <span
                            className={styles.statValue}
                            style={{ color: "var(--success)" }}
                        >
                            {completed}
                        </span>
                    </div>
                </div>

                <h2 className={styles.sectionTitle}>あなたのタスク</h2>

                <div className={styles.taskList}>
                    {tasks.filter(t => !t.isDone).map((task) => (
                        <div key={task.id} className={styles.taskItem}>
                            <div className={styles.taskInfo}>
                                <span className={styles.projectBadge}>{task.project?.name || '案件'}</span>
                                <h3 className={styles.taskName}>{task.title}</h3>
                                <div className={styles.taskMeta}>
                                    <span
                                        className={`${styles.deadline} ${task.isUrgent ? styles.urgent : ""
                                            }`}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                        期限: {new Date(task.deadline).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <button
                                    className={styles.submitBtn}
                                    onClick={() => handleSubmit(task.id)}
                                >
                                    提出する
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
