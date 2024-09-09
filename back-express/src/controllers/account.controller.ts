// controllers/accountController.ts
import { Request, Response } from 'express';
import { getAccountById } from '../services/account.service';

export const getAccountByIdController = async (req: Request, res: Response) => {
  try {
    const accountId = Number(req.params.id);
    const account = await getAccountById(accountId);
    if (account) {
      res.status(200).json(account);
    } else {
      res.status(404).json({ message: 'Account not found' });
    }
  } catch (e) {
    res.status(500).json({ error: 'Server error', details: e });
  }
};
