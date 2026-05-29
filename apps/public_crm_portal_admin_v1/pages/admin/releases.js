import AdminShell from '../../components/shell/AdminShell'

export default function ReleasesPage() {
  return (
    <AdminShell title="Releases">
      <div className="card">
        <h3>Config Versions</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Version</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>v42</td>
              <td>Published</td>
              <td>1 day ago</td>
              <td><button>View</button> <button>Rollback</button></td>
            </tr>
            <tr>
              <td>v41</td>
              <td>Published</td>
              <td>3 days ago</td>
              <td><button>View</button></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card">
        <h3>Publish History</h3>
        <p>v42: Permission updates by admin@org.gov (1 day ago)</p>
      </div>
    </AdminShell>
  )
}
