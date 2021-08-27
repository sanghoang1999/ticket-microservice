import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nat-wrapper';
import { TicketCreatedListener } from './events/listener/ticket-created-listener';
import { TicketUpdatedListener } from './events/listener/ticket-updated-listener';

const start = async () => {
    if(!process.env.JWT_KEY) {
      throw new Error('jwt_key not found')
    }
    if(!process.env.MONGO_URI) {
      throw new Error('mongo uri not found')
    }
    if(!process.env.NATS_URL) {
      throw new Error('nats url not found')
    }
    if(!process.env.NATS_CLUSTER_ID) {
      throw new Error('nats cluster id not found')
    }
    if(!process.env.NATS_CLIENT_ID) {
      throw new Error('nats client id not found')
    }
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID,process.env.NATS_CLIENT_ID,process.env.NATS_URL)

    natsWrapper.client.on('close',()=> {
      console.log('Nat connection closed');
      process.exit();
    })
    process.on('SIGINT',()=> natsWrapper.client.close())
    process.on('SIGTERM',()=> natsWrapper.client.close())

    new TicketCreatedListener(natsWrapper.client).listen();

    new TicketUpdatedListener(natsWrapper.client).listen();

    console.log('Connected to order MongoDb');
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening order port 3000!!!!!!!!');
  });

};

start();
