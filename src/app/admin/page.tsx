"use client";

import { useState } from "react";
import styles from "./admin.module.css";

// Mock Data: Submissions to review
const MOCK_SUBMISSIONS = [
    {
        id: "sub-1",
        workerName: "田中 健太",
        taskTitle: "トップページの実装 (コーディング)",
        projectTitle: "株式会社サンプル Web制作",
        submittedAt: "2025-12-25 10:30",
        comment: "初稿が完了しました。SP表示の際に一部メニューが崩れる可能性がありますが、PC版はFIXです。ご確認お願いします。",
        status: "pending" // pending, approved, rejected
    },
    {
        id: "sub-2",
        workerName: "鈴木 美咲",
        taskTitle: "ロゴデザイン A案・B案",
        projectTitle: "新規ブランド立ち上げ",
        submittedAt: "2025-12-24 18:00",
        comment: "A案はシンプルさを、B案は親しみやすさを重視しました。",
        status: "pending"
    }
];

export default function AdminDashboard() {
    const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS);
    const [selectedId, setSelectedId] = useState<string | null>(MOCK_SUBMISSIONS[0].id);
    const [feedback, setFeedback] = useState("");

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

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={`container ${styles.headerContainer}`}>
                    <h1 className={styles.title}>
                        Manager Cockpit
                        {pendingCount > 0 && <span className={styles.badge}>{pendingCount}件のレビュー待ち</span>}
                    </h1>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>ログイン中: 管理者</div>
                </div>
            </header>

            <main className={`container ${styles.grid}`}>
                {/* Sidebar: List of Creators/Submissions */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>レビュー待ち一覧</div>
                    {submissions.map(sub => (
                        <div
                            key={sub.id}
                            className={`${styles.creatorItem} ${selectedId === sub.id ? styles.active : ''}`}
                            onClick={() => setSelectedId(sub.id)}
                            style={{ opacity: sub.status !== 'pending' ? 0.5 : 1 }}
                        >
                            <span className={styles.creatorName}>{sub.workerName}</span>
                            <div className={styles.creatorMeta}>{sub.taskTitle}</div>
                            <div className={styles.creatorMeta} style={{ marginTop: '4px', fontSize: '0.75rem' }}>
                                {sub.status === 'approved' ? '✅ 承認済み' : sub.status === 'rejected' ? '⚠️ 修正依頼中' : 'PC・SP確認待ち'}
                            </div>
                        </div>
                    ))}
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
                            左のメニューからレビューする項目を選択してください
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
