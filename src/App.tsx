import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Counter from './components/Counter.tsx'
import UserTable from './components/UserTable'
import './App.css'

function App() {
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <Counter /> {/* ← Теперь здесь только компонент */}
      <UserTable />
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App