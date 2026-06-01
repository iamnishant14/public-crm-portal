import AdminShell from '../../components/shell/AdminShell'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import ConfigPublish from '../../components/pages/ConfigPublish'
import SafeChangeWorkflow from '../../components/pages/SafeChangeWorkflow'

export default function ReleasesPage() {
  return (
    <ProtectedRoute>
      <AdminShell title="Releases & Configuration">
        <div className="card">
          <h3>Safe-Change Workflow</h3>
          <p>Draft → Preview → Risk Assessment → Approvals → Publish</p>
          <SafeChangeWorkflow />
        </div>

        <ConfigPublish />

        <div className="card" style={{ marginTop: '30px' }}>
          <h3>Config Versions History</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Version</th>
                <th>Status</th>
                <th>Created</th>
                <th>Created By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>v43</td>
                <td>Publishing...</td>
                <td>Just now</td>
                <td>admin@org.gov</td>
                <td><button>Monitor</button></td>
              </tr>
              <tr>
                <td>v42</td>
                <td>✓ Published</td>
                <td>1 day ago</td>
                <td>admin@org.gov</td>
                <td><button>View</button> <button>Rollback</button></td>
              </tr>
              <tr>
                <td>v41</td>
                <td>✓ Published</td>
                <td>3 days ago</td>
                <td>compliance@org.gov</td>
                <td><button>View</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </AdminShell>
    </ProtectedRoute>
  )
}
