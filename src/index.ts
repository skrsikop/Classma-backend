import AgentAPI from 'apminsight'
AgentAPI.config()

import express  from 'express';
import 'dotenv/config';
import subjectsRouter from './routes/subjects.js';
import cors from 'cors'
import securityMiddleware from './middleware/security.js';
import { auth } from './lib/auth.js';
import {toNodeHandler} from 'better-auth/node';

const app = express();
const port = 8000;

const FRONTEND_URL = process.env.FRONTEND_URL;
if (!FRONTEND_URL) {
  console.warn('Warning: FRONTEND_URL not set. CORS will be restrictive.');
}
+
 app.use(cors({
  origin: FRONTEND_URL || false, // false disables CORS if not configured
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
 }))

 app.all('/api/auth/*splat', toNodeHandler(auth));
 
app.use(express.json());
app.use(securityMiddleware)

app.use('/api/subjects', subjectsRouter)
app.get("/", (req, res) => {
    res.send("Hello from backend!");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});