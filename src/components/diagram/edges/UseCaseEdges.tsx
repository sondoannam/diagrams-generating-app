/**
 * Custom Edge Types for Use Case Diagrams
 *
 * These are React Flow custom edges for UML diagram connections.
 * - Association: Solid line (actor to use case)
 * - Include/Extend: Dashed line with label
 *
 * Edge labels support inline editing via double-click.
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
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type Edge,
  type EdgeProps,
} from '@xyflow/react'

// ============================================================================
// Edge Data Types
// ============================================================================

export interface AssociationEdgeData extends Record<string, unknown> {
  label?: string
}

export interface DependencyEdgeData extends Record<string, unknown> {
  label?: string
  type?: 'include' | 'extend'
}

// Edge type definitions
export type AssociationEdge = Edge<AssociationEdgeData, 'association'>
export type DependencyEdge = Edge<DependencyEdgeData, 'dependency'>

// ============================================================================
// Editable Edge Label Component
// ============================================================================

interface EditableEdgeLabelProps {
  edgeId: string
  value: string
  labelX: number
  labelY: number
  selected?: boolean
  className?: string
}

function EditableEdgeLabel({
  edgeId,
  value,
  labelX,
  labelY,
  selected,
  className = '',
}: EditableEdgeLabelProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setEdges } = useReactFlow()

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // Start editing on double-click
  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      setEditValue(value)
      setIsEditing(true)
    },
    [value],
  )

  // Save changes
  const handleSave = useCallback(() => {
    const trimmedValue = editValue.trim()
    if (trimmedValue !== value) {
      setEdges((edges) =>
        edges.map((edge) =>
          edge.id === edgeId
            ? { ...edge, data: { ...edge.data, label: trimmedValue } }
            : edge,
        ),
      )
    }
    setIsEditing(false)
  }, [editValue, value, edgeId, setEdges])

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

  return (
    <EdgeLabelRenderer>
      <div
        style={{
          position: 'absolute',
          transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          pointerEvents: 'all',
        }}
        className={className}
        onDoubleClick={handleDoubleClick}
        title={isEditing ? undefined : 'Double-click to edit'}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            onClick={(e) => e.stopPropagation()}
            className="bg-transparent border-b-2 border-primary outline-none text-center text-xs font-medium"
            style={{ minWidth: '60px', width: `${editValue.length + 2}ch` }}
          />
        ) : (
          <span className={`cursor-text ${selected ? 'text-primary' : ''}`}>
            {value}
          </span>
        )}
      </div>
    </EdgeLabelRenderer>
  )
}

// ============================================================================
// Association Edge - Solid line (Actor → Use Case)
// ============================================================================

export const AssociationEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerStart,
    data,
    selected,
  }: EdgeProps<AssociationEdge>) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    })

    return (
      <>
        <BaseEdge
          path={edgePath}
          markerStart={markerStart}
          style={{
            ...style,
            stroke: selected ? '#667eea' : '#a0a0b0',
            strokeWidth: selected ? 2.5 : 2,
          }}
        />
        {data?.label && (
          <EditableEdgeLabel
            edgeId={id}
            value={data.label}
            labelX={labelX}
            labelY={labelY}
            selected={selected}
            className="px-2 py-1 text-xs bg-background border border-border rounded"
          />
        )}
      </>
    )
  },
)

AssociationEdge.displayName = 'AssociationEdge'

// ============================================================================
// Dependency Edge - Dashed line with arrow (<<include>> or <<extend>>)
// ============================================================================

export const DependencyEdge = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerStart,
    data,
    selected,
  }: EdgeProps<DependencyEdge>) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    })

    // Determine label based on dependency type
    const label = data?.label || (data?.type ? `«${data.type}»` : '')

    return (
      <>
        <BaseEdge
          path={edgePath}
          markerStart={markerStart}
          style={{
            ...style,
            stroke: selected ? '#667eea' : '#6b7280',
            strokeWidth: selected ? 2 : 1.5,
            strokeDasharray: '6,4',
          }}
        />
        {label && (
          <EditableEdgeLabel
            edgeId={id}
            value={label}
            labelX={labelX}
            labelY={labelY}
            selected={selected}
            className={`px-2 py-0.5 text-xs font-medium italic rounded ${
              selected
                ? 'bg-primary/20 text-primary border border-primary'
                : 'bg-muted text-muted-foreground border border-border'
            }`}
          />
        )}
      </>
    )
  },
)

DependencyEdge.displayName = 'DependencyEdge'

// ============================================================================
// Edge Types Registry
// ============================================================================

export const useCaseEdgeTypes = {
  association: AssociationEdge,
  dependency: DependencyEdge,
}

// ============================================================================
// Default Edge Options
// ============================================================================

export const defaultEdgeOptions = {
  type: 'association',
  animated: false,
}
