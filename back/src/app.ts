// app.ts
import express, { Express } from 'express'
import { userRouter } from './routes/userRoutes'

const app: Express = express()
const port: number = 3000

app.use(express.json())
app.use('/api/users', userRouter)

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
