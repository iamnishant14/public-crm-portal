import React, { useState } from 'react'
import Toast from './Toast'

export default { title: 'Toast', component: Toast }

export const Success = () => {
  const [show, setShow] = useState(true)
  return (
    <>
      <button onClick={() => setShow(true)}>Show Toast</button>
      {show && <Toast message="Operation successful!" type="success" onClose={() => setShow(false)} />}
    </>
  )
}

export const Error = () => {
  const [show, setShow] = useState(true)
  return (
    <>
      {show && <Toast message="An error occurred!" type="error" onClose={() => setShow(false)} />}
    </>
  )
}
