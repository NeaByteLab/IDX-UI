import React from 'react'
import type { JSX } from 'react'

export function PlaceholderPanel({
  icon: Icon,
  title,
  description,
  spin = false,
  className = ''
}: {
  icon: React.ComponentType<{ size?: number }>
  title: string
  description: string
  spin?: boolean
  className?: string
}): JSX.Element {
  const baseClass = 'placeholder-panel'
  const fullClass = [baseClass, spin ? 'animate-spin-slow' : '', className].filter(Boolean).join(
    ' '
  )
  return (
    <div className={fullClass}>
      <span className='placeholder-panel-icon'>
        <Icon size={48} aria-hidden />
      </span>
      <h3 className='placeholder-panel-title'>{title}</h3>
      <p className='placeholder-panel-desc'>{description}</p>
    </div>
  )
}
