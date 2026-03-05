import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import apiRoutes from './routes/apiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
