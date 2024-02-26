import express from 'express';
import { CategoryController } from '../controllers';

const app = express();
const { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } = new CategoryController();

app.get('/:categoryId', getCategoryById);
app.get('/', getAllCategories);
app.post('/create', createCategory);
app.patch('/update/:categoryId', updateCategory);

// TODO: group expenses dependency
app.delete('/delete/:categoryId', deleteCategory);

export default app;
