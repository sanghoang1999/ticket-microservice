import nats from 'node-nats-streaming';
import { TickerCreatedPublisher } from './event/ticket.created-publisher';
console.clear();
const stan = nats.connect('tickets', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect',async () => {
  console.log('Publisher connected to NATS');
  const data = {
    id:'123',
    title:'emvuidi',
    price:100
  }
  const publisher =  new TickerCreatedPublisher(stan)
  try {
    await publisher.publish(data);
  } catch (error) {
    console.log(error);  
  }
});

