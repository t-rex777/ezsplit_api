import express from 'express';
import { ExpenseController } from '../controllers/expense.controller';

const app = express();
const { createExpense, deleteExpense, getAllExpenses, getExpenseById, updateExpense } = new ExpenseController();

app.get('/:expenseId', getExpenseById);
app.get('/', getAllExpenses);
app.post('/create', createExpense);
app.patch('/update/:expenseId', updateExpense);
app.delete('/delete/:expenseId', deleteExpense);

export default app;
