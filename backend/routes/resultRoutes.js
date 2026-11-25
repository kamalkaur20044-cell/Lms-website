import express from "express"
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { getMyResults, getResults, uploadResults } from "../controllers/resultController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();
const uploadDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
   destination: (req, file, cb) => cb(null, uploadDir),
   filename: (req, file, cb) => cb(null, `${Date.now()}${path.extname(file.originalname).toLowerCase()}`)
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = [".xlsx",".xls"];
    const extension = path.extname(file.originalname).toLowerCase();
    if(allowedExtensions.includes(extension)){
        cb(null,true);
    }else{
        cb(new Error("Only Excel files are allowed"));
    }
};

const upload = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits:{
        fileSize : 5 * 1024 *1024
    }
});

router.get("/", authMiddleware, roleMiddleware("admin", "teacher"), getResults);
router.get("/mine", authMiddleware, roleMiddleware("student", "admin"), getMyResults);
router.post("/upload", authMiddleware, roleMiddleware("admin", "teacher"), upload.single("file"), uploadResults);

export default router;
