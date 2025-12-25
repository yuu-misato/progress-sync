import styles from "./worker.module.css";
import { getWorkerTasks } from "@/lib/actions";

export default async function WorkerDashboard() {
    const tasks = await getWorkerTasks();

    // Basic stats
    const unfinished = tasks.filter(t => !t.isDone).length;
    const urgent = tasks.filter(t => !t.isDone && t.isUrgent).length;
    const completed = 12; // Placeholder

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
                    {tasks.map((task) => (
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
                                        期限: {task.deadline.toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <form>
                                    <button className={styles.submitBtn}>提出する</button>
                                </form>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
