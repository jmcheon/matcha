// services/UserService.ts
import { dbConfig } from '../db/dbConfig'
import { User } from '../models/User'

export class UserService {
  async getAllUsers(): Promise<User[]> {
    const [rows] = await dbConfig.query<User[]>('SELECT * FROM user')
    return rows as User[]
  }

  async getUserById(userId: number): Promise<User | null> {
    const [rows] = await dbConfig.query<User[]>(
      'SELECT * FROM user WHERE user_id = ?',
      [userId],
    )

    if (rows.length === 0) {
      return null
    }

    return rows[0] as User
  }

  async isEmailUnique(email: string): Promise<boolean> {
    const [rows] = await dbConfig.query<User[]>(
      'SELECT * FROM user WHERE email = ?',
      [email],
    )
    return rows.length === 0 // If the length is 0, the email is unique.
  }

  async isGoogleUsernameUnique(google_username: string): Promise<boolean> {
    const [rows] = await dbConfig.query<User[]>(
      'SELECT * FROM user WHERE google_username = ?',
      [google_username],
    )
    return rows.length === 0 // If the length is 0, the email is unique.
  }

  async isIntraUsernameUnique(intra_username: string): Promise<boolean> {
    const [rows] = await dbConfig.query<User[]>(
      'SELECT * FROM user WHERE intra_username = ?',
      [intra_username],
    )
    return rows.length === 0 // If the length is 0, the email is unique.
  }

  async createUser(user: User): Promise<number | null> {
    const [result] = await dbConfig.query('INSERT INTO user SET ?', [user])

    if (result && 'insertId' in result) {
      return result.insertId
    }

    return null
  }
}
