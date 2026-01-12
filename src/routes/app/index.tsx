import { createFileRoute } from '@tanstack/react-router'

import WelcomeView from '@/components/WelcomeView'

export const Route = createFileRoute('/app/')({
  component: AppIndex,
})

function AppIndex() {
  return <WelcomeView />
}
