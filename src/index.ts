import express  from 'express';
import 'dotenv/config';
import subjectsRouter from './routes/subjects';
import cors from 'cors'

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
 
app.use(express.json());
app.use('/api/subjects', subjectsRouter)
app.get("/", (req, res) => {
    res.send("Hello from backend!");
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});