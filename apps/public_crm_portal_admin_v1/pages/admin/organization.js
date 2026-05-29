import AdminShell from '../../components/shell/AdminShell'

export default function OrganizationPage() {
  return (
    <AdminShell title="Organization">
      <div className="card">
        <h3>Organization Profile</h3>
        <form>
          <div className="form-group">
            <label htmlFor="org-name">Organization Name</label>
            <input id="org-name" type="text" placeholder="e.g., City Hospital" />
          </div>
          <div className="form-group">
            <label htmlFor="env">Environment</label>
            <select id="env">
              <option>Production</option>
              <option>Staging</option>
              <option>Development</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="capacity">Capacity Tier</label>
            <select id="capacity">
              <option>Standard</option>
              <option>Professional</option>
              <option>Enterprise</option>
            </select>
          </div>
          <button type="submit">Save Changes</button>
        </form>
      </div>
      <div className="card">
        <h3>Compliance Profile</h3>
        <p>Audit status: Compliant</p>
        <p>Data classification: Confidential (Health Info)</p>
      </div>
    </AdminShell>
  )
}
