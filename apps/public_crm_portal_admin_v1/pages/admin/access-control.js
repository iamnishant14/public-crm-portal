import AdminShell from '../../components/shell/AdminShell'

export default function AccessControlPage() {
  return (
    <AdminShell title="Access Control">
      <div className="card">
        <h3>Roles</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Permissions</th>
              <th>Users</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>PlatformSuperAdmin</td>
              <td>Full control-plane governance</td>
              <td>2</td>
              <td><button>Edit</button></td>
            </tr>
            <tr>
              <td>OrgAdmin</td>
              <td>Full org configuration</td>
              <td>5</td>
              <td><button>Edit</button></td>
            </tr>
            <tr>
              <td>WorkflowManager</td>
              <td>Manage workflows &amp; forms</td>
              <td>8</td>
              <td><button>Edit</button></td>
            </tr>
            <tr>
              <td>ViewerAuditor</td>
              <td>Read-only access</td>
              <td>15</td>
              <td><button>Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3>Approval Chains</h3>
        <p>Standard: Dual approval required for high-impact policy changes</p>
      </div>
    </AdminShell>
  )
}
