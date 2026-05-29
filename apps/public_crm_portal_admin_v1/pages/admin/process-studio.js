import AdminShell from '../../components/shell/AdminShell'

export default function ProcessStudioPage() {
  return (
    <AdminShell title="Process Studio">
      <div className="card">
        <h3>Workflow Editor</h3>
        <p>Placeholder for workflow editor UI. Plans to include:</p>
        <ul>
          <li>Drag-and-drop workflow builder</li>
          <li>SLA policy definitions</li>
          <li>Escalation matrix configuration</li>
          <li>Approval routing</li>
        </ul>
      </div>
      <div className="card">
        <h3>Existing Workflows</h3>
        <p>No workflows configured yet.</p>
      </div>
    </AdminShell>
  )
}
