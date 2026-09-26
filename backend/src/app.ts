import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './modules/auth/auth.routes';
import aiRoutes from './modules/ai/ai.routes';

dotenv.config();

const app = express();

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

// CORS configuration
app.use(
  cors({
    origin: [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'RouteBatch-AI API', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: `Endpoint not found: ${req.method} ${req.url}` });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
