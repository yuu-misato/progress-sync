import styles from "./client.module.css";
import { getProject } from "@/lib/actions";

// Define types locally or import from Prisma generated types if preferred
type ProjectWithDetails = {
    id: string;
    name: string;
    clientName: string;
    steps: { id: string; label: string; status: string; date: string | null }[];
    logs: { id: string; title: string; date: Date }[];
};

export default async function ClientPage({
    params,
}: {
    params: { projectId: string };
}) {
    // Fetch real data from DB and cast to type (Prisma types prefered in real app)
    const project = await getProject(params.projectId) as ProjectWithDetails | null;

    // Fallback if something fails (should handle 404 in real app)
    if (!project) return <div>Project not found</div>;

    const currentStep = project.steps.find(s => s.status === 'active') || project.steps[project.steps.length - 1];

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
                            {project.steps.map((step, index) => (
                                <div
                                    key={step.id}
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
                        {project.logs.map((log) => (
                            <div key={log.id} className={styles.logItem}>
                                <span className={styles.logDate}>{log.date.toLocaleDateString()}</span>
                                <span className={styles.logTitle}>{log.title}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
