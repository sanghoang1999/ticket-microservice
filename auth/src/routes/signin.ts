
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {validationRequest, BadRequestError} from '@sangmicrotickets/common'
import { User } from '../models/user';
import { Password } from '../service/password';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/api/users/signin',[
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('Password is not empty')
],validationRequest, async (req:Request, res:Response) => {
  const {password,email} = req.body
  const existingUser = await User.findOne({email})
  if(!existingUser) {
    throw new BadRequestError('Invalid credentials');
  }
  const passwordMatch = await Password.compare(existingUser.password,password)
  if(!passwordMatch) {
    throw new BadRequestError('Invalid password');
  }

    const userJwt = jwt.sign({
      id:existingUser.id,
      email:existingUser.email 
    },process.env.JWT_KEY!
    )

    req.session = {
      jwt:userJwt
    }
    res.status(201).send(existingUser);

  
});

export { router as signinRouter };
