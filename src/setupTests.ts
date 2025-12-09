    import '@testing-library/jest-dom'; // Импортируем расширения для expect
    import '@testing-library/jest-dom'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Очищаем DOM после каждого теста
afterEach(() => {
  cleanup()
})