"use client";

import { useState, useEffect } from "react";
import styles from "./admin.module.css";
import { createProject, getPendingReviews } from "@/lib/actions";

export default function AdminDashboard() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [feedback, setFeedback] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Project Creation State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newProject, setNewProject] = useState({
        name: "",
        client: "",
        deadline: "",
        budget: ""
    });

    useEffect(() => {
        async function loadData() {
            try {
                const data = await getPendingReviews();
                setSubmissions(data);
                if (data.length > 0) setSelectedId(data[0].id);
            } catch (error) {
                console.error("Failed to load submissions", error);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const selectedSubmission = submissions.find(s => s.id === selectedId);
    const pendingCount = submissions.filter(s => s.status === "pending").length;

    const handleReview = (status: "approved" | "rejected") => {
        if (!selectedSubmission) return;

        if (confirm(status === "approved" ? "この提出物を承認しますか？" : "修正依頼を出しますか？")) {
            setSubmissions(prev => prev.map(s =>
                s.id === selectedId ? { ...s, status } : s
            ));

            alert(`送信完了：\nステータス: ${status === "approved" ? "承認" : "差し戻し"}\nクリエイターへのコメント: ${feedback}`);
            setFeedback("");

            // Auto select next pending if available
            const next = submissions.find(s => s.id !== selectedId && s.status === "pending");
            if (next) setSelectedId(next.id);
        }
    };

    const handleCreateProject = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const project = await createProject({
                name: newProject.name,
                clientName: newProject.client,
                deadline: newProject.deadline,
                budget: newProject.budget
            });

            setIsModalOpen(false);

            // Use real IDs from the DB
            const inviteLinkClient = `https://progress-sync.app/client/${project.id}`;
            const inviteLinkWorker = `https://progress-sync.app/worker?project_id=${project.id}`; // Simplified invite logic

            alert(`プロジェクト「${project.name}」をDBに作成しました。\n\n【顧客用招待リンク】\n${inviteLinkClient}\n\n【クリエイター用招待リンク】\n${inviteLinkWorker}\n\n(※実データ連携完了)`);

            // Reset form
            setNewProject({ name: "", client: "", deadline: "", budget: "" });
        } catch (error) {
            alert("プロジェクト作成に失敗しました");
            console.error(error);
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={`container ${styles.headerContainer}`}>
                    <h1 className={styles.title}>
                        Manager Cockpit
                        {pendingCount > 0 && <span className={styles.badge}>{pendingCount}件のレビュー待ち</span>}
                    </h1>

                    <div className={styles.headerActions}>
                        <button className={styles.createBtn} onClick={() => setIsModalOpen(true)}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="12" y1="5" x2="12" y2="19"></line>
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            新規案件作成
                        </button>
                    </div>
                </div>
            </header>

            {/* Create Project Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>新規プロジェクト作成</h2>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
                        </div>
                        <form onSubmit={handleCreateProject}>
                            <div className={styles.modalBody}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>案件名</label>
                                    <input
                                        type="text"
                                        className={styles.inputSelect}
                                        placeholder="例: 株式会社サンプル コーポレートサイト制作"
                                        required
                                        value={newProject.name}
                                        onChange={e => setNewProject({ ...newProject, name: e.target.value })}
                                    />
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>クライアント名</label>
                                        <input
                                            type="text"
                                            className={styles.inputSelect}
                                            placeholder="例: 株式会社サンプル"
                                            required
                                            value={newProject.client}
                                            onChange={e => setNewProject({ ...newProject, client: e.target.value })}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.formLabel}>予算目安</label>
                                        <input
                                            type="text"
                                            className={styles.inputSelect}
                                            placeholder="例: 1,500,000"
                                            value={newProject.budget}
                                            onChange={e => setNewProject({ ...newProject, budget: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>納期</label>
                                    <input
                                        type="date"
                                        className={styles.inputSelect}
                                        required
                                        value={newProject.deadline}
                                        onChange={e => setNewProject({ ...newProject, deadline: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={`${styles.btn} ${styles.btnReject}`} onClick={() => setIsModalOpen(false)} style={{ border: 'none' }}>キャンセル</button>
                                <button type="submit" className={styles.createBtn} style={{ padding: '10px 24px' }}>作成してURL発行</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <main className={`container ${styles.grid}`}>
                {/* Sidebar: List of Creators/Submissions */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>レビュー待ち一覧</div>
                    {isLoading ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>読み込み中...</div>
                    ) : submissions.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>レビュー待ちはありません</div>
                    ) : (
                        submissions.map(sub => (
                            <div
                                key={sub.id}
                                className={`${styles.creatorItem} ${selectedId === sub.id ? styles.active : ''}`}
                                onClick={() => setSelectedId(sub.id)}
                            >
                                <span className={styles.creatorName}>{sub.workerName}</span>
                                <div className={styles.creatorMeta}>{sub.taskTitle}</div>
                                <div className={styles.creatorMeta} style={{ marginTop: '4px', fontSize: '0.75rem' }}>
                                    {sub.status === 'approved' ? '✅ 承認済み' : sub.status === 'rejected' ? '⚠️ 修正依頼中' : 'PC・SP確認待ち'}
                                </div>
                            </div>
                        ))
                    )}
                </aside>

                {/* Main Review Area */}
                <section className={styles.reviewArea}>
                    {selectedSubmission ? (
                        <div className={styles.reviewCard}>
                            <div className={styles.cardHeader}>
                                <div>
                                    <div className={styles.taskTitle}>{selectedSubmission.taskTitle}</div>
                                    <span className={styles.taskProject}>{selectedSubmission.projectTitle}</span>
                                </div>
                                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#666' }}>
                                    提出: {selectedSubmission.submittedAt}
                                </div>
                            </div>

                            <div className={styles.submissionContent}>
                                <div className={styles.submissionLabel}>クリエイターからのコメント:</div>
                                <div className={styles.submissionText}>
                                    {selectedSubmission.comment}
                                </div>

                                <div className={styles.submissionLabel}>成果物リンク (デモ):</div>
                                <a href="#" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                                    https://staging.example.com/preview/v1
                                </a>
                            </div>

                            {selectedSubmission.status === 'pending' && (
                                <div className={styles.feedbackForm}>
                                    <div className={styles.submissionLabel}>フィードバック / レビューコメント:</div>
                                    <textarea
                                        className={styles.textarea}
                                        placeholder="ここに入力した内容はクリエイターに通知されます（例: お疲れ様です！素晴らしい出来です。）"
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                    />
                                    <div className={styles.actions}>
                                        <button
                                            className={`${styles.btn} ${styles.btnReject}`}
                                            onClick={() => handleReview("rejected")}
                                        >
                                            修正を依頼する
                                        </button>
                                        <button
                                            className={`${styles.btn} ${styles.btnApprove}`}
                                            onClick={() => handleReview("approved")}
                                        >
                                            承認して完了にする
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedSubmission.status !== 'pending' && (
                                <div style={{ padding: '24px', background: '#f9fafb', borderTop: '1px solid #e5e7eb', textAlign: 'center', color: '#666' }}>
                                    このタスクは完了しています
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            {isLoading ? "データを取得しています..." : "左のメニューからレビューする項目を選択してください"}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
