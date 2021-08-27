import { Publisher,OrderCancelledEvent ,Subjects} from "@sangmicrotickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject:Subjects.OrderCancelled = Subjects.OrderCancelled;
}
