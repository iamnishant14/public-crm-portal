import React, { useState } from 'react'
import { formatApiError, useApi } from '../../hooks/useApi'
import { useAuth } from '../../context/AuthContext'
import styles from './ConfigPublish.module.css'

export default function ConfigPublish() {
  const { hasPermission } = useAuth()
  const previewApi = useApi('/config/preview')
  const publishApi = useApi('/config/publish')
  const [configId, setConfigId] = useState('cfg_1')
  const [configData, setConfigData] = useState(JSON.stringify({ name: 'System Config', version: 1 }, null, 2))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [preview, setPreview] = useState(null)
  const [published, setPublished] = useState(null)

  const handlePreview = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = JSON.parse(configData)
      const result = await previewApi.post({ configId, changeData: data })
      setPreview(result)
    } catch (e) {
      setError(formatApiError(e))
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async () => {
    if (!preview) {
      setError('Please preview changes first')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = JSON.parse(configData)
      const result = await publishApi.post({ configId, configData: data })
      setPublished(result)
      setPreview(null)
    } catch (e) {
      setError(formatApiError(e))
    } finally {
      setLoading(false)
    }
  }

  const canPublish = hasPermission('publish')

  return (
    <div className={styles.container}>
      <h1>Config Publish Workflow</h1>

      {!canPublish && (
        <div className={styles.error}>
          You do not have permission to publish configurations.
        </div>
      )}

      {canPublish && (
        <>
          <div className={styles.section}>
            <h3>Step 1: Edit Config</h3>
            <label className={styles.label} htmlFor="configId">Config ID</label>
            <input
              id="configId"
              type="text"
              value={configId}
              onChange={(e) => setConfigId(e.target.value)}
              className={styles.input}
            />

            <label className={styles.label} htmlFor="configData">Config Data (JSON)</label>
            <textarea
              id="configData"
              value={configData}
              onChange={(e) => setConfigData(e.target.value)}
              className={styles.textarea}
              rows={8}
              placeholder={'{\n  "name": "Config",\n  "settings": {}\n}'}
            />

            <button
              className={styles.btn}
              onClick={handlePreview}
              disabled={loading}
            >
              {loading ? 'Previewing...' : 'Preview'}
            </button>
          </div>

          {error && <div className={styles.error}>Error: {error}</div>}

          {preview && (
            <div className={styles.section}>
              <h3>Step 2: Review Risk Analysis</h3>
              <div className={styles.riskCard}>
                <p className={styles.riskLabel}>Risk Score</p>
                <p className={styles.riskValue}>{preview.riskScore}%</p>
                <p className={styles.riskMessage}>{preview.message}</p>
                {preview.riskScore > 75 && (
                  <p className={styles.warning}>High risk - requires approval</p>
                )}
                {preview.riskScore > 50 && preview.riskScore <= 75 && (
                  <p className={styles.caution}>Medium risk - proceed with care</p>
                )}
                {preview.riskScore <= 50 && (
                  <p className={styles.safe}>Low risk - safe to proceed</p>
                )}
              </div>

              <button
                className={styles.btn}
                onClick={handlePublish}
                disabled={loading}
              >
                {loading ? 'Publishing...' : 'Publish'}
              </button>
              <button
                className={styles.btnSecondary}
                onClick={() => setPreview(null)}
              >
                Cancel
              </button>
            </div>
          )}

          {published && (
            <div className={styles.section}>
              <h3>Step 3: Published</h3>
              <div className={styles.successCard}>
                <p><strong>Config ID:</strong> {published.id}</p>
                <p><strong>Name:</strong> {published.name}</p>
                <p><strong>Version:</strong> {published.version}</p>
                <p><strong>Published At:</strong> {new Date(published.publishedAt).toLocaleString()}</p>
                <p><strong>Published By:</strong> {published.publishedBy}</p>
              </div>
              <button
                className={styles.btn}
                onClick={() => {
                  setPublished(null)
                  setConfigData(JSON.stringify({ name: 'System Config', version: 1 }, null, 2))
                }}
              >
                Publish Another
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
