import { Request, Response } from 'express';
import { UserService } from '../services/';
import { GroupService } from '../services/group.service';

export class UserController {
  /**
   * @route POST /login
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await new UserService().findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      return res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route POST /register
   */
  async register(req: Request, res: Response) {
    try {
      const data = req.body;
      if ('groupId' in data) {
        const group = await new GroupService().find(parseInt(data.groupId));
        if (!group) {
          return res.status(404).json({ message: 'Group not found' });
        }
      }

      const user = await new UserService().create(data);

      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route PATCH /update/userId
   */
  async updateUser(req: Request, res: Response) {
    try {
      const data = req.body;
      const { userId } = req.params;

      const user = await new UserService().update(parseInt(userId), data);

      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route GET /users
   */
  async getAllUsers(_req: Request, res: Response) {
    try {
      const users = await new UserService().all();
      return res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route GET /users/userId
   */
  async getUser(req: Request, res: Response) {
    try {
      const user = await new UserService().findById(parseInt(req.params.userId));
      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route DELETE /users/userId
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await new UserService().delete(parseInt(userId));
      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
