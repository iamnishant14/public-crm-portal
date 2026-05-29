import React from 'react'
import tokens from '../tokens.json'

export default function Table({ columns, data }) {
  return (
    <table style={{
      width: '100%',
      borderCollapse: 'collapse',
      fontSize: '14px'
    }}>
      <thead>
        <tr>
          {columns.map(col => (
            <th
              key={col.key}
              style={{
                textAlign: 'left',
                padding: '12px',
                background: '#f9fafb',
                borderBottom: `1px solid ${tokens.color.border || '#e5e7eb'}`,
                fontWeight: 600,
                color: tokens.color.text
              }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, idx) => (
          <tr key={idx}>
            {columns.map(col => (
              <td
                key={col.key}
                style={{
                  padding: '12px',
                  borderBottom: `1px solid ${tokens.color.border || '#e5e7eb'}`
                }}
              >
                {row[col.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
