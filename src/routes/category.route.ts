import express from 'express';
import { CategoryController } from '../controllers';

const app = express();
const { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } = new CategoryController();

app.get('/:categoryId', getCategoryById);
app.get('/', getAllCategories);
app.post('/create', createCategory);
app.get('/update/:categoryId', updateCategory);
app.get('/delete/:categoryId', deleteCategory);

export default app;
