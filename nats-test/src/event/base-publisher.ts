import { Subjects } from './subject';
import { Stan, Message } from 'node-nats-streaming';
interface Event {
  subject:Subjects,
  data:any;
}

export abstract class Publisher<T extends Event> {
  private client: Stan;
  abstract subject : T['subject'];
  constructor(client:Stan) {
    this.client = client
  }
  publish(data:T['data']):Promise<void>{
    return new Promise((rs,rj)=> {
    this.client.publish(this.subject,JSON.stringify(data),(err, )=> {
      if(err) {
        return rj(err);
      }
      console.log('Event published to subject ', this.subject)
      rs()
    })
    })
  }
}