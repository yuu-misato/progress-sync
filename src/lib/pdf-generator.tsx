// src/lib/pdf-generator.tsx
import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

// 日本語フォントの登録 (Noto Sans JP等を登録する必要がありますが、
// 簡易的に標準のHelvetica等で実装し、本番ではフォントファイルをロードします)
// ※注意: @react-pdf/rendererで日本語を使うにはフォント登録が必須です。
// 今回はアルファベットのみの簡易版、もしくはフォント登録ロジックを含めます。

Font.register({
    family: 'NotoSansJP',
    src: 'https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8_1v4f5l4.woff2', // URLからのロード(例)
});

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
        padding: 30,
        fontFamily: 'Helvetica', // 日本語フォント設定時は 'NotoSansJP'
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#112233',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        textAlign: 'center',
        marginBottom: 10,
        fontWeight: 'bold',
    },
    section: {
        margin: 10,
        padding: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    label: {
        fontSize: 12,
        color: '#666',
    },
    value: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    total: {
        marginTop: 20,
        borderTopWidth: 1,
        paddingTop: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    totalText: {
        fontSize: 16,
        fontWeight: 'bold',
    }
});

interface InvoiceProps {
    project: {
        name: string;
        clientName: string;
        amount: number;
        date: string;
    };
}

export const InvoiceDocument = ({ project }: InvoiceProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.title}>INVOICE</Text>
                <Text style={{ fontSize: 10, textAlign: 'right' }}>Date: {project.date}</Text>
            </View>

            <View style={styles.section}>
                <Text style={{ fontSize: 14, marginBottom: 10 }}>Bill To:</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{project.clientName}</Text>
            </View>

            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.label}>Project Name:</Text>
                    <Text style={styles.value}>{project.name}</Text>
                </View>
            </View>

            <View style={styles.total}>
                <Text style={styles.totalText}>Total: ¥{project.amount.toLocaleString()}</Text>
            </View>

            <View style={{ position: 'absolute', bottom: 30, left: 30, right: 30 }}>
                <Text style={{ fontSize: 10, textAlign: 'center', color: '#999' }}>
                    Thank you for your business.
                </Text>
            </View>
        </Page>
    </Document>
);
