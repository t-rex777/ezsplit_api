import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/';
import { GroupService } from '../services/group.service';

export interface CustomRequest extends Request {
  userId: number;
}

export class UserController {
  async isAuthorized(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      console.log({ token });
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET) as { userId: number };

      (req as CustomRequest).userId = decoded.userId;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET) as { userId: number };

      const user = await new UserService().findById(decoded.userId);
      const access_token = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
      const refresh_token = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

      return res.status(200).json({ access_token, refresh_token });
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

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

      const access_token = jwt.sign({ userId: user.id }, process.env.JWT_ACCESS_SECRET, { expiresIn: '1d' });
      const refresh_token = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

      return res.status(200).json({ message: 'Login successful', user, access_token, refresh_token });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async register(req: CustomRequest, res: Response) {
    try {
      const data = req.body;
      if ('groupId' in data) {
        const group = await new GroupService(req.userId).find(parseInt(data.groupId));
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

  async getAllUsers(_req: Request, res: Response) {
    try {
      const users = await new UserService().all();
      return res.status(200).json({ users });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const user = await new UserService().findById(parseInt(req.params.userId));
      return res.status(200).json({ user });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

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
