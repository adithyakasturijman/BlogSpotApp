import express from 'express';
import multer from 'multer';
import Blog from '../models/Blog.js';
import { fileURLToPath } from "url";

import path from 'path';

const router = express.Router();

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

router.get("/", async (req, res) => {
    try {
        const blogs = await Blog.findAll();
        res.json(blogs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const blogId = req.params.id;
        console.log("Fetching blog with ID:", blogId);

        // Check if ID is a valid number
        if (isNaN(blogId)) {
            return res.status(400).json({ error: "Invalid blog ID format" });
        }

        const blog = await Blog.findByPk(blogId);

        if (!blog) {
            console.log("Blog not found in database.");
            return res.status(404).json({ error: "Blog not found" });
        }

        res.json(blog);
    } catch (err) {
        console.error("Error fetching blog:", err);
        res.status(500).json({ error: err.message });
    }
});



router.post("/", upload.single("image"), async (req, res) => {
    try {
        const { title, description, author } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

        const newBlog = await Blog.create({
            title,
            description,
            author,
            image: imageUrl,
        });

        res.status(201).json(newBlog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const { title, description, author, image } = req.body;
        await blog.update({ title, description, author, image });
        res.json(blog);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.delete("/:id", async (req, res) => {
    try {
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        await blog.destroy();
        res.json({ success: true, message: "Blog deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


export default router;