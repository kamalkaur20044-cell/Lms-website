import pool from "../config/db.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// GET /api/gallery  — public
export const getGallery = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM gallery ORDER BY created_at DESC"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("getGallery error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/gallery  — admin, multipart/form-data
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const { title, category } = req.body;
    const imageUrl = `/uploads/gallery/${req.file.filename}`;

    await pool.query(
      "INSERT INTO gallery (title, category, image_url) VALUES (?, ?, ?)",
      [
        title    || req.file.originalname,
        category || "General",
        imageUrl,
      ]
    );
    res.json({ success: true, message: "Image uploaded successfully", imageUrl });
  } catch (err) {
    console.error("uploadImage error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/gallery/:id  — admin
export const deleteImage = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM gallery WHERE id = ?", [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }

    // Remove physical file
    const filename = path.basename(rows[0].image_url);
    const filePath  = path.join(__dirname, "..", "uploads", "gallery", filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query("DELETE FROM gallery WHERE id = ?", [req.params.id]);
    res.json({ success: true, message: "Image deleted" });
  } catch (err) {
    console.error("deleteImage error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
