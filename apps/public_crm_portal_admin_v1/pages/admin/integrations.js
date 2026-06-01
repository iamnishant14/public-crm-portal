import AdminShell from '../../components/shell/AdminShell'

export default function IntegrationsPage() {
  return (
    <AdminShell title="Integrations">
      <div className="card">
        <h3>Connectors</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Connector Name</th>
              <th>Status</th>
              <th>Last Sync</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Email Service</td>
              <td>✓ Active</td>
              <td>5 minutes ago</td>
              <td><button>Configure</button></td>
            </tr>
            <tr>
              <td>SMS Gateway</td>
              <td>⚠ Pending Setup</td>
              <td>Never</td>
              <td><button>Configure</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3>Data Mappings</h3>
        <p>Manage field mappings and sync schedules.</p>
      </div>
    </AdminShell>
  )
}
