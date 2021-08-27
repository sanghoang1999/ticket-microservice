
import nats,{Message, Stan} from 'node-nats-streaming';
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './event/ticket-created-listener';
console.clear()
const stan = nats.connect('tickets', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

stan.on('connect',()=> {
  console.log('Listener connected')

  stan.on('close',()=> {
    console.log('connection closed');
    process.exit();
  })
  new TicketCreatedListener(stan).listen();
})
process.on('SIGINT',()=> stan.close())
process.on('SIGTERM',()=> stan.close())


