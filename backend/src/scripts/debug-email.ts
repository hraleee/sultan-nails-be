import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// Specify the path to .env explicitly to be sure
const envPath = path.resolve(__dirname, '../../.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

async function checkEmail() {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    console.log('----------------------------------------');
    console.log('EMAIL_USER:', user);
    // Show first 4 chars of password to verify it's loaded without revealing full secret
    console.log('EMAIL_PASS (masked):', pass ? `${pass.substring(0, 4)}...${pass.substring(pass.length - 2)}` : 'UNDEFINED');
    console.log('PASS Length:', pass ? pass.length : 0);
    console.log('----------------------------------------');

    if (!user || !pass) {
        console.error('❌ Missing credentials in .env');
        return;
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: user,
            pass: pass
        }
    });

    try {
        console.log('Attempting to send test email...');
        const info = await transporter.sendMail({
            from: user,
            to: user, // Send to self
            subject: 'Test Email from Sultan Nails Debugger',
            text: 'If you see this, the configuration is correct!'
        });
        console.log('✅ Email sent successfully!');
        console.log('Message ID:', info.messageId);
    } catch (error: any) {
        console.error('❌ Email failed:', error.message);
        if (error.response) {
            console.error('SMTP Response:', error.response);
        }
    }
}

checkEmail();
