import {
  Keys,
  Settings,
  SectionOptions,
  Page,
  Post,
  Blog,
  Event,
  Product,
} from '@/types'
import KeysProvider from './KeysProvider'
import SettingsProvider from './SettingsProvider'
import SectionOptionsProvider from './SectionOptionsProvider'
import UserProvider from './UserProvider'
import StoreProvider from './StoreProvider'
import PostsProvider from './PostsProvider'
import BlogsProvider from './BlogsProvider'
import EventsProvider from './EventsProvider'
import PagesProvider from './PagesProvider'

type Props = {
  keys: Keys
  settings: Settings
  sectionOptions: SectionOptions
  pages: Page[]
  posts: Post[]
  blogs: Blog[]
  events: Event[]
  products: Product[]
}

const GlobalState: React.FC<Props> = (props) => (
  <KeysProvider keys={props.keys}>
    <SettingsProvider settings={props.settings}>
      <SectionOptionsProvider sectionOptions={props.sectionOptions}>
        <UserProvider>
          <PagesProvider pages={props.pages}>
            <PostsProvider posts={props.posts}>
              <BlogsProvider blogs={props.blogs}>
                <EventsProvider events={props.events}>
                  <StoreProvider products={props.products}>
                    {props.children}
                  </StoreProvider>
                </EventsProvider>
              </BlogsProvider>
            </PostsProvider>
          </PagesProvider>
        </UserProvider>
      </SectionOptionsProvider>
    </SettingsProvider>
  </KeysProvider>
)

export default GlobalState
