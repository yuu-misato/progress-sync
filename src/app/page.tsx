import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.logo}>Progress Sync</h1>
        </div>
      </header>

      <div className={styles.content}>
        <div className="container">
          <h2 className={styles.title}>
            プロジェクトの進捗を、
            <br />
            かつてないほど透明に。
          </h2>
          <p className={styles.subtitle}>
            製造・制作現場のための、直感的な進捗管理プラットフォーム
          </p>

          <div className={styles.grid}>
            {/* Client Card */}
            <Link href="/client/demo-project" className={styles.card}>
              <div className={styles.cardIcon}>🏢</div>
              <h3>お客様はこちら</h3>
              <p>
                プロジェクトの現在の状況・進捗を
                <br />
                リアルタイムで確認できます。
              </p>
              <span className={styles.arrow}>進捗を確認する &rarr;</span>
            </Link>

            {/* Worker Card */}
            <Link href="/worker" className={styles.card}>
              <div className={styles.cardIcon}>🎨</div>
              <h3>クリエイター・担当者</h3>
              <p>
                タスクの確認、スケジュールの管理、
                <br />
                納品物の提出はこちらから。
              </p>
              <span className={styles.arrow}>ワークスペースへ &rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
