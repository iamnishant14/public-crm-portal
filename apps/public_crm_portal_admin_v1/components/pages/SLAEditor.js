import React, { useState } from 'react'
import styles from './SLAEditor.module.css'

export default function SLAEditor() {
  const [policies, setPolicies] = useState([
    {
      id: 1,
      name: 'Standard SLA',
      trigger: 'case_created',
      target: 24,
      unit: 'hours',
      escalation: [
        { percent: 75, action: 'notify_manager', offset: 18 },
        { percent: 100, action: 'escalate_priority', offset: 24 }
      ]
    }
  ])
  const [selectedPolicy, setSelectedPolicy] = useState(policies[0])

  const addPolicy = () => {
    const newPolicy = {
      id: Math.max(...policies.map(p => p.id), 0) + 1,
      name: 'New SLA',
      trigger: 'case_created',
      target: 24,
      unit: 'hours',
      escalation: []
    }
    setPolicies([...policies, newPolicy])
    setSelectedPolicy(newPolicy)
  }

  const updatePolicy = (id, updates) => {
    const updated = policies.map(p => p.id === id ? { ...p, ...updates } : p)
    setPolicies(updated)
    if (selectedPolicy?.id === id) {
      setSelectedPolicy({ ...selectedPolicy, ...updates })
    }
  }

  const addEscalation = (policyId) => {
    const policy = policies.find(p => p.id === policyId)
    const newEscalation = {
      percent: 75,
      action: 'notify_manager',
      offset: Math.floor(policy.target * 0.75)
    }
    updatePolicy(policyId, {
      escalation: [...policy.escalation, newEscalation]
    })
  }

  return (
    <div className={styles.slaEditor}>
      <div className={styles.policies}>
        <h3>SLA Policies</h3>
        <div className={styles.policyList}>
          {policies.map(policy => (
            <button
              key={policy.id}
              className={`${styles.policyItem} ${selectedPolicy?.id === policy.id ? styles.active : ''}`}
              onClick={() => setSelectedPolicy(policy)}
            >
              {policy.name}
            </button>
          ))}
        </div>
        <button className={styles.addBtn} onClick={addPolicy}>+ New Policy</button>
      </div>

      {selectedPolicy && (
        <div className={styles.policyEditor}>
          <h3>Policy Configuration</h3>
          
          <div className={styles.formGroup}>
            <label>Policy Name</label>
            <input
              type="text"
              value={selectedPolicy.name}
              onChange={(e) => updatePolicy(selectedPolicy.id, { name: e.target.value })}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Trigger Event</label>
              <select
                value={selectedPolicy.trigger}
                onChange={(e) => updatePolicy(selectedPolicy.id, { trigger: e.target.value })}
              >
                <option value="case_created">Case Created</option>
                <option value="case_reopened">Case Reopened</option>
                <option value="status_changed">Status Changed</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Target Time</label>
              <div className={styles.timeInput}>
                <input
                  type="number"
                  value={selectedPolicy.target}
                  onChange={(e) => updatePolicy(selectedPolicy.id, { target: parseInt(e.target.value) })}
                  min="1"
                />
                <select
                  value={selectedPolicy.unit}
                  onChange={(e) => updatePolicy(selectedPolicy.id, { unit: e.target.value })}
                >
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          </div>

          <div className={styles.escalationSection}>
            <h4>Escalation Rules</h4>
            {selectedPolicy.escalation.length === 0 ? (
              <p className={styles.emptyState}>No escalations configured</p>
            ) : (
              <table className={styles.escalationTable}>
                <thead>
                  <tr>
                    <th>At %</th>
                    <th>Action</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPolicy.escalation.map((esc, idx) => (
                    <tr key={idx}>
                      <td>{esc.percent}%</td>
                      <td>{esc.action}</td>
                      <td>{esc.offset} {selectedPolicy.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              className={styles.addEscBtn}
              onClick={() => addEscalation(selectedPolicy.id)}
            >
              + Add Escalation
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
