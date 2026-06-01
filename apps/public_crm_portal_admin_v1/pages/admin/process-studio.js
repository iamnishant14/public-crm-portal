import AdminShell from '../../components/shell/AdminShell'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import WorkflowBuilder from '../../components/pages/WorkflowBuilder'
import SLAEditor from '../../components/pages/SLAEditor'

export default function ProcessStudioPage() {
  return (
    <ProtectedRoute>
      <AdminShell title="Process Studio">
        <div className="card">
          <h3>Workflow Editor</h3>
          <p>Drag workflow steps onto the canvas and connect them. Drag the blue circle on each step to create connections.</p>
          <WorkflowBuilder />
        </div>

        <div className="card" style={{ marginTop: '30px' }}>
          <h3>SLA Policy Manager</h3>
          <p>Define service level agreements with triggers, target times, and escalation rules</p>
          <SLAEditor />
        </div>

        <div className="card" style={{ marginTop: '30px' }}>
          <h3>Escalation Matrix</h3>
          <p>Placeholder for escalation routing matrix (role-based, time-based, priority-based escalations)</p>
        </div>
      </AdminShell>
    </ProtectedRoute>
  )
}
