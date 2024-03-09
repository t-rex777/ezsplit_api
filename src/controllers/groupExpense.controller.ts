import { Response } from 'express';
import { GroupExpenseService } from '../services';
import { CustomRequest } from './user.controller';

export class GroupExpenseController {
  /**
   * @route POST /create
   */
  async createExpense(req: CustomRequest, res: Response) {
    try {
      const data = req.body;
      const expense = await new GroupExpenseService(req.userId).create(data);

      return res.status(200).json({ expense });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route GET
   */
  async getAllExpenses(req: CustomRequest, res: Response) {
    try {
      const groups = await new GroupExpenseService(req.userId).all();
      return res.status(200).json({ groups });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route GET /expenses/expenseId
   */
  async getExpenseById(req: CustomRequest, res: Response) {
    try {
      const expense = await new GroupExpenseService(req.userId).find(parseInt(req.params.expenseId));
      return res.status(200).json({ expense });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route PATCH expenses/update/expenseId
   */
  async updateExpense(req: CustomRequest, res: Response) {
    try {
      const data = req.body;
      const { expenseId } = req.params;

      const user = await new GroupExpenseService(req.userId).update(parseInt(expenseId), data);

      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route DELETE /expenses/expenseId
   */
  async deleteExpense(req: CustomRequest, res: Response) {
    try {
      const { userId } = req.params;
      const user = await new GroupExpenseService(req.userId).delete(parseInt(userId));
      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
