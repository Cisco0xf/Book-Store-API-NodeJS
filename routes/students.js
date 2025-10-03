const express = require('express');
const Student = require('../models/Student');
const router = express.Router();

// POST add student
router.post("/", async (req, res) => {
    const { name, age } = req.body;
    const student = await Student.create({ name, age });
    res.send({ 
        message: "Data sent successfully", 
        data: student 
    });
});

// GET all students
router.get("/", async (req, res) => {
    const students = await Student.find();
    res.send({
        message: "successfully retrieved students",
        code: 200,
        data: students,
    });
});

// GET student by ID
router.get("/:id", async (req, res) => {
    const id = req.params.id;
    const student = await Student.findById(id);
    res.send({
        message: "success",
        data: student,
    });
});

// PUT update student
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const { name, age } = req.body;
    const student = await Student.updateOne({ _id: id }, { name, age });
    res.send({
        message: "updated success",
        data: student,
    });
});

// DELETE student
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    await Student.deleteOne({ _id: id });
    res.send({
        message: "deleted success"
    });
});

module.exports = router;