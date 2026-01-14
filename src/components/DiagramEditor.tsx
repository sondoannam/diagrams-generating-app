/**
 * DiagramEditor Component - Draw.io-inspired editor
 *
 * A React Flow-based diagram editor with:
 * - Shapes sidebar for drag-and-drop
 * - Custom node types (Actor, UseCase, System)
 * - Custom edge types (Association, Dependency)
 * - Full interactivity: drag, select, connect, zoom, pan
 */

import { useCallback, useState, useEffect, useRef, type DragEvent } from 'react'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ReactFlowProvider,
  useReactFlow,
  type Node,
  type Edge,
  type OnConnect,
  type Connection,
  BackgroundVariant,
  MarkerType,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'

import { useCaseNodeTypes } from './diagram/nodes/UseCaseNodes'
import {
  useCaseEdgeTypes,
  defaultEdgeOptions,
} from './diagram/edges/UseCaseEdges'
import ShapesSidebar from './diagram/ShapesSidebar'

// ============================================================================
// Types
// ============================================================================

export interface DiagramEditorProps {
  /** Initial nodes to render */
  initialNodes?: Node[]
  /** Initial edges to render */
  initialEdges?: Edge[]
  /** Callback when nodes/edges change */
  onChange?: (nodes: Node[], edges: Edge[]) => void
  /** Whether the editor is read-only */
  readOnly?: boolean
  /** Whether to show the shapes sidebar */
  showSidebar?: boolean
}

// ============================================================================
// Sample Data - Empty canvas with just instructions
// ============================================================================

const defaultNodes: Node[] = []
const defaultEdges: Edge[] = []

// ============================================================================
// ID Generator
// ============================================================================

let nodeIdCounter = 1
const generateNodeId = () => `node_${nodeIdCounter++}`

// ============================================================================
// Internal Editor Component (needs ReactFlow context)
// ============================================================================

interface DiagramEditorInternalProps extends DiagramEditorProps {
  isClient: boolean
}

function DiagramEditorInternal({
  initialNodes = defaultNodes,
  initialEdges = defaultEdges,
  onChange,
  readOnly = false,
  showSidebar = true,
  isClient,
}: DiagramEditorInternalProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)
  const { screenToFlowPosition } = useReactFlow()

  // React Flow state management
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Edge type for new connections
  const [selectedEdgeType, setSelectedEdgeType] = useState('association')

  // Handle new connections between nodes
  const onConnect: OnConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: `edge_${Date.now()}`,
        type: selectedEdgeType,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        data:
          selectedEdgeType === 'dependency'
            ? { type: 'include' as const }
            : undefined,
      }
      setEdges((eds) => addEdge(newEdge, eds))
    },
    [setEdges, selectedEdgeType],
  )

  // Handle drag over for drop zone
  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  // Handle drop from shapes sidebar
  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('application/reactflow-type')
      const dataString = event.dataTransfer.getData(
        'application/reactflow-data',
      )

      if (!type) return

      // Get position relative to the flow canvas
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      // Parse default data
      let data = { label: type.charAt(0).toUpperCase() + type.slice(1) }
      try {
        const parsed = JSON.parse(dataString)
        data = { ...data, ...parsed }
      } catch {
        // Use default data
      }

      // Create new node
      const newNode: Node = {
        id: generateNodeId(),
        type,
        position,
        data,
      }

      setNodes((nds) => [...nds, newNode])
    },
    [screenToFlowPosition, setNodes],
  )

  // Get selected nodes/edges count for UI
  const selectedNodesCount = nodes.filter((n) => n.selected).length
  const selectedEdgesCount = edges.filter((e) => e.selected).length
  const hasSelection = selectedNodesCount > 0 || selectedEdgesCount > 0

  // Delete selected elements (manual button)
  const handleDeleteSelected = useCallback(() => {
    setNodes((nds) => nds.filter((n) => !n.selected))
    setEdges((eds) => eds.filter((e) => !e.selected))
  }, [setNodes, setEdges])

  // Notify parent of changes
  useEffect(() => {
    if (onChange) {
      onChange(nodes, edges)
    }
  }, [nodes, edges, onChange])

  // Don't render on server
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-full">
      {/* Shapes Sidebar */}
      {showSidebar && !readOnly && (
        <ShapesSidebar
          selectedEdgeType={selectedEdgeType}
          onEdgeTypeChange={setSelectedEdgeType}
        />
      )}

      {/* Canvas */}
      <div ref={reactFlowWrapper} className="flex-1 h-full relative">
        {/* Toolbar for delete action */}
        {!readOnly && hasSelection && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg shadow-lg">
            <span className="text-sm text-muted-foreground">
              {selectedNodesCount > 0 &&
                `${selectedNodesCount} node${selectedNodesCount > 1 ? 's' : ''}`}
              {selectedNodesCount > 0 && selectedEdgesCount > 0 && ', '}
              {selectedEdgesCount > 0 &&
                `${selectedEdgesCount} edge${selectedEdgesCount > 1 ? 's' : ''}`}
              {' selected'}
            </span>
            <button
              onClick={handleDeleteSelected}
              className="px-3 py-1.5 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-md transition-colors"
            >
              Delete
            </button>
            <span className="text-xs text-muted-foreground ml-1">
              (or press Delete)
            </span>
          </div>
        )}

        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={readOnly ? undefined : onNodesChange}
          onEdgesChange={readOnly ? undefined : onEdgesChange}
          onConnect={readOnly ? undefined : onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={useCaseNodeTypes}
          edgeTypes={useCaseEdgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          attributionPosition="bottom-left"
          proOptions={{ hideAttribution: true }}
          className="bg-background"
          // Interaction settings
          nodesDraggable={!readOnly}
          nodesConnectable={!readOnly}
          elementsSelectable={!readOnly}
          // Delete keys - Delete and Backspace both work
          deleteKeyCode={readOnly ? null : ['Delete', 'Backspace']}
          // Connection line style
          connectionLineStyle={{ stroke: '#667eea', strokeWidth: 2 }}
          // Snap to grid
          snapToGrid={true}
          snapGrid={[15, 15]}
          // Multi-selection
          selectionOnDrag={true}
          selectionKeyCode={['Shift']}
        >
          {/* Background with dots pattern */}
          <Background
            variant={BackgroundVariant.Dots}
            gap={20}
            size={1}
            color="#333355"
          />

          {/* Zoom controls */}
          <Controls
            className="bg-card border border-border rounded-lg"
            showInteractive={false}
          />

          {/* Mini map for navigation */}
          <MiniMap
            className="bg-card border border-border rounded-lg"
            nodeColor={(node) => {
              switch (node.type) {
                case 'actor':
                  return '#667eea'
                case 'usecase':
                  return '#764ba2'
                case 'system':
                  return '#444466'
                default:
                  return '#6b7280'
              }
            }}
            maskColor="rgba(0, 0, 0, 0.8)"
            pannable
            zoomable
          />

          {/* Empty state hint */}
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center p-8 rounded-xl bg-card/80 border border-border/50 backdrop-blur-sm">
                <p className="text-lg text-muted-foreground mb-2">
                  Drag shapes from the sidebar to start
                </p>
                <p className="text-sm text-muted-foreground">
                  Or connect existing nodes by dragging between handles
                </p>
              </div>
            </div>
          )}
        </ReactFlow>
      </div>
    </div>
  )
}

// ============================================================================
// Main Component with Provider wrapper
// ============================================================================

export default function DiagramEditor(props: DiagramEditorProps) {
  // SSR hydration check - only render on client
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <ReactFlowProvider>
      <DiagramEditorInternal {...props} isClient={isClient} />
    </ReactFlowProvider>
  )
}
