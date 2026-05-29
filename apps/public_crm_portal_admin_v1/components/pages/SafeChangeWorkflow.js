import React, { useState } from 'react'
import styles from './SafeChangeWorkflow.module.css'

export default function SafeChangeWorkflow() {
  const [step, setStep] = useState('edit') // edit, preview, risk, approval, published
  const [draftData, setDraftData] = useState({
    title: 'Update OrgAdmin role permissions',
    description: 'Add "publish" permission to OrgAdmin role',
    changes: [
      { field: 'OrgAdmin.permissions', from: '["read", "write", "approve"]', to: '["read", "write", "approve", "publish"]' }
    ]
  })
  const [riskScore, setRiskScore] = useState(null)
  const [approvals, setApprovals] = useState([])

  const handlePreview = () => {
    setStep('preview')
  }

  const handleSimulate = () => {
    // Simulate and calculate risk score
    setRiskScore(35) // Example: 35/100 risk
    setStep('risk')
  }

  const handleRequestApproval = () => {
    setApprovals([
      { reviewer: 'compliance@org.gov', status: 'pending' },
      { reviewer: 'admin@org.gov', status: 'pending' }
    ])
    setStep('approval')
  }

  const handleApprove = (index) => {
    const updated = [...approvals]
    updated[index].status = 'approved'
    setApprovals(updated)
    
    // If all approved, move to publish
    if (updated.every(a => a.status === 'approved')) {
      setStep('publish')
    }
  }

  const handlePublish = () => {
    setStep('published')
  }

  const renderStepContent = () => {
    switch (step) {
      case 'edit':
        return (
          <div className={styles.stepContent}>
            <h3>Edit Draft</h3>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input
                type="text"
                value={draftData.title}
                onChange={(e) => setDraftData({ ...draftData, title: e.target.value })}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Description</label>
              <textarea
                value={draftData.description}
                onChange={(e) => setDraftData({ ...draftData, description: e.target.value })}
                rows="3"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Changes</label>
              <pre className={styles.changesSummary}>
                {JSON.stringify(draftData.changes, null, 2)}
              </pre>
            </div>
            <button className={styles.primaryBtn} onClick={handlePreview}>
              Preview Changes →
            </button>
          </div>
        )

      case 'preview':
        return (
          <div className={styles.stepContent}>
            <h3>Preview Simulation</h3>
            <div className={styles.changeTable}>
              <table>
                <thead>
                  <tr>
                    <th>Field</th>
                    <th>Current</th>
                    <th>Proposed</th>
                  </tr>
                </thead>
                <tbody>
                  {draftData.changes.map((change, idx) => (
                    <tr key={idx}>
                      <td>{change.field}</td>
                      <td><code>{change.from}</code></td>
                      <td><code className={styles.added}>{change.to}</code></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={styles.notice}>Running simulation to estimate impact...</p>
            <button className={styles.primaryBtn} onClick={handleSimulate}>
              Calculate Risk Score →
            </button>
          </div>
        )

      case 'risk':
        return (
          <div className={styles.stepContent}>
            <h3>Risk Assessment</h3>
            <div className={styles.riskScoreCard}>
              <div className={styles.riskGauge}>
                <div className={styles.gaugeValue}>{riskScore}</div>
                <div className={styles.gaugeLabel}>Risk Score</div>
              </div>
              <div className={styles.riskDetails}>
                <p><strong>Impact Level:</strong> Medium</p>
                <p><strong>Affected Users:</strong> 5 OrgAdmins</p>
                <p><strong>Requires Approval:</strong> Yes (ComplianceOfficer + PlatformSuperAdmin)</p>
                <p><strong>Validation Errors:</strong> None</p>
              </div>
            </div>
            <div className={styles.guardrails}>
              <h4>Guardrails Check</h4>
              <ul>
                <li>✓ No deletion of mandatory compliance controls</li>
                <li>✓ Permission scope within org boundaries</li>
                <li>⚠ Requires dual approval for policy change</li>
              </ul>
            </div>
            <button className={styles.primaryBtn} onClick={handleRequestApproval}>
              Request Approvals →
            </button>
          </div>
        )

      case 'approval':
        return (
          <div className={styles.stepContent}>
            <h3>Approval Workflow</h3>
            <div className={styles.approvalChain}>
              {approvals.map((approval, idx) => (
                <div key={idx} className={styles.approvalStep}>
                  <div className={styles.approvalStatus}>
                    {approval.status === 'pending' && <span className={styles.pending}>⏳ Pending</span>}
                    {approval.status === 'approved' && <span className={styles.approved}>✓ Approved</span>}
                  </div>
                  <div className={styles.approvalReviewer}>{approval.reviewer}</div>
                  {approval.status === 'pending' && (
                    <button
                      className={styles.approveBtn}
                      onClick={() => handleApprove(idx)}
                    >
                      Approve
                    </button>
                  )}
                </div>
              ))}
            </div>
            {approvals.every(a => a.status === 'approved') && (
              <button className={styles.primaryBtn} onClick={handlePublish}>
                Publish Configuration →
              </button>
            )}
          </div>
        )

      case 'published':
        return (
          <div className={styles.stepContent}>
            <h3>✓ Published Successfully</h3>
            <div className={styles.successMessage}>
              <p>Configuration v43 published to production</p>
              <p>Timestamp: {new Date().toISOString()}</p>
              <p>All approvals complete</p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.workflow}>
      <div className={styles.timeline}>
        {['edit', 'preview', 'risk', 'approval', 'published'].map((s) => (
          <div key={s} className={`${styles.timelineStep} ${step === s || (step === 'published' && s === 'published') ? styles.active : ''}`}>
            {s}
          </div>
        ))}
      </div>
      {renderStepContent()}
    </div>
  )
}
