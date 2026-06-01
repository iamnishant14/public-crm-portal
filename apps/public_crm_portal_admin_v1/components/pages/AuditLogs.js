import React, { useState, useEffect } from 'react'
import { formatApiError, useApi } from '../../hooks/useApi'
import { useAuth } from '../../context/AuthContext'
import styles from './AuditLogs.module.css'

export default function AuditLogs() {
  const { hasPermission } = useAuth()
  const { get } = useApi('/audit/logs')
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ action: '', userId: '' })

  useEffect(() => {
    loadLogs()
  }, [])

  const loadLogs = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await get()
      setLogs(data.logs || [])
    } catch (e) {
      setError(formatApiError(e))
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({ ...prev, [name]: value }))
  }

  const applyFilters = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await get(filters)
      setLogs(data.logs || [])
    } catch (e) {
      setError(formatApiError(e))
    } finally {
      setLoading(false)
    }
  }

  const canRead = hasPermission('read')
  return (
    <div className={styles.container}>
      <h1>Audit Logs</h1>

      {!canRead && (
        <div className={styles.error}>
          You do not have permission to view audit logs.
        </div>
      )}

      {canRead && (
        <>
          <div className={styles.filters}>
            <input
              type="text"
              name="action"
              placeholder="Filter by action (e.g., login, create, delete)"
              value={filters.action}
              onChange={handleFilterChange}
              className={styles.input}
            />
            <input
              type="text"
              name="userId"
              placeholder="Filter by user ID"
              value={filters.userId}
              onChange={handleFilterChange}
              className={styles.input}
            />
            <button className={styles.btn} onClick={applyFilters}>
              Apply Filters
            </button>
            <button className={styles.btnSecondary} onClick={loadLogs}>
              Refresh
            </button>
          </div>

          {error && <div className={styles.error}>Error: {error}</div>}
          {loading && <div className={styles.loading}>Loading logs...</div>}

          {!loading && logs.length === 0 && (
            <div className={styles.empty}>No audit logs found.</div>
          )}

          {!loading && logs.length > 0 && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>User</th>
                  <th>Timestamp</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td><span className={styles.badge}>{log.action}</span></td>
                    <td>{log.resource}</td>
                    <td>{log.userId}</td>
                    <td>{new Date(log.timestamp).toLocaleString()}</td>
                    <td>{JSON.stringify(log.details).substring(0, 50)}...</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  )
}
