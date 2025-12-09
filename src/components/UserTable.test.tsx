// UserTable.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, test, beforeEach, expect } from 'vitest'
import UserTable from './UserTable'

const mockFetch = vi.fn()
globalThis.fetch = mockFetch

describe('UserTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders button and does not show table initially', () => {
    render(<UserTable />)
    expect(screen.getByText(/загрузить пользователей/i)).toBeInTheDocument()
    expect(screen.queryByText(/иван/i)).not.toBeInTheDocument()
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
        name: 'Петр Петров',
        email: 'petr@example.com',
        phone: '+7 (999) 987-65-43',
        website: 'example2.com',
      },
    ]

    // Правильный мок Response
    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => mockUsers,
    }

    mockFetch.mockResolvedValueOnce(mockResponse)

    render(<UserTable />)
    
    // Нажимаем кнопку
    fireEvent.click(screen.getByText(/загрузить пользователей/i))
    
    // Проверяем, что fetch вызван с правильным URL
    expect(mockFetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users')
    
    // Ждем загрузки данных
    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument()
    })
    
    // Проверяем данные в таблице
    expect(screen.getByText(/иван иванов/i)).toBeInTheDocument()
    expect(screen.getByText(/ivan@example.com/i)).toBeInTheDocument()
    expect(screen.getByText(/петр петров/i)).toBeInTheDocument()
    expect(screen.getByText(/petr@example.com/i)).toBeInTheDocument()
    
    // Проверяем структуру таблицы
    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(3) // 1 заголовок + 2 строки данных
  })

  test('shows "Failed to fetch" error when fetch fails', async () => {
    // Мокаем ошибку
    mockFetch.mockRejectedValueOnce(new Error('Failed to fetch'))

    render(<UserTable />)
    
    // Нажимаем кнопку
    fireEvent.click(screen.getByText(/загрузить пользователей/i))
    
    // Ждем появления ошибки
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument()
    })
    
    // Проверяем, что таблица не отображается
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  test('shows custom error when response is not ok', async () => {
    // Мокаем неуспешный ответ (status не 200)
    const mockResponse = {
      ok: false,
      status: 404,
      statusText: 'Not Found',
      json: async () => ({ message: 'Not found' }),
    }

    mockFetch.mockResolvedValueOnce(mockResponse)

    render(<UserTable />)
    
    fireEvent.click(screen.getByText(/загрузить пользователей/i))
    
    // В этом случае компонент выбросит Error('Failed to fetch')
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch/i)).toBeInTheDocument()
    })
  })

  test('shows loading state', async () => {
    // Мокаем долгий ответ
    const mockResponse = {
      ok: true,
      json: async () => [{ id: 1, name: 'Test' }],
    }

    mockFetch.mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve(mockResponse), 100))
    )

    render(<UserTable />)
    
    // Нажимаем кнопку
    fireEvent.click(screen.getByText(/загрузить пользователей/i))
    
    // Проверяем состояние загрузки
    expect(screen.getByText(/загрузка.../i)).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
    
    // Ждем завершения загрузки
    await waitFor(() => {
      expect(screen.queryByText(/загрузка.../i)).not.toBeInTheDocument()
    })
    
    expect(screen.getByRole('button')).toBeEnabled()
  })
})