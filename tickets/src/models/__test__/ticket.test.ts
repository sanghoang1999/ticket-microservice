import { Ticket } from "../tickets"


it('implement OCC',async (done)=> {
  const ticket = Ticket.build({
    title:'concert',
    price:10,
    userId:'haha'
  })

  await ticket.save();

  const first = await Ticket.findById(ticket.id);
  const two = await Ticket.findById(ticket.id);

  first?.set({price:20})
  two?.set({price:30})
  

  await first?.save();
  try {
    await two?.save()
    
  } catch (error) {
   return done();
  }
  
})