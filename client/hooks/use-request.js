import axios from 'axios'
import {useState} from 'react'

export default ({url,method,body,onSuccess}) => {
  const [errors, setError] = useState(null)
  const doRequest = async () => {
    try {
      const rp = await axios[method](url,body);
      if(onSuccess) {
        onSuccess(rp.data)
      }
      return rp.data;
    } catch (error) {
      setError(
      <div className="alert alert-danger">
        <h4>Opps..</h4>
        <ul className="my-0">
          {error.response.data.errors.map(e=>(
            <li key={e.message}>{e.message}</li>
          ))}
        </ul>
      </div>
      
      )
    }
  }
  return {doRequest, errors}
}
