import { useRouter } from 'next/router'
import Link from 'next/link'
import styles from './AdminShell.module.css'

export default function AdminShell({ children, title }) {
  const router = useRouter()
  
  const sidebarItems = [
    { label: 'Dashboard', href: '/admin/dashboard' },
    { label: 'Organization', href: '/admin/organization' },
    { label: 'Access Control', href: '/admin/access-control' },
    { label: 'Process Studio', href: '/admin/process-studio' },
    { label: 'Form Studio', href: '/admin/form-studio' },
    { label: 'Communications', href: '/admin/communications' },
    { label: 'Integrations', href: '/admin/integrations' },
    { label: 'Releases', href: '/admin/releases' },
    { label: 'Audit', href: '/admin/audit' }
  ]

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <h1>CRM Admin Console</h1>
      </header>
      <div className={styles.container}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            {sidebarItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={router.pathname === item.href ? styles.active : ''}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className={styles.main}>
          {title && <h2 className={styles.pageTitle}>{title}</h2>}
          {children}
        </main>
      </div>
    </div>
  )
}
