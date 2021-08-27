import request from 'supertest'
import { app } from '../../app'
import { cookie } from 'express-validator'

process.env.JWT_KEY ='emvuidi'
it('return a 201 on successful signup', async ()=> {
  return request(app).post('/api/users/signup')
          .send ({
            email:"hahah@gmail.con",
            password:'password'
          })
          .expect(201)
})

it('return a 400 on fail signup', async ()=> {
  return request(app).post('/api/users/signup')
          .send ({
            email:"hahahasdfasf",
            password:'password'
          })
          .expect(400)
})

it('return a 400 on missing email and password', async ()=> {
  await request(app).post('/api/users/signup')
          .send ({
            email:"hahahasdfasf",
          })
          .expect(400)
  await request(app).post('/api/users/signup')
          .send ({
            password:'password'
          })
          .expect(400)
})

it('duplicate user email', async ()=> {
  await request(app).post('/api/users/signup')
          .send ({
            email:"hahah@gmail.con",
            password:'password'
          })
          .expect(201)
  await request(app).post('/api/users/signup')
          .send ({
            email:"hahah@gmail.con",
            password:'password'
          })
          .expect(400)
})

it('check sign up return jwt cookie ', async ()=> {
  const rs = await request(app).post('/api/users/signup')
          .send ({
            email:"hahah@gmail.con",
            password:'password'
          })
          .expect(201)
  expect(rs.get('Set-Cookie')).toBeDefined()
})
it('cc ', async ()=> {
  const rs = await request(app).post('/api/users/signup')
          .send ({
            email:"hahah@gmail.con",
            password:'password'
          })
          .expect(201)
  const cookie = rs.get('Set-Cookie')
   await request(app).get('/api/users/currentuser')
          .set('Cookie',cookie)
          .send ()
          .expect(200)
})