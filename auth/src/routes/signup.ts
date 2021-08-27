import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { body } from 'express-validator';
import { User } from '../models/user';
import {RequestValidationError,BadRequestError,validationRequest} from '@sangmicrotickets/common'


const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters')
  ],validationRequest,
  async (req: Request, res: Response) => {

    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email in use');
    }

    const user = User.build({ email, password });
    const newUser= await user.save();
    const userJwt = jwt.sign({
      id:user.id,
      email:user.email 
    },process.env.JWT_KEY!
    )

    req.session = {
      jwt:userJwt
    }
    res.status(201).send(newUser);
  }
);

export { router as signupRouter };
