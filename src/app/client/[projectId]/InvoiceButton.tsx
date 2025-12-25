"use client";

import React from 'react';
import styles from "./client.module.css";
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// Note: Direct import might cause SSR issues even if component is client-side 
// because Next.js pre-renders client components.
// We will dynamically import in the handler.

interface InvoiceButtonProps {
    project: any;
}

export default function InvoiceButton({ project }: InvoiceButtonProps) {
    const handleDownload = async () => {
        try {
            const jsPDF = (await import('jspdf')).default;
            const autoTable = (await import('jspdf-autotable')).default;

            const doc = new jsPDF();

            // Set font (standard font for now, Japanese requires custom font loading)
            // Ideally we load a font here, but for "Demo" we use standard ASCII or skip JP chars if needed.
            // However, our data is Japanese. jsPDF default font doesn't support JP.
            // FOR DEMO: We will assume English for critical parts or valid JP font is tricky without serving static file.
            // ALTERNATIVE: Use HTML to Canvas or just simple ASCII invoice for now.
            // Let's try to simulate a simple invoice content.

            doc.setFontSize(20);
            doc.text("INVOICE", 105, 20, { align: "center" });

            doc.setFontSize(12);
            doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 40);
            doc.text(`Client: ${project.clientName}`, 20, 50);
            doc.text(`Project: ${project.name}`, 20, 60);

            // Table
            (doc as any).autoTable({
                startY: 70,
                head: [['Item', 'Status', 'Date']],
                body: project.steps.map((s: any) => [s.label, s.status, s.date || '-']),
            });

            const finalY = (doc as any).lastAutoTable.finalY + 20;
            doc.text("Total Amount: (JPY) 1,500,000", 140, finalY);

            doc.save("invoice.pdf");
        } catch (e) {
            console.error("PDF generation failed", e);
            alert("PDF生成に失敗しました");
        }
    };

    return (
        <button className={styles.downloadBtn} onClick={handleDownload} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            請求書ダウンロード (PDF)
        </button>
    );
}
