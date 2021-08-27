import { Publisher, OrderCreatedEvent ,Subjects} from "@sangmicrotickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject:Subjects.OrderCreated = Subjects.OrderCreated 
}
