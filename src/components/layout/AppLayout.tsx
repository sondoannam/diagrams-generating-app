import { Link, Outlet } from '@tanstack/react-router'
import { UserButton } from '@clerk/clerk-react'
import { Plus, MessageSquare, PanelLeftClose, PanelLeft } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Placeholder conversations for UI demo
const placeholderConversations = [
  { id: '1', title: 'E-commerce checkout flow', type: 'activity' },
  { id: '2', title: 'User authentication system', type: 'use-case' },
  { id: '3', title: 'Payment processing', type: 'sequence' },
]

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ${
            sidebarCollapsed ? 'w-16' : 'w-72'
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4">
            {!sidebarCollapsed && (
              <Link to="/app" className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                  <span className="text-white font-bold text-sm">D</span>
                </div>
                <span className="font-semibold text-lg">DiagramAI</span>
              </Link>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="hover:bg-sidebar-accent"
                >
                  {sidebarCollapsed ? (
                    <PanelLeft className="h-5 w-5" />
                  ) : (
                    <PanelLeftClose className="h-5 w-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              </TooltipContent>
            </Tooltip>
          </div>

          <Separator className="bg-sidebar-border" />

          {/* New Diagram Button */}
          <div className="p-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className={`w-full gradient-primary hover:gradient-hover text-white transition-all ${
                    sidebarCollapsed ? 'px-0' : ''
                  }`}
                >
                  <Plus className="h-5 w-5" />
                  {!sidebarCollapsed && (
                    <span className="ml-2">New Diagram</span>
                  )}
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">New Diagram</TooltipContent>
              )}
            </Tooltip>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1 py-2">
              {placeholderConversations.map((conv) => (
                <Tooltip key={conv.id}>
                  <TooltipTrigger asChild>
                    <button
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors ${
                        sidebarCollapsed ? 'justify-center' : ''
                      }`}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0" />
                      {!sidebarCollapsed && (
                        <span className="truncate">{conv.title}</span>
                      )}
                    </button>
                  </TooltipTrigger>
                  {sidebarCollapsed && (
                    <TooltipContent side="right">{conv.title}</TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          </ScrollArea>

          <Separator className="bg-sidebar-border" />

          {/* User Profile */}
          <div
            className={`p-4 ${sidebarCollapsed ? 'flex justify-center' : ''}`}
          >
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9',
                },
              }}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <Outlet />
        </main>
      </div>
    </TooltipProvider>
  )
}
