// controllers/accountController.ts
import { Request, Response } from 'express';
import { getAccountById } from '../models/account.model';

export default class AccountController {
  // Define the method as an arrow function
  static getAccountById = async (req: Request, res: Response): Promise<void> => {
    try {
      const accountId = Number(req.params.id);
      const account = await getAccountById(accountId);
      if (account) {
        res.status(200).json(account);
      } else {
        res.status(404).json({ message: 'Account not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error });
    }
  };
}
