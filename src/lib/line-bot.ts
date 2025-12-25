// src/lib/line-bot.ts
import { Client } from '@line/bot-sdk';

const client = new Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || 'mock_token',
    channelSecret: process.env.LINE_CHANNEL_SECRET || 'mock_secret',
});

export async function sendProgressNotification(userId: string, message: string) {
    if (!process.env.LINE_CHANNEL_ACCESS_TOKEN) {
        console.log(`[MOCK LINE] Sending to ${userId}: ${message}`);
        return;
    }

    try {
        await client.pushMessage(userId, {
            type: 'text',
            text: message,
        });
    } catch (error) {
        console.error('Failed to send LINE message:', error);
    }
}
