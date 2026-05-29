import AdminShell from '../../components/shell/AdminShell'

export default function AuditPage() {
  return (
    <AdminShell title="Audit">
      <div className="card">
        <h3>Audit Logs</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Resource</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2024-05-29 10:15:00 UTC</td>
              <td>admin@org.gov</td>
              <td>Updated Role</td>
              <td>OrgAdmin</td>
              <td>✓ Success</td>
            </tr>
            <tr>
              <td>2024-05-29 09:45:00 UTC</td>
              <td>compliance@org.gov</td>
              <td>Viewed Audit Logs</td>
              <td>Audit</td>
              <td>✓ Success</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3>Export Audit Data</h3>
        <button>Export as CSV</button>
        <button>Export as JSON</button>
      </div>
    </AdminShell>
  )
}
