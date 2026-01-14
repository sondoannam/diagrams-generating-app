/**
 * Custom Edge Types for Use Case Diagrams
 *
 * These are React Flow custom edges for UML diagram connections.
 * - Association: Solid line (actor to use case)
 * - Include/Extend: Dashed line with label
 */

import { memo } from 'react'
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
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
    markerEnd,
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
          markerEnd={markerEnd}
          style={{
            ...style,
            stroke: selected ? '#667eea' : '#a0a0b0',
            strokeWidth: selected ? 2.5 : 2,
          }}
        />
        {data?.label && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: 'all',
              }}
              className="px-2 py-1 text-xs bg-background border border-border rounded"
            >
              {data.label}
            </div>
          </EdgeLabelRenderer>
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
    markerEnd,
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
          markerEnd={markerEnd}
          style={{
            ...style,
            stroke: selected ? '#667eea' : '#6b7280',
            strokeWidth: selected ? 2 : 1.5,
            strokeDasharray: '6,4',
          }}
        />
        {label && (
          <EdgeLabelRenderer>
            <div
              style={{
                position: 'absolute',
                transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                pointerEvents: 'all',
              }}
              className={`px-2 py-0.5 text-xs font-medium italic rounded ${
                selected
                  ? 'bg-primary/20 text-primary border border-primary'
                  : 'bg-muted text-muted-foreground border border-border'
              }`}
            >
              {label}
            </div>
          </EdgeLabelRenderer>
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
