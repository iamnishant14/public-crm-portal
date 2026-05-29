import AdminShell from '../../components/shell/AdminShell'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import FormBuilder from '../../components/pages/FormBuilder'

export default function FormStudioPage() {
  return (
    <ProtectedRoute>
      <AdminShell title="Form Studio">
        <div className="card">
          <h3>Schema-Based Form Designer</h3>
          <p>Drag fields from the palette, configure properties, and export as JSON schema</p>
          <FormBuilder />
        </div>
      </AdminShell>
    </ProtectedRoute>
  )
}
