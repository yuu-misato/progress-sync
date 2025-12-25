'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { authenticate } from '@/lib/actions';
import styles from './login.module.css';

export default function LoginPage() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined);

    return (
        <div className={styles.container}>
            <form action={dispatch} className={styles.form}>
                <h1 className={styles.title}>管理者ログイン</h1>
                <div className={styles.field}>
                    <label htmlFor="email">メールアドレス</label>
                    <input
                        className={styles.input}
                        id="email"
                        type="email"
                        name="email"
                        required
                        placeholder="admin@example.com"
                    />
                </div>
                <div className={styles.field}>
                    <label htmlFor="password">パスワード</label>
                    <input
                        className={styles.input}
                        id="password"
                        type="password"
                        name="password"
                        required
                        minLength={6}
                    />
                </div>
                <div className={styles.actions}>
                    <LoginButton />
                </div>
                <div
                    className={styles.error}
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <>
                            <p>{errorMessage}</p>
                        </>
                    )}
                </div>
            </form>
        </div>
    );
}

function LoginButton() {
    const { pending } = useFormStatus();

    return (
        <button className={styles.button} aria-disabled={pending}>
            {pending ? 'ログイン中...' : 'ログイン'}
        </button>
    );
}
