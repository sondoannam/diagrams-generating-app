import { createFileRoute } from '@tanstack/react-router'

import DiagramEditor from '@/components/DiagramEditor'

export const Route = createFileRoute('/app/editor/$id')({
  component: EditorPage,
})

function EditorPage() {
  const { id } = Route.useParams()

  return (
    <div className="flex flex-col h-full w-full">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card/50">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold">Diagram Editor</h1>
          <span className="text-sm text-muted-foreground">ID: {id}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            Use Case Diagram
          </span>
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 min-h-0">
        <DiagramEditor
          onChange={(nodes, edges) => {
            // For now, just log changes - will sync to DB later
            console.log('Diagram changed:', {
              nodes: nodes.length,
              edges: edges.length,
            })
          }}
        />
      </div>
    </div>
  )
}
