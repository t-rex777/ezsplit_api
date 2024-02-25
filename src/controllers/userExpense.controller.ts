import { Response } from 'express';
import { UserExpenseService } from '../services/userExpense.service';
import { CustomRequest } from './user.controller';

export class UserExpenseController {
  /**
   * @route POST /expenses/user/create
   */
  async createExpense(req: CustomRequest, res: Response) {
    try {
      const data = req.body;

      const expense = await new UserExpenseService(req.userId).create(data);

      return res.status(200).json({ data: expense });
    } catch (error) {
      console.error({ error });
      res.status(500).json({ error });
    }
  }

  /**
   * @route GET /expenses/user
   */
  async getAllExpenses(req: CustomRequest, res: Response) {
    try {
      const expenses = await new UserExpenseService(req.userId).all();

      const data = expenses.reduce((acc, curr, index) => {
        acc[index] = { ...curr, category: curr.expense.category };
        delete curr.expense.category;

        return acc;
      }, []);

      return res.status(200).json({ data });
    } catch (error) {
      console.error({ error });
      res.status(500).json({ error });
    }
  }

  /**
   * @route GET /expenses/user/expenseId
   */
  async getExpenseById(req: CustomRequest, res: Response) {
    try {
      const expense = await new UserExpenseService(req.userId).find(parseInt(req.params.expenseId));

      return res.status(200).json({ data: expense });
    } catch (error) {
      console.log(error);

      res.status(500).json({ error });
    }
  }

  /**
   * @route PATCH expenses/user/update/expenseId
   */
  async updateExpense(req: CustomRequest, res: Response) {
    try {
      const data = req.body;
      const { expenseId } = req.params;

      const updatedExpense = await new UserExpenseService(req.userId).update(parseInt(expenseId), data);

      return res.status(200).json({ data: updatedExpense });
    } catch (error) {
      console.error({ error });
      res.status(500).json({ error });
    }
  }

  /**
   * @route DELETE /expenses/user/delete/expenseId
   */
  async deleteExpense(req: CustomRequest, res: Response) {
    try {
      const { expenseId } = req.params;
      const user = await new UserExpenseService(req.userId).delete(parseInt(expenseId));
      return res.status(200).json({ user });
    } catch (error) {
      console.error({ error });
      res.status(500).json({ error });
    }
  }
}
