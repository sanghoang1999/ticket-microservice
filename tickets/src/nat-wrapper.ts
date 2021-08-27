import {Stan} from 'node-nats-streaming';
import nats from 'node-nats-streaming';
class NatsWrapper {
  private _client?:Stan;
  get client() {
    if(!this._client) {
      throw new Error('Cannot access NATS client before connecting');
    }
    return this._client;
  }
  connect(clusterId:string, clientId:string, url:string) {
    this._client = nats.connect(clusterId,clientId,{url});
    return new Promise((rs,rj)=>{
      this.client.on('connect',()=> {
        console.log('Connected to Nats');
        rs();
      })
      this.client.on('error',(err)=> {
        rj(err);
      })
    })
  }

}

export const natsWrapper = new NatsWrapper()