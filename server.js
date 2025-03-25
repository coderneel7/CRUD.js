const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/employeeDB', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Employee Model
const Employee = mongoose.model('Employee', new mongoose.Schema({
  name: String,
  position: String,
  salary: Number
}));

// Routes

// Create Employee
app.post('/employees', (req, res) => {
  const { name, position, salary } = req.body;
  const newEmployee = new Employee({ name, position, salary });
  newEmployee.save()
    .then(employee => res.status(201).json(employee))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Get all Employees
app.get('/employees', (req, res) => {
  Employee.find()
    .then(employees => res.json(employees))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Get Employee by ID
app.get('/employees/:id', (req, res) => {
  Employee.findById(req.params.id)
    .then(employee => res.json(employee))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Update Employee
app.put('/employees/:id', (req, res) => {
  const { name, position, salary } = req.body;
  Employee.findByIdAndUpdate(req.params.id, { name, position, salary }, { new: true })
    .then(employee => res.json(employee))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Delete Employee
app.delete('/employees/:id', (req, res) => {
  Employee.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({ message: 'Employee deleted successfully' }))
    .catch(err => res.status(400).json({ error: err.message }));
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
