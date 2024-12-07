const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const mongoose = require('mongoose');

const getStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate the ID format
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const student = await Student.findById(id);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.student = student;
    next();
  } catch (error) {
    console.error('Error in getStudent middleware:', error);
    res.status(500).json({ message: `Error retrieving student: ${error.message}` });
  }
};

// GET ALL: Fetch all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find(); // Fetch all students from the database
    res.status(200).json(students); // Return the students as a JSON response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ONE: Fetch a single student by ID
router.get('/:id', getStudent, (req, res) => {
  res.status(200).json(res.student); // Return the student fetched by middleware
});

// POST CREATE: Add a new student
router.post('/', async (req, res) => {
  const { name, class: studentClass } = req.body;

  if (!name || !studentClass) {
    return res.status(400).json({ message: 'Name and class are required' });
  }

  const student = new Student({
    name,
    class: studentClass,
  });

  try {
    const newStudent = await student.save(); // Save the new student to the database
    res.status(201).json(newStudent); // Return the newly created student
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PATCH UPDATE: Update an existing student's details
router.patch('/:id', getStudent, async (req, res) => {
  const { name, class: studentClass } = req.body;

  if (name != null) {
    res.student.name = name; // Update the name if provided
  }

  if (studentClass != null) {
    res.student.class = studentClass; // Update the class if provided
  }

  try {
    const updatedStudent = await res.student.save(); // Save the updated student to the database
    res.status(200).json(updatedStudent); // Return the updated student
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Remove a student by ID
router.delete('/:id', getStudent, async (req, res) => {
  try {
    if (!res.student) {
      return res.status(404).json({ message: 'Student not found for deletion' });
    }

    await res.student.deleteOne(); // Perform the deletion
    res.status(200).json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: `Error deleting student: ${error.message}` });
  }
});

module.exports = router;