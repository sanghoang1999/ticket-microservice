

import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../models/tickets';
import { Order } from '../../models/order';
import { OrderStatus } from '@sangmicrotickets/common';
import { response } from 'express';

const buildTicket = async ()=> {
  const ticket = Ticket.build({
    title:'emvuidi',
    price:20,
  })

  await ticket.save();
  return ticket
}

it('delete the order', async () => {
  const ticketOne = await buildTicket();  

  const userOne = global.signin();
  
  const {body: order1}= await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId :ticketOne.id})
    .expect(201);
  const rs =await request(app)
    .delete(`/api/orders/${order1.id}`)
    .set('Cookie', userOne)
    .expect(204);
  
  const updatedOrder = await Order.findById(order1.id);
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled)
}) 

it('erorr fetch orders not authorizej', async () => {
}) 