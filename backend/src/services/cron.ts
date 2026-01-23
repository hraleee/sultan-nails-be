
import cron from 'node-cron';
import { supabase } from '../db/connection';
import { emailService } from './email';

export const schedulerService = {
    init: () => {
        console.log('⏳ Scheduler service initialized');

        // Check every day at 08:00 AM (Reminders)
        cron.schedule('0 8 * * *', async () => {
            console.log('Running daily reminder check...');
            await checkSameDayReminders();
            await checkWeeklyReminders();
        });

        // Cleanup unverified users every day at 03:00 AM
        cron.schedule('0 3 * * *', async () => {
            console.log('Running daily unverified user cleanup...');
            await checkUnverifiedUsers();
        });
    },

    // Method for manual testing
    runNow: async (simulatedDate?: string) => {
        const targetDate = simulatedDate ? new Date(simulatedDate) : new Date();
        console.log(`🔄 Manually triggering reminder checks for date: ${targetDate.toISOString()}...`);
        await checkSameDayReminders(targetDate);
        await checkSameDayReminders(targetDate);
        // We could also simulate weekly reminders relative to this date if needed
        await checkWeeklyReminders(targetDate);

        // For testing: Cleanup unverified users immediately (0ms retention)
        console.log('🔄 Manually triggering unverified user cleanup (immediate)...');
        await checkUnverifiedUsers(0);

        return { message: 'Checks executed' };
    }
};

const checkSameDayReminders = async (targetDate: Date = new Date()) => {
    try {
        const todayStart = new Date(targetDate);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(targetDate);
        todayEnd.setHours(23, 59, 59, 999);

        // Fetch bookings for today
        const { data: todaysBookings, error } = await supabase
            .from('bookings')
            .select(`
                *,
                users (email, first_name)
            `)
            .gte('booking_date', todayStart.toISOString())
            .lte('booking_date', todayEnd.toISOString())
            .eq('status', 'confirmed');

        if (error) throw error;

        if (todaysBookings && todaysBookings.length > 0) {
            console.log(`Found ${todaysBookings.length} bookings for today. Sending reminders...`);
            for (const booking of todaysBookings) {
                const user = booking.users as any;
                if (user && user.email) {
                    await emailService.sendSameDayReminderEmail(user.email, booking);
                }
            }
        }
    } catch (error) {
        console.error('Error in checkSameDayReminders:', error);
    }
};

const checkWeeklyReminders = async (targetDate: Date = new Date()) => {
    try {
        const today = new Date(targetDate);
        today.setHours(0, 0, 0, 0);

        // Fetch ALL future confirmed bookings
        const { data: futureBookings, error } = await supabase
            .from('bookings')
            .select(`
                *,
                users (email, first_name)
            `)
            .gt('booking_date', today.toISOString())
            .eq('status', 'confirmed');

        if (error) throw error;

        if (futureBookings) {
            for (const booking of futureBookings) {
                const bookingDate = new Date(booking.booking_date);
                bookingDate.setHours(0, 0, 0, 0);

                const diffTime = Math.abs(bookingDate.getTime() - today.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                // Check if exact weeks away (7, 14, 21...) and at least 1 week away
                if (diffDays > 0 && diffDays % 7 === 0) {
                    const weeksUntil = diffDays / 7;
                    const user = booking.users as any;
                    if (user && user.email) {
                        console.log(`Sending ${weeksUntil}-week reminder to ${user.email} for booking on ${booking.booking_date}`);
                        await emailService.sendWeeklyReminderEmail(user.email, booking, weeksUntil);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error in checkWeeklyReminders:', error);
    }
};

// Default retention: 24 hours
const checkUnverifiedUsers = async (retentionMs: number = 24 * 60 * 60 * 1000) => {
    try {
        const cutoffDate = new Date(Date.now() - retentionMs);

        // Delete users who are NOT verified AND created before the cutoff
        const { count, error } = await supabase
            .from('users')
            .delete({ count: 'exact' })
            .eq('is_verified', false)
            .lt('created_at', cutoffDate.toISOString());

        if (error) throw error;

        if (count && count > 0) {
            console.log(`🧹 Cleaned up ${count} unverified users created before ${cutoffDate.toISOString()}`);
        } else {
            console.log('🧹 No unverified users to clean up.');
        }

    } catch (error) {
        console.error('Error in checkUnverifiedUsers:', error);
    }
};
