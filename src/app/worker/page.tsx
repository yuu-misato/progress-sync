"use client";

import { useState, useEffect } from "react";
import styles from "./worker.module.css";
import { getWorkerTasks, submitTask } from "@/lib/actions"; // Use real actions
import UploadZone from "./UploadZone";

export default function WorkerDashboard() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [files, setFiles] = useState<{ [key: string]: File }>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getWorkerTasks();
                setTasks(data);
            } catch (error) {
                console.error("Failed to load tasks", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    // Basic stats
    const unfinished = tasks.filter(t => !t.isDone).length;
    const urgent = tasks.filter(t => !t.isDone && t.isUrgent).length;
    const completed = tasks.filter(t => t.isDone).length;

    const handleFileSelect = (taskId: string, file: File) => {
        setFiles(prev => ({ ...prev, [taskId]: file }));
    };

    const handleSubmit = async (taskId: string, e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const projectId = tasks.find(t => t.id === taskId)?.projectId;

        if (!projectId) return;

        // Append hidden fields
        formData.append('taskId', taskId);
        formData.append('projectId', projectId);
        formData.append('taskTitle', tasks.find(t => t.id === taskId)?.title || "");

        // In a real S3 scenario, we would upload the file here and get a URL
        // Then pass the URL to the server action.
        const file = files[taskId];
        if (file) {
            // Mock Upload: We'll just pass the filename as if it was uploaded
            // In production, await uploadToS3(file) -> url
            formData.append('attachmentName', file.name);
            console.log(`Uploading ${file.name} to mock storage...`);
        }

        try {
            await submitTask(formData);

            // Optimistic update
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isDone: true } : t));
            alert("提出が完了しました！\n管理者へ通知が送信されました。");
        } catch (error) {
            console.error("Submission failed", error);
            alert("提出に失敗しました");
        }
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
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>タスクを読み込んでいます...</div>
                    ) : tasks.filter(t => !t.isDone).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>現在担当している未完了タスクはありません。素晴らしい！</div>
                    ) : (
                        tasks.filter(t => !t.isDone).map((task) => (
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

                                <form className={styles.submissionForm} onSubmit={(e) => handleSubmit(task.id, e)}>
                                    <div className={styles.formGroup}>
                                        <input
                                            type="text"
                                            name="submitTitle"
                                            placeholder="提出物のタイトル (例: 初稿デザイン)"
                                            className={styles.input}
                                            required
                                        />
                                    </div>

                                    {/* Upload Zone */}
                                    <div className={styles.formGroup}>
                                        <UploadZone onFileSelect={(file) => handleFileSelect(task.id, file)} />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <textarea
                                            name="submitComment"
                                            placeholder="コメント、共有URL、補足事項など"
                                            className={styles.textarea}
                                            rows={2}
                                        />
                                    </div>
                                    <div className={styles.actions}>
                                        <button
                                            type="submit"
                                            className={styles.submitBtn}
                                        >
                                            提出する
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
