import { getProject } from "@/lib/actions";
import styles from "./client.module.css";
import InvoiceButton from "./InvoiceButton";

export default async function ClientPage({ params }: { params: { projectId: string } }) {
    // Fetch real project data from DB
    // params is a promise in latest Next.js but usually resolved in props for now. 
    // Wait, in Next.js 15 params is async, in 14 it's not. Assuming 14/15 compat.
    // Safe to access params.projectId if not using experimental.

    // Note: getProject handles "demo-project" or default ID if needed, 
    // but for real ID it fetches from DB.
    const project = await getProject(params.projectId);

    if (!project) {
        return <div className="container">Project not found</div>;
    }

    // Determine current step (active or last completed)
    // We need to type cast or ensure getProject returns steps with status.
    // The prisma include returns steps.
    const steps = (project as any).steps || [];
    const currentStep = steps.find((s: any) => s.status === 'active') || steps[steps.length - 1];

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className={styles.projectName}>{project.name}</h1>
                        <p className={styles.clientName}>{project.clientName}</p>
                    </div>
                    <InvoiceButton project={project as any} />
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
                            {(project as any).steps.map((step: any, index: number) => (
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
                        {(project as any).logs.length === 0 && <p className={styles.logDate}>まだアクティビティはありません</p>}
                        {(project as any).logs.map((log: any) => (
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
