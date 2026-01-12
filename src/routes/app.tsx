import { createFileRoute } from '@tanstack/react-router'
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

import AppLayout from '@/components/layout/AppLayout'

export const Route = createFileRoute('/app')({
  component: AppLayoutWrapper,
})

function AppLayoutWrapper() {
  return (
    <>
      <SignedIn>
        <AppLayout />
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
