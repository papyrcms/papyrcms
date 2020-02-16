import UserProvider from './UserProvider'
import StoreProdiver from './StoreProvider'


const GlobalState = props => (
  <UserProvider>
    <StoreProdiver>
      {props.children}
    </StoreProdiver>
  </UserProvider>
)


export default GlobalState
