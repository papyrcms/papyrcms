import KeysProvider from './KeysProvider'
import SettingsProvider from './SettingsProvider'
import UserProvider from './UserProvider'
import StoreProvider from './StoreProvider'
import PostsProvider from './PostsProvider'
import PagesProvider from './PagesProvider'

type Props = {
  keys: Keys,
  settings: Settings,
  pages: Array<Page>,
  posts: Array<Post>,
  children: any
}

const GlobalState = (props: Props) => (
  <KeysProvider keys={props.keys}>
    <SettingsProvider settings={props.settings}>
      <UserProvider>
        <PagesProvider pages={props.pages}>
          <PostsProvider posts={props.posts}>
            <StoreProvider>
              {props.children}
            </StoreProvider>
          </PostsProvider>
        </PagesProvider>
      </UserProvider>
    </SettingsProvider>
  </KeysProvider>
)


export default GlobalState
