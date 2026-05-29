import React from 'react'
import tokens from '../tokens.json'

export default function TextField({ label, error, ...props }) {
  return (
    <div style={{ marginBottom: tokens.spacing.md }}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: '6px',
          fontSize: '14px',
          fontWeight: 500,
          color: tokens.color.text
        }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%',
          padding: '8px 12px',
          fontSize: '14px',
          border: `1px solid ${error ? '#dc2626' : tokens.color.border || '#e5e7eb'}`,
          borderRadius: tokens.radius.md,
          fontFamily: 'inherit',
          boxSizing: 'border-box'
        }}
        {...props}
      />
      {error && (
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#dc2626' }}>
          {error}
        </p>
      )}
    </div>
  )
}
