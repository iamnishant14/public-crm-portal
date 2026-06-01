import React from 'react'
import Table from './Table'

export default { title: 'Table', component: Table }

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' }
]

const data = [
  { name: 'Alice Johnson', role: 'OrgAdmin', status: 'Active' },
  { name: 'Bob Smith', role: 'WorkflowManager', status: 'Active' },
  { name: 'Carol White', role: 'ViewerAuditor', status: 'Inactive' }
]

export const Default = () => <Table columns={columns} data={data} />
