import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validationRequest,NotFoundError,BadRequestError, OrderStatus } from '@sangmicrotickets/common';
import { Ticket } from '../models/tickets';
import { natsWrapper } from '../nat-wrapper';
import mongoose from 'mongoose';
import { Order } from '../models/order';
import {OrderCreatedPublisher} from '../events/publisher/order-created-publisher'

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15*60

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
        .not()
        .isEmpty()
        .custom((input)=>mongoose.Types.ObjectId.isValid(input))
        .withMessage('ticketId is required'),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { ticketId} = req.body;
    const ticket = await Ticket.findById(ticketId)
    console.log(ticketId)
    if(!ticket) {
      throw new NotFoundError();
    }
    const isReserved = await ticket.isReserved();
    if(isReserved) {
      throw new BadRequestError('Ticket already reserved');
    }

    const expiration= new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS)

    const order = Order.build({
      userId:req.currentUser!.id,
      status:OrderStatus.Created,
      expiresAt:expiration,
      ticket
    })

    await order.save();
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id:order.id,
      status:order.status,
      userId:order.userId,
      version: order.version,
      expiresAt:order.expiresAt.toISOString(),
      ticket: {
        id:ticket.id,
        price:ticket.price
      }
    })
    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
