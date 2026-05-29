import React, { useState } from 'react'
import Stepper from './Stepper'

export default { title: 'Stepper', component: Stepper }

export const Default = () => {
  const [active, setActive] = useState(0)
  return (
    <Stepper
      steps={['Step 1', 'Step 2', 'Step 3', 'Step 4']}
      activeStep={active}
      onChange={setActive}
    />
  )
}
