
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

it('fetches the order', async () => {
  const ticketOne = await buildTicket();  
  const ticketTwo = await buildTicket();  

  const userOne = global.signin();
  
  const {body: order1}= await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId :ticketOne.id})
    .expect(201);

  await request(app)
    .get(`/api/orders/${order1.id}`)
    .set('Cookie', userOne)
    .expect(200);
}) 

it('erorr fetch orders not authorizej', async () => {
  const ticketOne = await buildTicket();  
  const ticketTwo = await buildTicket();  

  const userOne = global.signin();
  const userTwo = global.signin();
  
  const {body: order1}= await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId :ticketOne.id})
    .expect(201);

  const rp =await request(app)
    .get(`/api/orders/${order1.id}`)
    .set('Cookie', userTwo)
    .expect(401);
  console.log(rp.body);
}) 