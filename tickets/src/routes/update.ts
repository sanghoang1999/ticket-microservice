import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, validationRequest,NotAuthorizedError, NotFoundError } from '@sangmicrotickets/common';
import { Ticket } from '../models/tickets';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';
import { natsWrapper } from '../nat-wrapper';

const router = express.Router();

router.put('/api/tickets/:id',
[
  body('title').not().isEmpty(),
  body('price').isFloat({gt:0})
],
validationRequest,
requireAuth, async (req:Request, res:Response)=> {
  const tickets = await Ticket.findById(req.params.id)
  if(!tickets) {
    throw new NotFoundError();
  }
  if(tickets.userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  tickets.set({
    title:req.body.title,
    price:req.body.price
  })
  await tickets.save();
  new TicketUpdatedPublisher(natsWrapper.client).publish({
    id:tickets.id,
    title:tickets.title,
    price:tickets.price,
    userId:tickets.userId,
    version:tickets.version
  })
  res.send(tickets);
})

export { router as updateTicketsRouter };
