import('apminsight')
  .then(({ default: AgentAPI }) => AgentAPI.config())
  .catch(() => console.log('APM not available in this environment'));

import cors from "cors";
import express from "express";
import { toNodeHandler } from "better-auth/node";

import subjectsRouter from "./routes/subjects.js";
import usersRouter from "./routes/users.js";
import classesRouter from "./routes/classes.js";
import departmentsRouter from "./routes/departments.js";
import statsRouter from "./routes/stats.js";
import enrollmentsRouter from "./routes/enrollments.js";

// import securityMiddleware from "./middleware/security.js";
import { auth } from "./lib/auth.js";

const app = express();
const PORT = 8000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // React app URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed HTTP methods
    credentials: true, // allow cookies
  })
);

// parse JSON before auth handlers
app.use(express.json());

// Pre-process sign-up requests to ensure required fields and defaults
app.post("/api/auth/sign-up/email", (req, _res, next) => {
  try {
    const body = req.body ?? {};

    // ensure name exists; fallback to local-part of email
    if (!body.name && body.email && typeof body.email === "string") {
      const local = body.email.split("@")[0] || body.email;
      body.name = local;
    }

    // ensure role defaults to 'student' when missing
    if (!body.role) {
      body.role = "student";
    }

    // generate image as first two characters of the name when missing
    if (!body.image && body.name && typeof body.name === "string") {
      const initials = body.name
        .trim()
        .split(/\s+/)
        .map((p: string) => p.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();
      body.image = initials;
    }

    req.body = body;
    next();
  } catch (err) {
    next(err);
  }
});

app.all("/api/auth/*splat", toNodeHandler(auth));

// app.use(securityMiddleware);

app.use("/api/subjects", subjectsRouter);
app.use("/api/users", usersRouter);
app.use("/api/classes", classesRouter);
app.use("/api/departments", departmentsRouter);
app.use("/api/stats", statsRouter);
app.use("/api/enrollments", enrollmentsRouter);

app.get("/", (req, res) => {
  res.send("Backend server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Error handler to translate DB unique-constraint errors to friendly responses
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);

  // handle Postgres unique violation for email
  const code = err?.cause?.code ?? err?.cause?.sourceError?.code;
  const detail = err?.cause?.detail ?? err?.cause?.sourceError?.detail ?? "";

  if (code === "23505" && /user_email_unique|user_email_key|unique constraint.*email/i.test(detail + "")) {
    return res.status(409).json({ error: "Email already exists" });
  }

  // fallback
  return res.status(err?.status || 500).json({ error: err?.message || "Internal Server Error" });
});