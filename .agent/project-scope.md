# DiagramAI - Project Scope & Purpose

## Overview
DiagramAI is a SaaS web application focused on generating system design diagrams through AI-powered conversations. Unlike general-purpose AI chat apps, this tool is specialized for creating:
- **Use Case Diagrams**
- **Activity Diagrams**
- **Sequence Diagrams**

## Core Concept
A conversation-first approach to diagram creation where:
1. Each conversation produces **one final diagram**
2. Users describe requirements in natural language
3. AI processes and confirms understanding before generating
4. Diagrams are editable and exportable

## User Flow

### 1. Requirement Gathering
- User opens a new conversation
- User describes what diagram they need
- AI responds with:
  - Understanding of the requirements
  - Proposed diagram structure/description

### 2. Confirmation Phase
- User reviews AI's interpretation
- User can refine or approve the description

### 3. Generation Phase
- Once approved, AI generates the diagram
- Chat moves to right side panel
- Diagram editor (ReactFlow) takes center stage
- Diagram appears in the editor workspace

### 4. Editing & Export
- User can freely edit the generated diagram
- Export options: PNG, PDF

## Technical Architecture

### AI Agent
- **Phase 1**: Gemini API (free tier)
- **Future**: Self-hosted models with custom agent

### Diagram Format
- AI output: JSON format
- Must match ReactFlow component props structure
- Contains: nodes, edges, viewport configuration

### Key Technologies
- **Frontend**: TanStack Start, React, TailwindCSS
- **Auth**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **Diagram Rendering**: ReactFlow (@xyflow/react)
- **UI Components**: shadcn-ui

## Data Model
- **User** → synced with Clerk
- **Diagram** → stores ReactFlow JSON, type, thumbnail
- **Message** → conversation history per diagram

## Out of Scope (for now)
- Real-time collaboration
- Version history
- Template library
- Other diagram types (ERD, Class diagrams, etc.)
