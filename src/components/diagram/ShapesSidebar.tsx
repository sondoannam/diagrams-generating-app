/**
 * Shapes Sidebar - Draw.io-inspired shape palette
 *
 * Provides draggable shapes that can be dropped onto the React Flow canvas.
 * Uses HTML5 Drag and Drop API for compatibility with React Flow.
 */

import { type DragEvent } from 'react'
import { User, Circle, Square, ArrowRight, GitBranch } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'

// ============================================================================
// Shape Definitions
// ============================================================================

export interface ShapeDefinition {
  type: string
  label: string
  icon: React.ReactNode
  description: string
  category: 'nodes' | 'edges'
  defaultData?: Record<string, unknown>
}

export const useCaseShapes: ShapeDefinition[] = [
  {
    type: 'actor',
    label: 'Actor',
    icon: <User className="h-6 w-6" />,
    description: 'Person or system that interacts',
    category: 'nodes',
    defaultData: { label: 'Actor' },
  },
  {
    type: 'usecase',
    label: 'Use Case',
    icon: <Circle className="h-6 w-6" />,
    description: 'System functionality or action',
    category: 'nodes',
    defaultData: { label: 'Use Case' },
  },
  {
    type: 'system',
    label: 'System',
    icon: <Square className="h-6 w-6" />,
    description: 'System boundary container',
    category: 'nodes',
    defaultData: { label: 'System' },
  },
]

export const useCaseConnections: ShapeDefinition[] = [
  {
    type: 'association',
    label: 'Association',
    icon: <ArrowRight className="h-6 w-6" />,
    description: 'Solid line connection',
    category: 'edges',
  },
  {
    type: 'dependency',
    label: 'Dependency',
    icon: <GitBranch className="h-6 w-6" />,
    description: 'Dashed line (include/extend)',
    category: 'edges',
  },
]

// ============================================================================
// Shape Item Component
// ============================================================================

interface ShapeItemProps {
  shape: ShapeDefinition
  onDragStart: (event: DragEvent, shape: ShapeDefinition) => void
  onDoubleClick: (shape: ShapeDefinition) => void
}

function ShapeItem({ shape, onDragStart, onDoubleClick }: ShapeItemProps) {
  return (
    <div
      draggable={shape.category === 'nodes'}
      onDragStart={(e) => onDragStart(e, shape)}
      onDoubleClick={() => shape.category === 'nodes' && onDoubleClick(shape)}
      className={`
        flex items-center gap-3 p-3 rounded-lg border border-border/50
        transition-all cursor-grab active:cursor-grabbing
        hover:bg-accent hover:border-accent-foreground/20
        ${shape.category === 'nodes' ? 'hover:shadow-lg hover:scale-[1.02]' : 'opacity-60 cursor-not-allowed'}
      `}
      title={`${shape.description}${shape.category === 'nodes' ? ' (double-click to add)' : ''}`}
    >
      <div className="p-2 rounded-md bg-muted text-muted-foreground">
        {shape.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-foreground">{shape.label}</div>
        <div className="text-xs text-muted-foreground truncate">
          {shape.description}
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// Edge Type Selector (for edge creation mode)
// ============================================================================

interface EdgeTypeSelectorProps {
  selectedEdgeType: string
  onEdgeTypeChange: (type: string) => void
}

function EdgeTypeSelector({
  selectedEdgeType,
  onEdgeTypeChange,
}: EdgeTypeSelectorProps) {
  return (
    <div className="space-y-2">
      {useCaseConnections.map((connection) => (
        <button
          key={connection.type}
          onClick={() => onEdgeTypeChange(connection.type)}
          className={`
            w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left
            ${
              selectedEdgeType === connection.type
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border/50 hover:bg-accent hover:border-accent-foreground/20'
            }
          `}
        >
          <div
            className={`p-2 rounded-md ${
              selectedEdgeType === connection.type
                ? 'bg-primary/20 text-primary'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {connection.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">{connection.label}</div>
            <div className="text-xs text-muted-foreground truncate">
              {connection.description}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

// ============================================================================
// Main Sidebar Component
// ============================================================================

interface ShapesSidebarProps {
  selectedEdgeType: string
  onEdgeTypeChange: (type: string) => void
  onShapeAdd: (type: string, data: Record<string, unknown>) => void
}

export default function ShapesSidebar({
  selectedEdgeType,
  onEdgeTypeChange,
  onShapeAdd,
}: ShapesSidebarProps) {
  // Handle drag start - set data for React Flow to read on drop
  const handleDragStart = (event: DragEvent, shape: ShapeDefinition) => {
    if (shape.category !== 'nodes') return

    // Set the node type and default data as drag data
    event.dataTransfer.setData('application/reactflow-type', shape.type)
    event.dataTransfer.setData(
      'application/reactflow-data',
      JSON.stringify(shape.defaultData || {}),
    )
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div className="w-64 border-r border-border bg-card/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">Shapes</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Drag or double-click to add
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* Nodes Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Elements
            </h3>
            <div className="space-y-2">
              {useCaseShapes.map((shape) => (
                <ShapeItem
                  key={shape.type}
                  shape={shape}
                  onDragStart={handleDragStart}
                  onDoubleClick={(s) => onShapeAdd(s.type, s.defaultData || {})}
                />
              ))}
            </div>
          </div>

          <Separator />

          {/* Connections Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Connection Type
            </h3>
            <p className="text-xs text-muted-foreground">
              Select type, then connect nodes
            </p>
            <EdgeTypeSelector
              selectedEdgeType={selectedEdgeType}
              onEdgeTypeChange={onEdgeTypeChange}
            />
          </div>
        </div>
      </ScrollArea>

      {/* Footer hint */}
      <div className="p-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          💡 Drag & drop to add elements
        </p>
      </div>
    </div>
  )
}
