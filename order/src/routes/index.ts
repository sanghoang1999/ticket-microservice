import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validationRequest } from '@sangmicrotickets/common';
import { Ticket } from '../models/tickets';
import { Order } from '../models/order';

const router = express.Router();

router.get('/api/orders',requireAuth, async (req:Request, res:Response)=> {
  const orders = await Order.find({userId:req.currentUser!.id}).populate('ticket');
  res.send(orders);
})

export { router as indexOrderRouter };
