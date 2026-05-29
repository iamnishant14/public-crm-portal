import React from 'react'
import CommandPalette from './CommandPalette'

export default { title: 'CommandPalette', component: CommandPalette }

export const Default = () => (
  <CommandPalette commands={[{ name: 'Go to Dashboard', description: 'Navigate to main dashboard', action: () => alert('Dashboard') }]} />
)
