import React, { type JSX } from 'react'
import { Link } from 'react-router-dom'

export function ServerError(): JSX.Element {
  return (
    <React.Fragment>
      <section className='error-page' aria-label='Error'>
        <div className='error-page-inner'>
          <p className='error-page-code' aria-hidden='true'>
            500
          </p>
          <h1 className='error-page-title'>Something went wrong</h1>
          <p className='error-page-message'>Something went wrong. Please try again or head home.</p>
          <div className='error-page-actions'>
            <Link to='/' className='error-page-link'>
              Back to Home
            </Link>
            <button
              type='button'
              className='error-page-btn'
              onClick={() => globalThis.location.reload()}
            >
              Try again
            </button>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}
