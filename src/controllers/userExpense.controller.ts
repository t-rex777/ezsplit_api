import { Response } from 'express';
import { UserService } from '../services/user.service';
import { UserExpenseService } from '../services/userExpense.service';
import { CustomRequest } from './user.controller';

interface IFriendExpense {
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
}

interface IExpense {
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
  users: IFriendExpense[];
}

interface IFriend {
  hasExpense: boolean;
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
   * add pagination and search here and write better function
   */
  async getAllExpenses(req: CustomRequest, res: Response) {
    try {
      // const page = Number(req.query.page) || 1;
      // const pageSize = Number(req.query.page_size) || 10;

      const model = new UserExpenseService(req.userId);
      const result = await model.all();

      // TODO: add friends for specific user, currently we are getting all users
      const users = await new UserService().all();
      let data: IFriend[] = [];

      if (result.length === 0) {
        // TODO: add proper types
        data = users.reduce((acc: any, user: any) => {
          if (Number(user.id) === Number(req.userId)) return acc;

          acc.push({
            totalAmount: '0',
            id: user.id,
            hasExpense: false,
            imageUrl: user.image,
            name: user.name,
            currency: user.currency,
            isLender: false,
          });

          return acc;
        }, []);
      } else {
        data = result.reduce<IFriend[]>((acc, curr) => {
          if (Number(curr.user.id) === Number(req.userId)) return acc;

          const friend = acc.find((friend) => Number(friend.id) === Number(curr.user.id));

          if (friend === undefined) {
            const data: IFriend = {
              id: curr.user.id.toString(),
              imageUrl: curr.user.image,
              currency: curr.expense.currency,
              name: curr.user.name,
              totalAmount: curr.isLender ? curr.amount : '-' + curr.amount,
              isLender: curr.isLender,
              hasExpense: true,
            };

            acc.push(data);
          } else {
            if (curr.isLender) {
              const totalAmount = Number(friend.totalAmount) + Number(curr.amount);

              friend.isLender = totalAmount < 0 ? false : true;
              friend.totalAmount = totalAmount.toString();
            } else {
              const totalAmount = Number(friend.totalAmount) - Number(curr.amount);

              friend.isLender = totalAmount < 0 ? false : true;
              friend.totalAmount = totalAmount.toString();
            }
          }

          return acc;
        }, []);
      }

      // const totalExpenses = await model.total();
      // const totalPages = Math.ceil(totalExpenses.length / pageSize);

      // const pagination = {
      //   totalExpenses,
      //   total: totalExpenses.length,
      //   current_page: page,
      //   prev_page: page - 1 || null,
      //   next_page: totalPages > page ? page + 1 : null,
      //   total_pages: Math.ceil(totalExpenses.length / pageSize),
      // };

      return res.status(200).json({
        data: data.map((d) => ({ ...d, totalAmount: Math.abs(Number(d.totalAmount)) })),
      });
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

      if (result.length === 0) {
        return res.status(200).json({ data: null });
      }

      const data: IExpense = {
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
   * @route GET /expenses/user/friend/:friendId
   */
  async getExpenseByFriendId(req: CustomRequest, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const pageSize = Number(req.query.page_size) || 9999;

      const term = String(req.query.term) || '';

      const model = new UserExpenseService(req.userId);

      const response = await model.findByFriendId(parseInt(req.params.friendId), term, page, pageSize);

      const result = response.reduce<IExpense[]>((acc, curr) => {
        // get the common expense between friend and current user and send that only
        const expense = acc.find((expense) => expense.id === curr.expense.id);

        if (expense === undefined) {
          acc = acc.concat({
            ...curr.expense,
            category: curr.expense.category,
            users: [{ ...curr.user, isLender: curr.isLender, amount: curr.amount }],
          });
        } else {
          expense.users = expense.users.concat({ ...curr.user, isLender: curr.isLender, amount: curr.amount });
        }
        return acc;
      }, []);

      const totalExpenses = await model.total();

      const totalPages = Math.ceil(totalExpenses / pageSize);

      const prevPage = page - 1 || null;
      const nextPage = page * result.length === totalExpenses ? null : page + 1;

      return res.status(200).json({
        data: result,

        meta: {
          pagination: {
            total: totalExpenses,
            current_page: page,
            prev_page: prevPage,
            next_page: nextPage,
            total_pages: totalPages,
          },
        },
      });
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
