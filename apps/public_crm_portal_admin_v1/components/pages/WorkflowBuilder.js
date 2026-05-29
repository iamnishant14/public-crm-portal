import React, { useState } from 'react'
import styles from './WorkflowBuilder.module.css'

const STEP_TYPES = [
  { type: 'start', label: 'Start', icon: '◀' },
  { type: 'task', label: 'Task/Step', icon: '□' },
  { type: 'decision', label: 'Decision', icon: '◆' },
  { type: 'approval', label: 'Approval', icon: '✓' },
  { type: 'end', label: 'End', icon: '■' }
]

export default function WorkflowBuilder() {
  const [steps, setSteps] = useState([
    { id: 1, type: 'start', label: 'Start', x: 50, y: 50 }
  ])
  const [connections, setConnections] = useState([])
  const [selectedStep, setSelectedStep] = useState(null)
  const [nextId, setNextId] = useState(2)
  const [connecting, setConnecting] = useState(null)

  const canvasRef = React.useRef(null)

  const addStep = (stepType) => {
    const newStep = {
      id: nextId,
      type: stepType.type,
      label: stepType.label,
      x: Math.random() * 600 + 50,
      y: Math.random() * 300 + 50
    }
    setSteps([...steps, newStep])
    setNextId(nextId + 1)
  }

  const updateStep = (id, updates) => {
    setSteps(steps.map(s => s.id === id ? { ...s, ...updates } : s))
  }

  const deleteStep = (id) => {
    if (steps.length <= 1) return
    setSteps(steps.filter(s => s.id !== id))
    setConnections(connections.filter(c => c.from !== id && c.to !== id))
    if (selectedStep?.id === id) setSelectedStep(null)
  }

  const startConnection = (stepId) => {
    setConnecting(stepId)
  }

  const endConnection = (toId) => {
    if (connecting && connecting !== toId) {
      const exists = connections.some(c => c.from === connecting && c.to === toId)
      if (!exists) {
        setConnections([...connections, { from: connecting, to: toId }])
      }
    }
    setConnecting(null)
  }

  const removeConnection = (fromId, toId) => {
    setConnections(connections.filter(c => !(c.from === fromId && c.to === toId)))
  }

  const exportWorkflow = () => {
    const workflow = {
      version: '1.0.0',
      name: 'Workflow',
      steps: steps,
      connections: connections
    }
    navigator.clipboard.writeText(JSON.stringify(workflow, null, 2))
    alert('Workflow exported to clipboard!')
  }

  const saveWorkflow = async (name) => {
    const payload = { name: name || `Workflow ${Date.now()}`, data: { steps, connections }, createdBy: 'admin@org.gov' }
    try {
      const resp = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await resp.json()
      alert('Saved workflow: ' + data.id)
      return data
    } catch (e) {
      console.error(e)
      alert('Failed to save workflow')
    }
  }

  const loadWorkflows = async () => {
    try {
      const resp = await fetch('/api/workflows')
      const data = await resp.json()
      return data.workflows
    } catch (e) {
      console.error(e)
      return []
    }
  }

  const loadWorkflowById = async (id) => {
    try {
      const resp = await fetch(`/api/workflows/${id}`)
      if (!resp.ok) throw new Error('not found')
      const data = await resp.json()
      setSteps(data.data.steps || [])
      setConnections(data.data.connections || [])
      setSelectedStep(null)
    } catch (e) {
      console.error(e)
      alert('Failed to load workflow')
    }
  }

  return (
    <div className={styles.workflowBuilder}>
      <div className={styles.canvas}>
        <h3>Workflow Canvas</h3>
        <svg
          ref={canvasRef}
          className={styles.svg}
          width="800"
          height="400"
          style={{ border: '1px solid #e5e7eb', borderRadius: '6px', background: '#f9fafb' }}
        >
          {/* Draw connections */}
          {connections.map((conn, idx) => {
            const fromStep = steps.find(s => s.id === conn.from)
            const toStep = steps.find(s => s.id === conn.to)
            if (!fromStep || !toStep) return null
            return (
              <g key={idx}>
                <line
                  x1={fromStep.x + 40}
                  y1={fromStep.y + 30}
                  x2={toStep.x}
                  y2={toStep.y + 30}
                  stroke="#2563eb"
                  strokeWidth="2"
                  markerEnd="url(#arrowhead)"
                />
                <circle
                  cx={(fromStep.x + 40 + toStep.x) / 2}
                  cy={(fromStep.y + 30 + toStep.y + 30) / 2}
                  r="6"
                  fill="#fff"
                  stroke="#ef4444"
                  strokeWidth="2"
                  cursor="pointer"
                  onClick={() => removeConnection(conn.from, conn.to)}
                  title="Click to remove connection"
                />
              </g>
            )
          })}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#2563eb" />
            </marker>
          </defs>

          {/* Draw steps */}
          {steps.map(step => (
            <g
              key={step.id}
              transform={`translate(${step.x}, ${step.y})`}
              onClick={() => setSelectedStep(step)}
            >
              <rect
                width="80"
                height="60"
                rx="4"
                fill={selectedStep?.id === step.id ? '#bfdbfe' : '#fff'}
                stroke={selectedStep?.id === step.id ? '#2563eb' : '#d1d5db'}
                strokeWidth="2"
                cursor="pointer"
              />
              <text x="40" y="20" textAnchor="middle" fontSize="12" fill="#111827" fontWeight="600">
                {step.label}
              </text>
              <text x="40" y="38" textAnchor="middle" fontSize="10" fill="#6b7280">
                ID: {step.id}
              </text>

              {/* Connection handle */}
              <circle
                cx="80"
                cy="30"
                r="5"
                fill="#2563eb"
                cursor="pointer"
                onMouseDown={() => startConnection(step.id)}
                opacity={connecting === step.id ? 0.7 : 1}
              />
            </g>
          ))}

          {/* Draw connection line while connecting */}
          {connecting && selectedStep && (
            <line
              x1={steps.find(s => s.id === connecting)?.x + 80}
              y1={steps.find(s => s.id === connecting)?.y + 30}
              x2={selectedStep.x + 40}
              y2={selectedStep.y + 30}
              stroke="#2563eb"
              strokeWidth="1"
              strokeDasharray="5,5"
              opacity="0.5"
            />
          )}
        </svg>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.palette}>
          <h4>Workflow Steps</h4>
          <div className={styles.stepTypes}>
            {STEP_TYPES.map(st => (
              <button
                key={st.type}
                className={styles.stepTypeBtn}
                onClick={() => addStep(st)}
              >
                {st.icon} {st.label}
              </button>
            ))}
          </div>
        </div>

        {selectedStep && (
          <div className={styles.properties}>
            <h4>Step Properties</h4>
            <div className={styles.propGroup}>
              <label>Label</label>
              <input
                type="text"
                value={selectedStep.label}
                onChange={(e) => updateStep(selectedStep.id, { label: e.target.value })}
              />
            </div>
            <div className={styles.propGroup}>
              <label>Type</label>
              <select
                value={selectedStep.type}
                onChange={(e) => updateStep(selectedStep.id, { type: e.target.value })}
              >
                {STEP_TYPES.map(st => (
                  <option key={st.type} value={st.type}>{st.label}</option>
                ))}
              </select>
            </div>
            {selectedStep.type === 'approval' && (
              <div className={styles.propGroup}>
                <label>Required Approvers</label>
                <select multiple size="3">
                  <option>ComplianceOfficer</option>
                  <option>OrgAdmin</option>
                  <option>PlatformSuperAdmin</option>
                </select>
              </div>
            )}
            <button
              className={styles.deleteBtn}
              onClick={() => deleteStep(selectedStep.id)}
              disabled={steps.length <= 1}
            >
              🗑 Delete Step
            </button>
          </div>
        )}

        <button className={styles.exportBtn} onClick={exportWorkflow}>
          📥 Export Workflow
        </button>
      </div>
    </div>
  )
}
