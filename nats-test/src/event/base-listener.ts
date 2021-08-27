
import nats,{Message, Stan} from 'node-nats-streaming';
import { Subjects } from './subject';


interface Event { subject:Subjects, data:any; } 

export abstract class Listener< T extends Event> {
  private client: Stan;
  abstract queueGroupName:string;
  abstract subject : T['subject'];
  protected ackWait = 5* 1000;
  abstract onMessage(data:T['data'],msg:Message):void
  constructor(client:Stan) {
    this.client = client
  }
  subcriptionOptions () {
    return this.client
          .subscriptionOptions()
          .setDeliverAllAvailable()
          .setManualAckMode(true)
          .setAckWait(this.ackWait)
          .setDurableName(this.queueGroupName)
  }
  listen() {
    const subcription = this.client.subscribe(this.subject,this.queueGroupName,this.subcriptionOptions())
    subcription.on('message',(msg:Message)=> {
      console.log(`
        Message received:${this.subject} / ${this.queueGroupName} 
      `)

      const parseData = this.parseMessage(msg);
      this.onMessage(parseData, msg)
    })

  }
  parseMessage(msg:Message) {
    const data = msg.getData();
    return typeof data === 'string'
        ? JSON.parse(data) 
        : JSON.parse(data.toString('utf8'))
  }
}
