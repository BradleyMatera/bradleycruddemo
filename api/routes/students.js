const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const mongoose = require('mongoose');

/**
 * Middleware to fetch a student by ID and attach it to `res.student`
 */
const getStudent = async (req, res, next) => {
  const { id } = req.params;
  console.log("ID in getStudent middleware:", id); // Log to verify

  // Validate the ID format
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  try {
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.student = student; // Attach the student to the response object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error in getStudent middleware:', error);
    res.status(500).json({ message: `Error retrieving student: ${error.message}` });
  }
};

/**
 * GET / - Fetch all students
 */
router.get('/', async (req, res) => {
  try {
    const students = await Student.find(); // Fetch all students from the database
    res.status(200).json(students); // Return the students as a JSON response
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: `Error fetching students: ${error.message}` });
  }
});

/**
 * GET /:id - Fetch a single student by ID
 */
router.get('/:id', getStudent, (req, res) => {
  res.status(200).json(res.student); // Return the student fetched by middleware
});

/**
 * POST / - Create a new student
 */
router.post('/', async (req, res) => {
  const { name, class: studentClass } = req.body;

  if (!name || !studentClass) {
    return res.status(400).json({ message: 'Name and class are required' });
  }

  const student = new Student({ name, class: studentClass });

  try {
    const newStudent = await student.save(); // Save the new student to the database
    res.status(201).json(newStudent); // Return the newly created student
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(400).json({ message: `Error creating student: ${error.message}` });
  }
});

/**
 * PATCH /:id - Update an existing student's details
 */
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
    console.error('Error updating student:', error);
    res.status(400).json({ message: `Error updating student: ${error.message}` });
  }
});

/**
 * DELETE /:id - Remove a student by ID
 */
router.delete('/:id', getStudent, async (req, res) => {
  try {
    await res.student.deleteOne(); // Perform the deletion
    res.status(200).json({ message: 'Student removed successfully' });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({ message: `Error deleting student: ${error.message}` });
  }
});

module.exports = router;