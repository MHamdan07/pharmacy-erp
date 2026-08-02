import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { getEmployees, createEmployee, updateEmployee } from '../controllers/employeeController.js';

const router = express.Router();

router.use(protect);

router.get('/', getEmployees);
router.post('/', createEmployee);
router.put('/:id', updateEmployee);

export default router;
