// src/components/UserTable.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, test, beforeEach, expect } from 'vitest'
import UserTable from './UserTable'

// Мокаем fetch
const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('UserTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders button and does not show table initially', () => {
    render(<UserTable />)
    expect(screen.getByText(/загрузить пользователей/i)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  test('loads users and displays them when button is clicked', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Иван Иванов',
        email: 'ivan@example.com',
        phone: '+7 (999) 123-45-67',
        website: 'example.com',
      },
      {
        id: 2,
        name: 'Алексей Петров',
        email: 'alex@example.com',
        phone: '+7 (999) 987-65-43',
        website: 'example2.com',
      },
    ]

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    })

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    // Проверяем загрузку данных
    expect(await screen.findByRole('table')).toBeInTheDocument()
    expect(screen.getByText(/иван иванов/i)).toBeInTheDocument()
    expect(screen.getByText(/ivan@example.com/i)).toBeInTheDocument()
    expect(screen.getByText(/алексей петров/i)).toBeInTheDocument()
  })

  test('shows error when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('Network error'))

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    // Текст ошибки должен соответствовать тому, что выводит компонент
    expect(await screen.findByText(/network error/i)).toBeInTheDocument()
  })

  test('shows loading state', async () => {
    // Мокаем долгий ответ
    const mockUsers = [{ 
      id: 1, 
      name: 'Тестовый Пользователь', // Уникальное имя
      email: 'test@example.com', 
      phone: '+7 (999) 111-22-33', 
      website: 'test-site.com' 
    }]
    
    mockFetch.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => mockUsers
        }), 100)
      )
    )

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    // Проверяем состояние загрузки сразу после клика
    expect(screen.getByText(/загрузка.../i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()

    // Ждем окончания загрузки
    await screen.findByText(/тестовый пользователь/i)
    
    // Проверяем что загрузка завершилась
    expect(screen.queryByText(/загрузка.../i)).not.toBeInTheDocument()
    expect(screen.getByRole('button')).toBeEnabled()
  })

  test('shows error when HTTP response is not ok', async () => {
    // Мокаем неудачный ответ HTTP
    const mockResponse = {
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => ({})
    }

    mockFetch.mockResolvedValue(mockResponse)

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    // Компонент должен показать сообщение об ошибке
    expect(await screen.findByText(/http error! status: 500/i)).toBeInTheDocument()
  })
})

// Тесты для сортировки (добавьте их если реализовали сортировку)
describe('UserTable Sorting', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('sorts users by name in ascending order', async () => {
    const mockUsers = [
      {
        id: 1,
        name: 'Борис Иванов',
        email: 'boris@example.com',
        phone: '111',
        website: 'boris.com',
      },
      {
        id: 2,
        name: 'Алексей Петров',
        email: 'alex@example.com',
        phone: '222',
        website: 'alex.com',
      },
      {
        id: 3,
        name: 'Виктор Сидоров',
        email: 'viktor@example.com',
        phone: '333',
        website: 'viktor.com',
      },
    ]

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockUsers,
    })

    render(<UserTable />)
    fireEvent.click(screen.getByText(/загрузить пользователей/i))

    // Ждем загрузки
    await screen.findByRole('table')

    // Кликаем на заголовок "Имя" для сортировки по возрастанию
    fireEvent.click(screen.getByText('Имя'))

    // Проверяем сортировку
    await waitFor(() => {
      const rows = screen.getAllByRole('row')
      // Пропускаем заголовок таблицы (первая строка)
      const dataRows = rows.slice(1)
      
      // Проверяем порядок имен
      const names = dataRows.map(row => 
        row.querySelector('td:first-child')?.textContent
      )
      
      expect(names[0]).toBe('Алексей Петров')
      expect(names[1]).toBe('Борис Иванов')
      expect(names[2]).toBe('Виктор Сидоров')
    })
  })
})