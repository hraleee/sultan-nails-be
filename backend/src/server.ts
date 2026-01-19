import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './db/connection';
import authRoutes from './routes/auth';
import bookingRoutes from './routes/bookings';
import adminRoutes from './routes/admin';
import userRoutes from './routes/user';
import servicesRoutes from './routes/services';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Sultan Nails API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/services', servicesRoutes);

// Test database connection
supabase.from('users').select('count', { count: 'exact', head: true })
  .then(({ error }: { error: any }) => {
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
    } else {
      console.log('✅ Supabase connected successfully');
    }
  });

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

