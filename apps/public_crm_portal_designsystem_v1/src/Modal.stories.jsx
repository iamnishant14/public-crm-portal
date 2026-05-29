import React, { useState } from 'react'
import Modal from './Modal'

export default { title: 'Modal', component: Modal }

export const Default = () => {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      <Modal
        isOpen={isOpen}
        title="Example Modal"
        onClose={() => setIsOpen(false)}
        actions={[
          <button key="cancel" onClick={() => setIsOpen(false)}>Cancel</button>,
          <button key="ok" onClick={() => setIsOpen(false)}>OK</button>
        ]}
      >
        <p>This is a modal dialog.</p>
      </Modal>
    </>
  )
}
