/**
 * Custom Node Types for Use Case Diagrams
 *
 * These are React Flow custom nodes that render as UML Use Case diagram shapes.
 * Each node supports inline label editing via double-click.
 */

import {
  memo,
  useState,
  useRef,
  useEffect,
  useCallback,
  type KeyboardEvent,
} from 'react'
import {
  Handle,
  Position,
  useReactFlow,
  type NodeProps,
  type Node,
} from '@xyflow/react'

// ============================================================================
// Node Data Types
// ============================================================================

export interface ActorNodeData extends Record<string, unknown> {
  label: string
}

export interface UseCaseNodeData extends Record<string, unknown> {
  label: string
}

export interface SystemNodeData extends Record<string, unknown> {
  label: string
}

// Node type definitions for React Flow
export type ActorNode = Node<ActorNodeData, 'actor'>
export type UseCaseNode = Node<UseCaseNodeData, 'usecase'>
export type SystemNode = Node<SystemNodeData, 'system'>

// ============================================================================
// Editable Label Component
// ============================================================================

interface EditableLabelProps {
  nodeId: string
  value: string
  selected?: boolean
  className?: string
  inputClassName?: string
}

function EditableLabel({
  nodeId,
  value,
  selected,
  className = '',
  inputClassName = '',
}: EditableLabelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setNodes } = useReactFlow()

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Start editing on double-click
  const handleDoubleClick = useCallback(() => {
    setEditValue(value)
    setIsEditing(true)
  }, [value])

  // Save changes
  const handleSave = useCallback(() => {
    const trimmedValue = editValue.trim()
    if (trimmedValue && trimmedValue !== value) {
      setNodes((nodes) =>
        nodes.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, label: trimmedValue } }
            : node,
        ),
      )
    }
    setIsEditing(false)
  }, [editValue, value, nodeId, setNodes])

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        handleSave()
      } else if (e.key === 'Escape') {
        setEditValue(value)
        setIsEditing(false)
      }
      // Stop propagation to prevent React Flow from handling these keys
      e.stopPropagation()
    },
    [handleSave, value],
  )

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`bg-transparent border-b-2 border-primary outline-none text-center ${inputClassName}`}
        style={{ minWidth: '60px', width: `${editValue.length + 2}ch` }}
      />
    )
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`cursor-text select-none ${className}`}
      title="Double-click to edit"
    >
      {value}
    </div>
  )
}

// ============================================================================
// Actor Node - Stick figure representation
// ============================================================================

export const ActorNode = memo(
  ({ id, data, selected }: NodeProps<ActorNode>) => {
    return (
      <div
        className={`flex flex-col items-center justify-center transition-all ${
          selected ? 'scale-110' : ''
        }`}
      >
        {/* Stick figure SVG */}
        <svg
          width="60"
          height="80"
          viewBox="0 0 60 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`transition-all ${selected ? 'drop-shadow-[0_0_8px_rgba(102,126,234,0.8)]' : ''}`}
        >
          {/* Head */}
          <circle
            cx="30"
            cy="12"
            r="10"
            stroke={selected ? '#667eea' : '#a0a0b0'}
            strokeWidth="2"
            fill="transparent"
          />
          {/* Body */}
          <line
            x1="30"
            y1="22"
            x2="30"
            y2="50"
            stroke={selected ? '#667eea' : '#a0a0b0'}
            strokeWidth="2"
          />
          {/* Arms */}
          <line
            x1="10"
            y1="35"
            x2="50"
            y2="35"
            stroke={selected ? '#667eea' : '#a0a0b0'}
            strokeWidth="2"
          />
          {/* Left leg */}
          <line
            x1="30"
            y1="50"
            x2="15"
            y2="75"
            stroke={selected ? '#667eea' : '#a0a0b0'}
            strokeWidth="2"
          />
          {/* Right leg */}
          <line
            x1="30"
            y1="50"
            x2="45"
            y2="75"
            stroke={selected ? '#667eea' : '#a0a0b0'}
            strokeWidth="2"
          />
        </svg>

        {/* Editable Label */}
        <EditableLabel
          nodeId={id}
          value={data.label}
          selected={selected}
          className={`mt-1 text-sm font-medium text-center max-w-[100px] ${
            selected ? 'text-primary' : 'text-foreground'
          }`}
          inputClassName={`text-sm font-medium ${selected ? 'text-primary' : 'text-foreground'}`}
        />

        {/* Connection handles - both source and target at each position for bidirectional connections */}
        <Handle
          type="source"
          position={Position.Right}
          id="right-source"
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
        <Handle
          type="target"
          position={Position.Right}
          id="right-target"
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
        <Handle
          type="source"
          position={Position.Left}
          id="left-source"
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left-target"
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
      </div>
    )
  },
)

ActorNode.displayName = 'ActorNode'

// ============================================================================
// Use Case Node - Ellipse shape
// ============================================================================

export const UseCaseNode = memo(
  ({ id, data, selected }: NodeProps<UseCaseNode>) => {
    return (
      <div
        className={`relative flex items-center justify-center min-w-[120px] min-h-[60px] px-6 py-3 rounded-[50%] border-2 transition-all ${
          selected
            ? 'border-primary bg-primary/10 shadow-[0_0_12px_rgba(102,126,234,0.5)]'
            : 'border-muted-foreground/50 bg-card/80'
        }`}
      >
        {/* Editable Label */}
        <EditableLabel
          nodeId={id}
          value={data.label}
          selected={selected}
          className={`text-sm font-medium text-center ${
            selected ? 'text-primary' : 'text-foreground'
          }`}
          inputClassName={`text-sm font-medium ${selected ? 'text-primary' : 'text-foreground'}`}
        />

        {/* Connection handles - both source and target at each position for bidirectional connections */}
        <Handle
          type="source"
          position={Position.Left}
          id="left-source"
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left-target"
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right-source"
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
        <Handle
          type="target"
          position={Position.Right}
          id="right-target"
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
        <Handle
          type="source"
          position={Position.Top}
          id="top-source"
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
        <Handle
          type="target"
          position={Position.Top}
          id="top-target"
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom-source"
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
        <Handle
          type="target"
          position={Position.Bottom}
          id="bottom-target"
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
      </div>
    )
  },
)

UseCaseNode.displayName = 'UseCaseNode'

// ============================================================================
// System Boundary Node - Rectangle with dashed border
// ============================================================================

export const SystemNode = memo(
  ({ id, data, selected }: NodeProps<SystemNode>) => {
    return (
      <div
        className={`flex items-center justify-center min-w-[150px] min-h-[80px] px-6 py-4 border-2 border-dashed rounded-lg transition-all ${
          selected
            ? 'border-primary bg-primary/5 shadow-[0_0_12px_rgba(102,126,234,0.3)]'
            : 'border-muted-foreground/40 bg-card/30'
        }`}
      >
        {/* Editable Label */}
        <EditableLabel
          nodeId={id}
          value={data.label}
          selected={selected}
          className={`text-sm font-medium text-center ${
            selected ? 'text-primary' : 'text-muted-foreground'
          }`}
          inputClassName={`text-sm font-medium ${selected ? 'text-primary' : 'text-muted-foreground'}`}
        />

        {/* Connection handles - both source and target at each position for bidirectional connections */}
        <Handle
          type="source"
          position={Position.Left}
          id="left-source"
          className="w-3! h-3! bg-muted-foreground! border-2! border-background!"
        />
        <Handle
          type="target"
          position={Position.Left}
          id="left-target"
          className="w-3! h-3! bg-muted-foreground! border-2! border-background!"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="right-source"
          className="w-3! h-3! bg-muted-foreground! border-2! border-background!"
        />
        <Handle
          type="target"
          position={Position.Right}
          id="right-target"
          className="w-3! h-3! bg-muted-foreground! border-2! border-background!"
        />
      </div>
    )
  },
)

SystemNode.displayName = 'SystemNode'

// ============================================================================
// Node Types Registry
// ============================================================================

export const useCaseNodeTypes = {
  actor: ActorNode,
  usecase: UseCaseNode,
  system: SystemNode,
}
