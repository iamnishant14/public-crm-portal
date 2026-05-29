import AdminShell from '../../components/shell/AdminShell'

export default function DashboardPage() {
  return (
    <AdminShell title="Dashboard">
      <div className="card">
        <h3>Health Summary</h3>
        <p>System status: Operational</p>
        <ul>
          <li>API latency: 45ms (P95)</li>
          <li>Database replication lag: 0.2s</li>
          <li>Active tenants: 12</li>
          <li>Config changes pending review: 2</li>
        </ul>
      </div>
      <div className="card">
        <h3>Recent Changes</h3>
        <p>Organization XYZ updated role permissions (2 hours ago)</p>
        <p>Config version 42 published to production (1 day ago)</p>
      </div>
      <div className="card">
        <h3>Pending Approvals</h3>
        <p>None at this time</p>
      </div>
    </AdminShell>
  )
}
