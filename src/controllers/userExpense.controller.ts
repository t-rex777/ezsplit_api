import { Response } from 'express';
import { UserExpenseService } from '../services/userExpense.service';
import { CustomRequest } from './user.controller';

interface Expense {
  id: number;
  name: string;
  description: string;
  currency: string;
  totalAmount: string;
  image: string;
  createdAt: Date;
  modifiedAt: Date;
  category: {
    id: number;
    name: string;
    image: string;
    createdAt: Date;
  };
  users: {
    id: number;
    name: string;
    email: string;
    dob: string;
    image: string;
    currency: string;
    groupId: number | null;
    createdAt: Date;
    amount: string;
    isLender: boolean;
  }[];
}

interface IFriend {
  id: string;
  imageUrl: string;
  name: string;
  currency: string;
  totalAmount: string;
  isLender: boolean;
  /**
   * add support
   */
  // groups: {
  //   id: string;
  //   name: string;
  //   image: string;
  //   totalAmount: string;
  //   isLender: boolean;
  // };
}

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
      const result = await new UserExpenseService(req.userId).all();

      const data = result.reduce<IFriend[]>((acc, curr) => {
        if (Number(curr.user.id) === Number(req.userId)) return acc;

        const friend = acc.find((friend) => Number(friend.id) === Number(curr.user.id));

        if (friend === undefined) {
          const data: IFriend = {
            id: curr.user.id.toString(),
            imageUrl: curr.user.image,
            currency: curr.expense.currency,
            name: curr.user.name,
            totalAmount: curr.amount,
            isLender: curr.isLender,
          };

          acc.push(data);
        } else {
          if (curr.isLender) {
            const totalAmount = Number(friend.totalAmount) + Number(curr.amount);

            friend.isLender = totalAmount < 0 ? false : true;
            friend.totalAmount = Math.abs(totalAmount).toString();
          } else {
            const totalAmount = Number(friend.totalAmount) - Number(curr.amount);

            friend.isLender = totalAmount < 0 ? false : true;
            friend.totalAmount = Math.abs(totalAmount).toString();
          }
        }

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
      const result = await new UserExpenseService(req.userId).find(parseInt(req.params.expenseId));

      const data: Expense = {
        ...result[0].expense,
        users: result.map((d) => ({ ...d.user, isLender: d.isLender, amount: d.amount })),
        category: result[0].expense.category,
      };

      return res.status(200).json({ data });
    } catch (error) {
      console.error(error);

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
