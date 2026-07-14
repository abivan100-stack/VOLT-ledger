import { Route, Routes } from 'react-router-dom'
import VoltPage from './pages/VoltPage'
import LedgerPage from './pages/LedgerPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<VoltPage />} />
      <Route path="/ledger" element={<LedgerPage />} />
    </Routes>
  )
}

export default App
