import express, { Router } from 'express';
import Blog from '../models/Blog.js';

const router = express.Router();

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
        const blog = await Blog.findByPk(req.params.id);
        if (!blog) return res.status(404).json({ error: "Blog not found" });
        res.json(blog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

router.post("/", async (req, res) => {
    try {
        console.log("Received Data:", req.body);
        const { title, description, author, image } = req.body;

        if (!title || !description || !author) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newBlog = await Blog.create({ title, description, author, image });
        res.status(201).json(newBlog);
    } catch (err) {
        console.error("Server Error:", err);
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