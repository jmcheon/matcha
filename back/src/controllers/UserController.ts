// controllers/UserController.ts
import { Request, Response } from 'express'
import { UserService } from '../services/UserService'
import { User } from '../models/User'
export class UserController {
  private userService: UserService

  constructor(userService: UserService) {
    this.userService = userService
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const users = await this.userService.getAllUsers()
    res.json(users)
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.id, 10)
    const user = await this.userService.getUserById(userId)

    if (user) {
      res.json(user)
    } else {
      res.status(404).json({ error: 'User not found' })
    }
  }

  async createUser(req: Request, res: Response): Promise<void> {
    console.log(req.body)
    const newUser: User = req.body

    try {
      // const isEmailUnique = await this.userService.isEmailUnique(newUser.email)

      // if (!isEmailUnique) {
      //   return res.status(400).json({ error: 'Email already exists' })
      // }

      // const isGoogleUsernameUnique =
      //   await this.userService.isGoogleUsernameUnique(newUser.google_username)

      // if (!isGoogleUsernameUnique) {
      //   return res.status(400).json({ error: 'Google Username already exists' })
      // }

      // const isIntraUsernameUnique =
      //   await this.userService.isIntraUsernameUnique(newUser.intra_username)

      // if (!isIntraUsernameUnique) {
      //   return res.status(400).json({ error: 'Intra Username already exists' })
      // }

      const checkUniqueField = async (field: string, errorMessage: string) => {
        const capitalizeFirstLetter = (word: string): string => {
          return word
            .split('_')
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join('')
        }
        console.log(capitalizeFirstLetter(field))

        const isUnique = await this.userService[
          `is${capitalizeFirstLetter(field)}Unique`
        ](newUser[field])

        if (!isUnique) {
          return res.status(400).json({ error: errorMessage })
        }
      }

      await Promise.all([
        checkUniqueField('email', 'Email already exists'),
        checkUniqueField('google_username', 'Google Username already exists'),
        checkUniqueField('intra_username', 'Intra Username already exists'),
      ])

      const userId = await this.userService.createUser(newUser)

      if (userId !== null) {
        res
          .status(201)
          .json({ id: userId, message: 'User created successfully' })
      } else {
        res.status(500).json({ error: 'Failed to create user' })
      }
    } catch (error) {
      console.error('Error creating user:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}
