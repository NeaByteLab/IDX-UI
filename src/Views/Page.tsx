import React, { type JSX } from 'react'
import { Link } from 'react-router-dom'

export function Page(): JSX.Element {
  return (
    <React.Fragment>
      <main className='app-main' aria-label='Main content'>
        <h1>IDX UI</h1>
        <p>
          One page with app CSS. Error pages: <Link to='/400'>400</Link>,{' '}
          <Link to='/500'>500</Link>.
        </p>
      </main>
    </React.Fragment>
  )
}
