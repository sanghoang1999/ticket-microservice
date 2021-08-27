import { Publisher, TicketCreatedEvent ,Subjects} from "@sangmicrotickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject:Subjects.TicketCreated = Subjects.TicketCreated;
}