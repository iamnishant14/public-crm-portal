import React from 'react'
import tokens from '../tokens.json'

export default function Stepper({ steps, activeStep, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <button
            onClick={() => onChange(idx)}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              background: idx <= activeStep ? tokens.color.accent : '#e5e7eb',
              color: idx <= activeStep ? 'white' : tokens.color.text,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px'
            }}
            title={step}
          >
            {idx + 1}
          </button>
          {idx < steps.length - 1 && (
            <div
              style={{
                width: '20px',
                height: '2px',
                background: idx < activeStep ? tokens.color.accent : '#e5e7eb',
                margin: '0 4px'
              }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}
