import { useStore } from './store'
import { Home } from './screens/Home'
import { Lesson } from './screens/Lesson'
import { Result } from './screens/Result'
import { Profile } from './screens/Profile'
import { Recovery } from './screens/Recovery'

export function App() {
  const { screen } = useStore()

  switch (screen.name) {
    case 'home':
      return <Home />
    case 'lesson':
      return <Lesson />
    case 'result':
      return <Result />
    case 'profile':
      return <Profile />
        case 'recovery':
     return <Recovery />
    default:
      return <Home />
  }
}