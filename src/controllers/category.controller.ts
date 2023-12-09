import { Request, Response } from 'express';
import { CategoryService } from '../services';

export class CategoryController {
  async createCategory(req: Request, res: Response) {
    try {
      const data = req.body;
      const category = await new CategoryService().create(data);
      return res.status(200).json({ category });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getAllCategories(_req: Request, res: Response) {
    try {
      const categories = await new CategoryService().all();
      return res.status(200).json({ categories });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getCategoryById(req: Request, res: Response) {
    try {
      const category = await new CategoryService().find(parseInt(req.params.categoryId));
      return res.status(200).json({ category });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const data = req.body;
      const { categoryId } = req.params;

      const category = await new CategoryService().update(parseInt(categoryId), data);
      return res.status(200).json({ category });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const category = await new CategoryService().delete(parseInt(categoryId));
      return res.status(200).json({ category });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
