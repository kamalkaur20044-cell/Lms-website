import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes    from "./routes/authRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import staffRoutes   from "./routes/staffRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import courseRoutes  from "./routes/courseRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";
import heroBannerRoutes from "./routes/heroBannerRoutes.js";
import studentPortalRoutes from "./routes/studentPortalRoutes.js";
import dutyScheduleRoutes from "./routes/dutyScheduleRoutes.js";
import resultRoutes from "./routes/resultRoutes.js"

dotenv.config();
if (!process.env.VERCEL) connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: (process.env.CORS_ORIGIN || '').split(',').map(s => s.trim()).filter(Boolean),
    credentials: true
}));
app.use(express.json());

// Parse cookies into req.cookies
app.use((req, res, next) => {
    req.cookies = {};
    const cookieHeader = req.headers.cookie;
    if (cookieHeader) {
        cookieHeader.split(";").forEach((cookie) => {
            const [name, ...rest] = cookie.split("=");
            if (name) {
                req.cookies[name.trim()] = decodeURIComponent(rest.join("="));
            }
        });
    }
    next();
});

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth",    authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/staff",   staffRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/hero-banners", heroBannerRoutes);
app.use("/api/student-portal", studentPortalRoutes);
app.use("/api/duty-schedules", dutyScheduleRoutes);
app.use("/api/results",resultRoutes);

app.get("/", (req, res) => {
    res.send("Lakshya LMS Backend is running!");
});

const configuredPort = process.env.PORT;
const PORT = configuredPort ? Number(configuredPort) : 5000;
if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
}
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

