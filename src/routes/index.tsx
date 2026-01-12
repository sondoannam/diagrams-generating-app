import { createFileRoute } from '@tanstack/react-router'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
} from '@clerk/clerk-react'
import {
  ArrowRight,
  GitBranch,
  Sparkles,
  Users,
  Workflow,
  Zap,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center">
            <span className="text-white font-bold">D</span>
          </div>
          <span className="font-semibold text-xl">DiagramAI</span>
        </div>
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button
                size="sm"
                className="gradient-primary text-white hover:opacity-90"
              >
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <Button
              size="sm"
              className="gradient-primary text-white hover:opacity-90"
              asChild
            >
              <a href="/app">
                Open App <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </SignedIn>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-4xl text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI-Powered Diagram Generation</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            Create System Diagrams{' '}
            <span className="text-gradient">with AI</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Describe your requirements in natural language. Let AI understand,
            design, and generate professional UML diagrams in seconds.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <SignedOut>
              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="gradient-primary text-white hover:opacity-90 px-8"
                >
                  Start Creating <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Button
                size="lg"
                className="gradient-primary text-white hover:opacity-90 px-8"
                asChild
              >
                <a href="/app">
                  Open App <ArrowRight className="ml-2 h-5 w-5" />
                </a>
              </Button>
            </SignedIn>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <div className="glass-card p-6 text-left space-y-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold">Use Case Diagrams</h3>
              <p className="text-sm text-muted-foreground">
                Model actors, systems, and their interactions clearly
              </p>
            </div>
            <div className="glass-card p-6 text-left space-y-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                <Workflow className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold">Activity Diagrams</h3>
              <p className="text-sm text-muted-foreground">
                Visualize workflows and business process flows
              </p>
            </div>
            <div className="glass-card p-6 text-left space-y-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <GitBranch className="h-5 w-5 text-white" />
              </div>
              <h3 className="font-semibold">Sequence Diagrams</h3>
              <p className="text-sm text-muted-foreground">
                Show object interactions and message flows
              </p>
            </div>
          </div>

          {/* How it works */}
          <div className="pt-16 space-y-8">
            <h2 className="text-2xl font-semibold">How it works</h2>
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-left">
              <div className="flex items-start gap-4 max-w-xs">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Describe</h4>
                  <p className="text-sm text-muted-foreground">
                    Tell AI what system you want to model
                  </p>
                </div>
              </div>
              <Zap className="h-5 w-5 text-primary hidden md:block" />
              <div className="flex items-start gap-4 max-w-xs">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Review</h4>
                  <p className="text-sm text-muted-foreground">
                    AI explains its understanding, you confirm
                  </p>
                </div>
              </div>
              <Zap className="h-5 w-5 text-primary hidden md:block" />
              <div className="flex items-start gap-4 max-w-xs">
                <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center shrink-0">
                  <span className="text-white font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Generate</h4>
                  <p className="text-sm text-muted-foreground">
                    Get an editable, exportable diagram
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-6 border-t border-border/50 text-center text-sm text-muted-foreground">
        © 2026 DiagramAI. Built with AI for developers.
      </footer>
    </div>
  )
}
