import { Request, Response } from 'express';
import { emailService } from '../services/email';
import { supabase } from '../db/connection';

export const debugRoutes = async (req: Request, res: Response) => {
    const { to } = req.query;
    const targetEmail = to as string || process.env.EMAIL_USER;

    try {
        const frontendUrl = process.env.FRONTEND_URL;
        const emailUser = process.env.EMAIL_USER;

        console.log(`[DEBUG] Testing email to: ${targetEmail}`);
        console.log(`[DEBUG] FRONTEND_URL: ${frontendUrl}`);
        console.log(`[DEBUG] EMAIL_USER: ${emailUser}`);

        if (!emailUser) {
            return res.status(500).json({ error: 'EMAIL_USER not set on server' });
        }

        // Send a test email
        await emailService.sendVerificationEmail(targetEmail, '123456');

        res.json({
            status: 'success',
            message: `Email test sent to ${targetEmail}`,
            config: {
                frontendUrl,
                emailUser: emailUser ? 'SET' : 'MISSING',
                nodeEnv: process.env.NODE_ENV
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('[DEBUG] Email test failed:', error);
        res.status(500).json({
            status: 'error',
            error: String(error),
            details: error
        });
    }
};
