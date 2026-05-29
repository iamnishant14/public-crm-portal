import React from 'react'
import tokens from '../tokens.json'

export default function Button({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: tokens.color.accent,
      color: '#fff',
      border: 'none',
      padding: '8px 12px',
      borderRadius: tokens.radius.md,
      cursor: 'pointer'
    }}>{children}</button>
  )
}
