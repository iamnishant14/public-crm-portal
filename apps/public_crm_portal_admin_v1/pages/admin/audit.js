import AdminShell from '../../components/shell/AdminShell'
import { ProtectedRoute } from '../../components/ProtectedRoute'
import AuditLogs from '../../components/pages/AuditLogs'

export default function AuditPage() {
  return (
    <ProtectedRoute>
      <AdminShell title="Audit">
        <AuditLogs />
      </AdminShell>
    </ProtectedRoute>
  )
}
