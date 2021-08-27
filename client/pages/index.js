import service from '../api/service'
import buildClient from '../api/build-client'

const LandingPage = ({currentUser}) => {

return currentUser ? <h1> You Are Sign In </h1> : <h1>You Are Not Sign In</h1>
}

LandingPage.getInitialProps = async (context) => {
  const client = buildClient(context,service.AUTH)
  const {data} = await client.get('/api/users/currentuser');
  return data
}
export default LandingPage