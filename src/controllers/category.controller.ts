import { Response } from 'express';
import { CategoryService } from '../services';
import { CustomRequest } from './user.controller';

export class CategoryController {
  /**
   * @route POST /category/create
   */
  async createCategory(req: CustomRequest, res: Response) {
    try {
      const data = req.body;
      const category = await new CategoryService(req.userId).create(data);
      return res.status(200).json({ category });
    } catch (error) {
      console.error(error);

      res.status(500).json({ error });
    }
  }

  /**
   * @route GET /category
   */
  async getAllCategories(req: CustomRequest, res: Response) {
    try {
      const categories = await new CategoryService(req.userId).all();
      return res.status(200).json({ data: categories });
    } catch (error) {
      console.error(error);

      res.status(500).json({ error });
    }
  }

  /**
   * @route GET /:categoryId
   */
  async getCategoryById(req: CustomRequest, res: Response) {
    try {
      const category = await new CategoryService(req.userId).find(parseInt(req.params.categoryId));
      return res.status(200).json({ category });
    } catch (error) {
      console.error(error);

      res.status(500).json({ error });
    }
  }

  /**
   * @route PATCH /category/update/:categoryId
   */
  async updateCategory(req: CustomRequest, res: Response) {
    try {
      const data = req.body;
      const { categoryId } = req.params;

      delete data.id;
      delete data.userId;

      const category = await new CategoryService(req.userId).update(parseInt(categoryId), data);
      return res.status(200).json({ category });
    } catch (error) {
      console.error(error);

      res.status(500).json({ error });
    }
  }

  /**
   * @route DELETE /category/delete/:categoryId
   */
  async deleteCategory(req: CustomRequest, res: Response) {
    try {
      const { categoryId } = req.params;
      const category = await new CategoryService(req.userId).delete(parseInt(categoryId));
      return res.status(200).json({ category });
    } catch (error) {
      console.error(error);

      res.status(500).json({ error });
    }
  }
}
