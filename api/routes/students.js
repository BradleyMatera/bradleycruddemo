const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const mongoose = require('mongoose');

// Middleware to validate and retrieve a student by ID
const getStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid or missing ID' });
    }

    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.student = student;
    next();
  } catch (error) {
    res.status(500).json({ message: `Error retrieving student: ${error.message}` });
  }
};

// Fetch all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Fetch a student by ID
router.get('/:id', getStudent, (req, res) => {
  res.status(200).json(res.student);
});

// Add a new student
router.post('/', async (req, res) => {
  const { name, class: studentClass } = req.body;

  if (!name || !studentClass) {
    return res.status(400).json({ message: 'Name and class are required' });
  }

  try {
    const student = new Student({ name, class: studentClass });
    const newStudent = await student.save();
    res.status(201).json(newStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a student's details
router.patch('/:id', getStudent, async (req, res) => {
  const { name, class: studentClass } = req.body;

  if (name != null) res.student.name = name;
  if (studentClass != null) res.student.class = studentClass;

  try {
    const updatedStudent = await res.student.save();
    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a student by ID
router.delete('/:id', getStudent, async (req, res) => {
  try {
    await res.student.deleteOne();
    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;