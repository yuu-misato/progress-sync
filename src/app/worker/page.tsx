import styles from "./worker.module.css";

const TASKS = [
    {
        id: 1,
        project: "株式会社サンプル Web制作",
        title: "トップページの実装 (コーディング)",
        deadline: "2025/12/25",
        deadlineLabel: "今日",
        urgent: true,
    },
    {
        id: 2,
        project: "株式会社サンプル Web制作",
        title: "下層ページ (About/Service) の実装",
        deadline: "2025/12/27",
        deadlineLabel: "残り2日",
        urgent: false,
    },
    {
        id: 3,
        project: "新商品キャンペーンLP",
        title: "デザイン初稿の作成",
        deadline: "2025/12/30",
        deadlineLabel: "残り5日",
        urgent: false,
    },
];

export default function WorkerDashboard() {
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
                        <span className={styles.statValue}>3</span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>今日締切</span>
                        <span
                            className={styles.statValue}
                            style={{ color: "var(--danger)" }}
                        >
                            1
                        </span>
                    </div>
                    <div className={styles.statCard}>
                        <span className={styles.statLabel}>今月の納品完了</span>
                        <span
                            className={styles.statValue}
                            style={{ color: "var(--success)" }}
                        >
                            12
                        </span>
                    </div>
                </div>

                <h2 className={styles.sectionTitle}>あなたのタスク</h2>

                <div className={styles.taskList}>
                    {TASKS.map((task) => (
                        <div key={task.id} className={styles.taskItem}>
                            <div className={styles.taskInfo}>
                                <span className={styles.projectBadge}>{task.project}</span>
                                <h3 className={styles.taskName}>{task.title}</h3>
                                <div className={styles.taskMeta}>
                                    <span
                                        className={`${styles.deadline} ${task.urgent ? styles.urgent : ""
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
                                        期限: {task.deadline} ({task.deadlineLabel})
                                    </span>
                                </div>
                            </div>
                            <div className={styles.actions}>
                                <button className={styles.submitBtn}>提出する</button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
