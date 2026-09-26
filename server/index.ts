import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api', apiRoutes);

// Static frontend serving in production
const publicPath = path.resolve(process.cwd(), 'dist/public');
app.use(express.static(publicPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(publicPath, 'index.html');
  res.sendFile(indexPath);
});

// Start Server if not imported by test framework
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` LawLens AI — Server Active`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`==================================================`);
  });
}

export default app;
