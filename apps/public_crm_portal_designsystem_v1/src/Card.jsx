import React from 'react'
import tokens from '../tokens.json'

export default function Card({ children, title }) {
  return (
    <div style={{
      background: tokens.color.background,
      border: `1px solid ${tokens.color.muted}30`,
      borderRadius: tokens.radius.md,
      padding: tokens.spacing.md,
      boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    }}>
      {title && <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600 }}>{title}</h3>}
      {children}
    </div>
  )
}
