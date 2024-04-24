// routes/userRoutes.ts
import express, { Router } from 'express'
import { body } from 'express-validator'

import { UserController } from '../controllers/UserController'
import { UserService } from '../services/UserService'

const userRouter: Router = express.Router()
const userService = new UserService()

const userController = new UserController(userService)

userRouter.get('/', userController.getAllUsers.bind(userController))
userRouter.get('/:id', userController.getUserById.bind(userController))

const createUserValidationRules = [
  body('email').notEmpty().isEmail(),
  body('password').notEmpty().isString(),
  body('google_username').notEmpty().isString(),
  body('intra_username').notEmpty().isString(),
]
userRouter.post('/', userController.createUser.bind(userController))

export { userRouter }
