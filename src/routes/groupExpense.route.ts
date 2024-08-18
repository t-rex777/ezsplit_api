import express from 'express';
import { GroupExpenseController } from '../controllers/groupExpense.controller';

const app = express();
const { createExpense, deleteExpense, getAllExpenses, getExpenseById, updateExpense } = new GroupExpenseController();

app.get('/:expenseId', getExpenseById);
app.get('/', getAllExpenses);
app.post('/create', createExpense);
app.patch('/update/:expenseId', updateExpense);
app.delete('/delete/:expenseId', deleteExpense);

export default app;
