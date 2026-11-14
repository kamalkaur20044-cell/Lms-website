import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { getGallery, uploadImage, deleteImage } from "../controllers/galleryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "..", "uploads", "gallery");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `gallery_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

const router = express.Router();

router.get("/",       getGallery);                                        // public
router.post("/",      authMiddleware, upload.single("image"), uploadImage); // admin
router.delete("/:id", authMiddleware, deleteImage);                       // admin

export default router;
