import React from 'react'
import Card from './Card'

export default { title: 'Card', component: Card }

export const Default = () => (
  <Card title="Example Card">
    <p>This is a card component with title and children content.</p>
  </Card>
)

export const NoTitle = () => (
  <Card>
    <p>Card without title.</p>
  </Card>
)
