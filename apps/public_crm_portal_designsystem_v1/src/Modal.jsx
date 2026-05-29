import React from 'react'
import tokens from '../tokens.json'

export default function Modal({ isOpen, title, children, onClose, actions }) {
  if (!isOpen) return null

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: tokens.color.background,
            borderRadius: tokens.radius.md,
            padding: tokens.spacing.lg,
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 25px rgba(0,0,0,0.15)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <h2 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: tokens.color.text }}>
              {title}
            </h2>
          )}
          {children}
          {actions && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px', justifyContent: 'flex-end' }}>
              {actions}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
