
import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TicketUpdatedEvent ,NotFoundError} from '@sangmicrotickets/common';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/tickets';
export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;
  async onMessage(data:TicketUpdatedEvent['data'], msg:Message) {
    const {id,title,price,version} = data
    const ticket = await Ticket.findByEvent({id,version})
    if(!ticket) {
      throw new NotFoundError();
    }
    ticket.set({title,price})
    await ticket.save();
    msg.ack();
  }
}