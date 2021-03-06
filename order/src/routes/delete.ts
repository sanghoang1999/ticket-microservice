import express, { Request, Response } from 'express';
import { requireAuth, validationRequest,NotAuthorizedError, NotFoundError, OrderStatus } from '@sangmicrotickets/common';
import { natsWrapper } from '../nat-wrapper';
import { Order } from '../models/order';

const router = express.Router();

router.delete('/api/orders/:orderId',requireAuth, async (req:Request, res:Response)=> {

  const order = await Order.findById(req.params.orderId).populate('ticket');
  if(!order) {
    throw new NotFoundError();
  }
  if(order.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  order.status = OrderStatus.Cancelled
  await order.save();
   res.status(204).send(order);
})

export { router as deleteOrderRouter };
