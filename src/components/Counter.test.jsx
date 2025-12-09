// Counter.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Counter from './Counter'

describe('Counter', () => {
  it('increments on click', () => {
    render(<Counter />)
    
    const button = screen.getByRole('button')
    expect(button).toHaveTextContent('count is 0')
    
    fireEvent.click(button)
    expect(button).toHaveTextContent('count is 1')
  })
})