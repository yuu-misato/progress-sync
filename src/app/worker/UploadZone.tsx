"use client";

import { useState, useCallback } from 'react';
import styles from './upload.module.css';

interface UploadZoneProps {
    onFileSelect: (file: File) => void;
}

export default function UploadZone({ onFileSelect }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setSelectedFile(file);
            onFileSelect(file);
        }
    }, [onFileSelect]);

    return (
        <div
            className={`${styles.zone} ${isDragging ? styles.active : ''} ${selectedFile ? styles.hasFile : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                className={styles.hiddenInput}
                onChange={handleFileInput}
                id="file-upload"
            />

            <label htmlFor="file-upload" className={styles.label}>
                {selectedFile ? (
                    <div className={styles.fileInfo}>
                        <div className={styles.icon}>📄</div>
                        <div className={styles.details}>
                            <span className={styles.filename}>{selectedFile.name}</span>
                            <span className={styles.size}>{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                        <div className={styles.badge}>Ready to Submit</div>
                    </div>
                ) : (
                    <div className={styles.placeholder}>
                        <div className={styles.uploadIcon}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                        </div>
                        <p className={styles.text}>
                            ファイルをドラッグ＆ドロップ、
                            <br />
                            または<span className={styles.link}>クリックして選択</span>
                        </p>
                        <p className={styles.subtext}>PDF, ZIP, PNG, JPG (最大 50MB)</p>
                    </div>
                )}
            </label>
        </div>
    );
}
