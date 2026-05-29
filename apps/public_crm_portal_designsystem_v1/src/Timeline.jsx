import React from 'react'

export default function Timeline({ items = [] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((it, idx) => (
        <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 12, height: 12, borderRadius: 6, background: '#2563eb', marginTop: 6 }} />
          <div>
            <div style={{ fontWeight: 600 }}>{it.title}</div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>{it.when}</div>
            {it.detail && <div style={{ marginTop: 6 }}>{it.detail}</div>}
          </div>
        </div>
      ))}
    </div>
  )
}
