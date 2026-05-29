import React, { useState } from 'react'
import styles from './FormBuilder.module.css'

const FIELD_TYPES = [
  { type: 'text', label: 'Text Input', icon: '📝' },
  { type: 'email', label: 'Email', icon: '📧' },
  { type: 'phone', label: 'Phone', icon: '☎️' },
  { type: 'select', label: 'Dropdown', icon: '▼' },
  { type: 'checkbox', label: 'Checkbox', icon: '☑️' },
  { type: 'textarea', label: 'Text Area', icon: '📄' },
  { type: 'date', label: 'Date', icon: '📅' }
]

export default function FormBuilder() {
  const [formFields, setFormFields] = useState([
    { id: 1, name: 'full_name', label: 'Full Name', type: 'text', required: true }
  ])
  const [selectedField, setSelectedField] = useState(null)
  const [nextId, setNextId] = useState(2)

  const addField = (fieldType) => {
    const newField = {
      id: nextId,
      name: `field_${nextId}`,
      label: fieldType.label,
      type: fieldType.type,
      required: false,
      options: fieldType.type === 'select' ? ['Option 1', 'Option 2'] : undefined
    }
    setFormFields([...formFields, newField])
    setNextId(nextId + 1)
  }

  const updateField = (id, updates) => {
    setFormFields(
      formFields.map(f => f.id === id ? { ...f, ...updates } : f)
    )
  }

  const deleteField = (id) => {
    setFormFields(formFields.filter(f => f.id !== id))
    if (selectedField?.id === id) setSelectedField(null)
  }

  const moveField = (id, direction) => {
    const idx = formFields.findIndex(f => f.id === id)
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === formFields.length - 1)) return
    
    const newFields = [...formFields]
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1
    [newFields[idx], newFields[swapIdx]] = [newFields[swapIdx], newFields[idx]]
    setFormFields(newFields)
  }

  const exportSchema = () => {
    const schema = {
      version: '1.0.0',
      name: 'Form Schema',
      fields: formFields.map(({ id, ...field }) => field)
    }
    const json = JSON.stringify(schema, null, 2)
    navigator.clipboard.writeText(json)
    alert('Schema copied to clipboard!')
  }

  return (
    <div className={styles.formBuilder}>
      <div className={styles.canvas}>
        <h3>Form Canvas</h3>
        <div className={styles.formPreview}>
          {formFields.length === 0 ? (
            <p className={styles.emptyState}>Add fields from the palette to start</p>
          ) : (
            <form className={styles.form}>
              {formFields.map(field => (
                <div
                  key={field.id}
                  className={`${styles.formField} ${selectedField?.id === field.id ? styles.selected : ''}`}
                  onClick={() => setSelectedField(field)}
                >
                  <label>{field.label} {field.required && <span className={styles.required}>*</span>}</label>
                  {field.type === 'select' ? (
                    <select disabled><option>Select...</option></select>
                  ) : field.type === 'textarea' ? (
                    <textarea disabled rows="3" />
                  ) : field.type === 'checkbox' ? (
                    <input type="checkbox" disabled />
                  ) : (
                    <input type={field.type} disabled placeholder={field.label} />
                  )}
                </div>
              ))}
            </form>
          )}
        </div>
      </div>

      <div className={styles.sidebar}>
        <div className={styles.palette}>
          <h4>Field Palette</h4>
          <div className={styles.fieldTypes}>
            {FIELD_TYPES.map(ft => (
              <button
                key={ft.type}
                className={styles.fieldTypeBtn}
                onClick={() => addField(ft)}
                title={ft.label}
              >
                {ft.icon} {ft.label}
              </button>
            ))}
          </div>
        </div>

        {selectedField && (
          <div className={styles.properties}>
            <h4>Field Properties</h4>
            <div className={styles.propGroup}>
              <label>Field Name</label>
              <input
                type="text"
                value={selectedField.name}
                onChange={(e) => updateField(selectedField.id, { name: e.target.value })}
              />
            </div>
            <div className={styles.propGroup}>
              <label>Label</label>
              <input
                type="text"
                value={selectedField.label}
                onChange={(e) => updateField(selectedField.id, { label: e.target.value })}
              />
            </div>
            <div className={styles.propGroup}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedField.required}
                  onChange={(e) => updateField(selectedField.id, { required: e.target.checked })}
                />
                Required
              </label>
            </div>

            {selectedField.type === 'select' && (
              <div className={styles.propGroup}>
                <label>Options (one per line)</label>
                <textarea
                  value={selectedField.options?.join('\n') || ''}
                  onChange={(e) => updateField(selectedField.id, { options: e.target.value.split('\n').filter(Boolean) })}
                  rows="4"
                />
              </div>
            )}

            <div className={styles.fieldActions}>
              <button onClick={() => moveField(selectedField.id, 'up')}>↑ Move Up</button>
              <button onClick={() => moveField(selectedField.id, 'down')}>↓ Move Down</button>
              <button className={styles.deleteBtn} onClick={() => deleteField(selectedField.id)}>
                🗑 Delete
              </button>
            </div>
          </div>
        )}

        <button className={styles.exportBtn} onClick={exportSchema}>
          📥 Export Schema
        </button>
      </div>
    </div>
  )
}
