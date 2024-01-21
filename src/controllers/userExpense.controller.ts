import { Request, Response } from 'express';
import { GroupExpenseService } from '../services';

export class GroupExpenseController {
  /**
   * @route POST /create
   */
  async createExpense(req: Request, res: Response) {
    try {
      const data = req.body;
      const expense = await new GroupExpenseService().create(data);

      return res.status(200).json({ expense });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route GET
   */
  async getAllExpenses(_req: Request, res: Response) {
    try {
      const groups = await new GroupExpenseService().all();
      return res.status(200).json({ groups });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route GET /expenses/expenseId
   */
  async getExpenseById(req: Request, res: Response) {
    try {
      const expense = await new GroupExpenseService().find(parseInt(req.params.expenseId));
      return res.status(200).json({ expense });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route PATCH expenses/update/expenseId
   */
  async updateExpense(req: Request, res: Response) {
    try {
      const data = req.body;
      const { expenseId } = req.params;

      const user = await new GroupExpenseService().update(parseInt(expenseId), data);

      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route DELETE /expenses/expenseId
   */
  async deleteExpense(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await new GroupExpenseService().delete(parseInt(userId));
      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
