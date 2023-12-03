import { Request, Response } from 'express';
import { UserService } from '../services/';

export class userController {
  /**
   * @route POST /login
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await new UserService().getUserByEmail(email);
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
      const user = await new UserService().insertUser(data);

      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route PATCH /update/userId
   */
  async update(req: Request, res: Response) {
    try {
      const data = req.body;
      const { userId } = req.params;

      const user = await new UserService().updateUser(parseInt(userId), data);

      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  /**
   * @route GET /users
   */
  async all(_req: Request, res: Response) {
    try {
      const users = await new UserService().getAllUsers();
      return res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
