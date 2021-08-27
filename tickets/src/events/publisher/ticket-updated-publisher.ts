import { Publisher, TicketCreatedEvent ,Subjects,TicketUpdatedEvent} from "@sangmicrotickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject:Subjects.TicketUpdated = Subjects.TicketUpdated;
}
