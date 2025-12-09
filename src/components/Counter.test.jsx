import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Counter from './Counter' 

describe('Counter Component', () => {
  it('renders correctly', () => {
    render(<Counter />)
    expect(screen.getByText(/count is 0/i)).toBeInTheDocument()
  })

  it('increments count on click', () => {
    render(<Counter />)
    const button = screen.getByRole('button')
    
    fireEvent.click(button)
    expect(button).toHaveTextContent('count is 1')
  })
})