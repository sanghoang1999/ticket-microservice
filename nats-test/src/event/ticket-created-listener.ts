import nats,{Message, Stan} from 'node-nats-streaming';
import { Listener } from './base-listener';
import { Subjects } from './subject';
import { TicketCreatedEvent } from './ticket-created-event';
export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject:Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = 'sangyeuthaoGroup';
  onMessage(data:TicketCreatedEvent['data'],msg:Message) {
    console.log('Event data ',data);
    msg.ack()
  }
}