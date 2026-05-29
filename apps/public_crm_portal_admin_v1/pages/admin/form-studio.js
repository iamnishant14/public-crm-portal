import AdminShell from '../../components/shell/AdminShell'

export default function FormStudioPage() {
  return (
    <AdminShell title="Form Studio">
      <div className="card">
        <h3>Form Designer</h3>
        <p>Placeholder for form designer UI. Plans to include:</p>
        <ul>
          <li>Field catalog and schema-based form builder</li>
          <li>Form validation rules</li>
          <li>Conditional logic</li>
          <li>Field dependencies</li>
        </ul>
      </div>
      <div className="card">
        <h3>Form Templates</h3>
        <p>No form templates created yet.</p>
      </div>
    </AdminShell>
  )
}
