
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

it('returns an error if the ticket does not exist', async () => {
  const ticketOne = await buildTicket();  
  const ticketTwo = await buildTicket();  
  const ticketThree = await buildTicket();  
  

  const userOne = global.signin();
  const userTwo = global.signin();

  
  const {body: order1}= await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId :ticketOne.id})
    .expect(201);
  
  const {body:order2} = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId :ticketTwo.id})
    .expect(201);


  await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId :ticketThree.id})
    .expect(201);

  const response = await request(app)
        .get('/api/orders')
        .set('Cookie',userTwo)
        .expect(200)
 
  
  expect(response.body.length).toEqual(2);



});
