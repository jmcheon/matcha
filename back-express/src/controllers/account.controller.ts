// controllers/accountController.ts
import { Request, Response } from 'express';
import { getAccountById, updateAccount } from '../models/account.model';
import bcrypt from 'bcrypt';

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

  static async updateUser(req: Request, res: Response) {
    console.log(req.body)
    try {
      const accountId = Number(req.params.id);
      const account = await getAccountById(accountId);
      if (!account) {
        res.status(400).json({ code: 'INVALID_USER_CREDENTIALS' })
      }
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      await updateAccount(Number(req.params.id), null, hashedPassword, null, null)
      res.status(200).json(account);
    } catch (error) {
      res.status(500).json({ error: 'Server error', details: error });
    }
  };
}
