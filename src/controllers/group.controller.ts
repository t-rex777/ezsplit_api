import { Request, Response } from 'express';
import { GroupService } from '../services/group.service';

export class GroupController {
  async createGroup(req: Request, res: Response) {
    try {
      const data = req.body;
      const group = await new GroupService().create(data);
      return res.status(200).json({ group });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getAllGroups(_req: Request, res: Response) {
    try {
      const groups = await new GroupService().all();
      return res.status(200).json({ groups });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getGroupById(req: Request, res: Response) {
    try {
      const group = await new GroupService().find(parseInt(req.params.groupId));
      return res.status(200).json({ group });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async updateGroup(req: Request, res: Response) {
    try {
      const data = req.body;
      const { groupId } = req.params;

      const group = await new GroupService().update(parseInt(groupId), data);
      return res.status(200).json({ group });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async deleteGroup(req: Request, res: Response) {
    try {
      const { groupId } = req.params;
      const group = await new GroupService().delete(parseInt(groupId));
      return res.status(200).json({ group });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async addUsersToGroup(req: Request, res: Response) {
    try {
      const { userIds } = req.body;
      const { groupId } = req.params;

      const group = await new GroupService().addUsers(parseInt(groupId), userIds);
      return res.status(200).json({ group });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
