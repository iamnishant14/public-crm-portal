import React from 'react'
import tokens from '../tokens.json'

export default function Toast({ message, type = 'info', onClose }) {
  const bgColor = {
    success: '#d1fae5',
    error: '#fee2e2',
    warning: '#fef3c7',
    info: '#dbeafe'
  }[type]

  const borderColor = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6'
  }[type]

  const textColor = {
    success: '#065f46',
    error: '#991b1b',
    warning: '#92400e',
    info: '#1e40af'
  }[type]

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: bgColor,
        border: `2px solid ${borderColor}`,
        color: textColor,
        padding: tokens.spacing.md,
        borderRadius: tokens.radius.md,
        maxWidth: '400px',
        boxShadow: '0 10px 15px rgba(0,0,0,0.1)',
        animation: 'slideIn 0.3s ease-out',
        zIndex: 1000
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: textColor,
            cursor: 'pointer',
            fontSize: '20px',
            marginLeft: '12px'
          }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
