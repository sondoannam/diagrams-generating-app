import { GitBranch, Users, Workflow } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const diagramTypes = [
  {
    id: 'use-case',
    title: 'Use Case Diagram',
    description: 'Model user interactions and system functionality',
    icon: Users,
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    id: 'activity',
    title: 'Activity Diagram',
    description: 'Visualize workflows and business processes',
    icon: Workflow,
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'sequence',
    title: 'Sequence Diagram',
    description: 'Show object interactions over time',
    icon: GitBranch,
    gradient: 'from-purple-500 to-pink-600',
  },
]

export default function WelcomeView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="max-w-3xl w-full text-center space-y-8">
        {/* Welcome Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            What diagram do you want to{' '}
            <span className="text-gradient">create</span>?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Describe your requirements in natural language and let AI generate
            professional system design diagrams for you.
          </p>
        </div>

        {/* Diagram Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          {diagramTypes.map((type) => {
            const Icon = type.icon
            return (
              <Card
                key={type.id}
                className="group cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card hover:border-primary/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/10"
              >
                <CardHeader className="space-y-3 pb-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.gradient} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{type.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {type.description}
                  </CardDescription>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Hint */}
        <p className="text-sm text-muted-foreground pt-4">
          Click on a diagram type to start, or describe what you need in the
          chat
        </p>
      </div>
    </div>
  )
}
