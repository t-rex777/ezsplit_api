import { Response } from 'express';
import { GroupExpenseService } from '../services';
import { GroupService } from '../services/group.service';
import { CustomRequest } from './user.controller';

export class GroupController {
  async createGroup(req: CustomRequest, res: Response) {
    try {
      const data = req.body;
      const group = await new GroupService(req.userId).create(data);
      return res.status(200).json({ group });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getAllGroups(req: CustomRequest, res: Response) {
    try {
      const groups = await new GroupService(req.userId).all();
      const groupExpenseService = await new GroupExpenseService();
      // TODO: users to group info

      return res.status(200).json({ data: groups.map(({ group }) => ({ ...group, users: [], expense: groupExpenseService.find(group.id) })) });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async getGroupById(req: CustomRequest, res: Response) {
    try {
      const group = await new GroupService(req.userId).find(parseInt(req.params.groupId));
      return res.status(200).json({ group });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async updateGroup(req: CustomRequest, res: Response) {
    try {
      const data = req.body;
      const { groupId } = req.params;

      const group = await new GroupService(req.userId).update(parseInt(groupId), data);
      return res.status(200).json({ group });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async deleteGroup(req: CustomRequest, res: Response) {
    try {
      const { groupId } = req.params;
      const group = await new GroupService(req.userId).delete(parseInt(groupId));
      return res.status(200).json({ group });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  async addUsersToGroup(req: CustomRequest, res: Response) {
    try {
      const { userIds } = req.body;
      const { groupId } = req.params;

      const group = await new GroupService(req.userId).addUsersToGroup(parseInt(groupId), userIds);
      return res.status(200).json({ group });
    } catch (error) {
      res.status(500).json({ error });
    }
  }
}
