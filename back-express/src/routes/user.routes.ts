import express, { Router } from 'express';

const router: Router = Router();
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retrieves a list of users
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Internal server error
 */
router.route("/").get((req, res) => {
  res.send('Hello World2');
})
export default router;
