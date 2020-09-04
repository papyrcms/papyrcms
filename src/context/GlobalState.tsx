import { Keys, Settings, SectionOptions, Page, Post } from 'types'
import KeysProvider from './KeysProvider'
import SettingsProvider from './SettingsProvider'
import SectionOptionsProvider from './SectionOptionsProvider'
import UserProvider from './UserProvider'
import StoreProvider from './StoreProvider'
import PostsProvider from './PostsProvider'
import PagesProvider from './PagesProvider'

type Props = {
  keys: Keys
  settings: Settings
  sectionOptions: SectionOptions
  pages: Page[]
  posts: Post[]
  children: any
}

const GlobalState = (props: Props) => (
  <KeysProvider keys={props.keys}>
    <SettingsProvider settings={props.settings}>
      <SectionOptionsProvider sectionOptions={props.sectionOptions}>
        <UserProvider>
          <PagesProvider pages={props.pages}>
            <PostsProvider posts={props.posts}>
              <StoreProvider>
                {props.children}
              </StoreProvider>
            </PostsProvider>
          </PagesProvider>
        </UserProvider>
      </SectionOptionsProvider>
    </SettingsProvider>
  </KeysProvider>
)


export default GlobalState
