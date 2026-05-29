export default function Layout({ children }) {
  return (
    <div className="app-shell">
      <header className="app-header">Public CRM Portal — Admin</header>
      <main className="app-main">{children}</main>
    </div>
  )
}
