import React, { useState } from 'react'
import TextField from './TextField'

export default { title: 'TextField', component: TextField }

export const Default = () => <TextField label="Email" type="email" placeholder="user@example.com" />

export const WithError = () => (
  <TextField label="Password" type="password" error="Password is required" />
)

export const SearchField = () => {
  const [value, setValue] = useState('')
  return (
    <TextField
      label="Search"
      placeholder="Type to search..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}
