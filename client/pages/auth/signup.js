import {useState} from 'react'

import Router from 'next/router'
import axios from 'axios'
import useRequest from '../../hooks/use-request'
export default ()=> {
  const [form, setForm] = useState({
    email:'',
    password:'',
  })
  const {doRequest,errors} = useRequest({
    url:'/api/users/signup',
    method:'post',
    body:form,
    onSuccess: ()=> Router.push('/')
  })
  const handleChange = (e) => {
    setForm(
      {...form,[e.target.name]:e.target.value}
    )

  }
  const handleSubmit = async (e)=> {
    e.preventDefault();
    doRequest();

  }
  return (
    <form onSubmit={handleSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label htmlFor="">Email Address</label>
        <input name="email" value={form.email} onChange={e=>handleChange(e)} className="form-control" type="text"/>
      </div>
      <div className="form-group">
        <label htmlFor="">Password</label>

        <input name="password"  value={form.password} onChange={e=>handleChange(e)} className="form-control" type="password"/>
      </div>
      {errors}
      <button className="btn btn-primary">Sign up</button>
    </form>
  )
} 