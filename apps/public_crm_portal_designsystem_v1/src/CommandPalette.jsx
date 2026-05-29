import React, { useState, useEffect } from 'react'

export default function CommandPalette({ commands = [] }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [filtered, setFiltered] = useState(commands)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    const q = query.toLowerCase()
    setFiltered(commands.filter(c => c.name.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)))
  }, [query, commands])

  if (!open) return null

  return (
    <div style={{ position: 'fixed', top: '10%', left: '50%', transform: 'translateX(-50%)', width: '600px', zIndex: 1000 }}>
      <div style={{ background: 'white', borderRadius: 8, padding: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.15)' }}>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type a command or press Esc to close"
          style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 6, border: '1px solid #e5e7eb' }}
          onKeyDown={(e) => { if (e.key === 'Escape') setOpen(false) }}
        />
        <div style={{ maxHeight: 300, overflow: 'auto', marginTop: 8 }}>
          {filtered.map((c, idx) => (
            <div key={idx} style={{ padding: '8px 10px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }} onClick={() => { c.action(); setOpen(false) }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{c.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
