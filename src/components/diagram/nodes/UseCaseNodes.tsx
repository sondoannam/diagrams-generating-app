/**
 * Custom Node Types for Use Case Diagrams
 *
 * These are React Flow custom nodes that render as UML Use Case diagram shapes.
 */

import { memo } from 'react'
import { Handle, Position, type NodeProps, type Node } from '@xyflow/react'

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
// Actor Node - Stick figure representation
// ============================================================================

export const ActorNode = memo(({ data, selected }: NodeProps<ActorNode>) => {
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

      {/* Label */}
      <div
        className={`mt-1 text-sm font-medium text-center max-w-[100px] ${
          selected ? 'text-primary' : 'text-foreground'
        }`}
      >
        {data.label}
      </div>

      {/* Connection handles */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3! h-3! bg-primary! border-2! border-background!"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-3! h-3! bg-primary! border-2! border-background!"
      />
    </div>
  )
})

ActorNode.displayName = 'ActorNode'

// ============================================================================
// Use Case Node - Ellipse shape
// ============================================================================

export const UseCaseNode = memo(
  ({ data, selected }: NodeProps<UseCaseNode>) => {
    return (
      <div
        className={`relative flex items-center justify-center min-w-[120px] min-h-[60px] px-6 py-3 rounded-[50%] border-2 transition-all ${
          selected
            ? 'border-primary bg-primary/10 shadow-[0_0_12px_rgba(102,126,234,0.5)]'
            : 'border-muted-foreground/50 bg-card/80'
        }`}
      >
        {/* Label */}
        <span
          className={`text-sm font-medium text-center ${
            selected ? 'text-primary' : 'text-foreground'
          }`}
        >
          {data.label}
        </span>

        {/* Connection handles */}
        <Handle
          type="target"
          position={Position.Left}
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
        <Handle
          type="source"
          position={Position.Right}
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
        <Handle
          type="target"
          position={Position.Top}
          id="top"
          className="w-3! h-3! bg-primary! border-2! border-background!"
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="bottom"
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

export const SystemNode = memo(({ data, selected }: NodeProps<SystemNode>) => {
  return (
    <div
      className={`flex items-center justify-center min-w-[150px] min-h-[80px] px-6 py-4 border-2 border-dashed rounded-lg transition-all ${
        selected
          ? 'border-primary bg-primary/5 shadow-[0_0_12px_rgba(102,126,234,0.3)]'
          : 'border-muted-foreground/40 bg-card/30'
      }`}
    >
      {/* Label */}
      <span
        className={`text-sm font-medium text-center ${
          selected ? 'text-primary' : 'text-muted-foreground'
        }`}
      >
        {data.label}
      </span>

      {/* Connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3! h-3! bg-muted-foreground! border-2! border-background!"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3! h-3! bg-muted-foreground! border-2! border-background!"
      />
    </div>
  )
})

SystemNode.displayName = 'SystemNode'

// ============================================================================
// Node Types Registry
// ============================================================================

export const useCaseNodeTypes = {
  actor: ActorNode,
  usecase: UseCaseNode,
  system: SystemNode,
}
