import React, { type JSX } from 'react'
import { Link } from 'react-router-dom'

export function BadRequest(): JSX.Element {
  return (
    <React.Fragment>
      <section className="error-page" aria-label="Error">
        <div className="error-page-inner">
          <p className="error-page-code" aria-hidden="true">
            400
          </p>
          <h1 className="error-page-title">Bad Request</h1>
          <p className="error-page-message">Invalid request. Please check the URL or go back.</p>
          <div className="error-page-actions">
            <Link to="/" className="error-page-link">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </React.Fragment>
  )
}
