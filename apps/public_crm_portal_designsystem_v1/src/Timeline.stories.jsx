import React from 'react'
import Timeline from './Timeline'

export default { title: 'Timeline', component: Timeline }

export const Default = () => (
  <Timeline items={[{ title: 'v42 published', when: '1 day ago', detail: 'Permissions update' }, { title: 'Role updated', when: '2 hours ago' }]} />
)
