import styles from "./client.module.css";

// Mock Data for the Demo
const PROJECT_DATA = {
    name: "株式会社サンプル 新規Webサイト制作",
    client: "株式会社サンプル 御中",
    statusBadge: "進行中 (実装)",
    steps: [
        { label: "要件定義", date: "2025/12/01", status: "completed" },
        { label: "デザイン", date: "2025/12/10", status: "completed" },
        { label: "実装・構築", date: "現在進行中", status: "active" },
        { label: "テスト・修正", date: "12/28 予定", status: "pending" },
        { label: "納品", date: "12/31 予定", status: "pending" },
    ],
    logs: [
        { date: "2025/12/25 14:00", title: "トップページのコーディングが完了しました" },
        { date: "2025/12/25 10:30", title: "開発環境の構築が完了しました" },
        { date: "2025/12/24 16:00", title: "デザイン最終承認を受領しました" },
        { date: "2025/12/20 11:00", title: "デザイン初稿を提出しました" },
    ],
};

export default function ClientPage() {
    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <h1 className={styles.projectName}>{PROJECT_DATA.name}</h1>
                    <p className={styles.clientName}>{PROJECT_DATA.client}</p>
                </div>
            </header>

            <main className="container">
                <section className={styles.section}>
                    <div className={styles.statusCard}>
                        <div className={styles.statusHeader}>
                            <h2>現在の進捗状況</h2>
                            <span className={styles.statusBadge}>
                                {PROJECT_DATA.statusBadge}
                            </span>
                        </div>

                        <div className={styles.tracker}>
                            {PROJECT_DATA.steps.map((step, index) => (
                                <div
                                    key={index}
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
                        {PROJECT_DATA.logs.map((log, i) => (
                            <div key={i} className={styles.logItem}>
                                <span className={styles.logDate}>{log.date}</span>
                                <span className={styles.logTitle}>{log.title}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
