// src/components/UserTable.tsx
import { useState} from 'react'

type User = {
  id: number
  name: string
  email: string
  phone: string
  website: string
}

type SortOrder = 'asc' | 'desc' | null

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: User[] = await response.json()
      setUsers(data)
      setSortOrder(null) // Сброс сортировки при загрузке новых данных
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка')
    } finally {
      setLoading(false)
    }
  }

  // Сортировка пользователей
  const sortedUsers = [...users]
  if (sortOrder === 'asc') {
    sortedUsers.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortOrder === 'desc') {
    sortedUsers.sort((a, b) => b.name.localeCompare(a.name))
  }

  const handleSortByName = () => {
    if (sortOrder === null) {
      setSortOrder('asc')
    } else if (sortOrder === 'asc') {
      setSortOrder('desc')
    } else {
      setSortOrder(null)
    }
  }

  // Функция для получения символа стрелки
  const getSortArrow = () => {
    if (sortOrder === 'asc') return ' ↑'
    if (sortOrder === 'desc') return ' ↓'
    return ''
  }

  return (
    <div className="user-table-container">
      <button onClick={fetchUsers} disabled={loading}>
        {loading ? 'Загрузка...' : 'Загрузить пользователей'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {sortedUsers.length > 0 && (
        <table
          border={1}
          style={{ marginTop: '20px', borderCollapse: 'collapse', width: '100%' }}
        >
          <thead>
            <tr>
              <th 
                onClick={handleSortByName}
                style={{ 
                  cursor: 'pointer',
                  backgroundColor: sortOrder ? '#f0f0f0' : 'transparent'
                }}
              >
                Имя{getSortArrow()}
              </th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Сайт</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <a 
                    href={`http://${user.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {user.website}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}