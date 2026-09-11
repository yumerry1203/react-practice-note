import { Navigate, Route, Routes } from 'react-router-dom'
import { List } from './components/List'
import { StatusDisplayPage } from './pages/StatusDisplayPage'
import { UserProfilePage } from './pages/UserProfilePage'
import { CustomButtonPage } from './pages/CustomButtonPage'
import { InputFieldPage } from './pages/InputFieldPage'
import { DataListPage } from './pages/DataListPage'
import { TaxCalculatorPage } from './pages/TaxCalculatorPage'
import { ZustandCounterPage } from './pages/ZustandCounterPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<List />} />
      <Route path="/status-display" element={<StatusDisplayPage />} />
      <Route path="/user-profile" element={<UserProfilePage />} />
      <Route path="/custom-button" element={<CustomButtonPage />} />
      <Route path="/input-field" element={<InputFieldPage />} />
      <Route path="/data-list" element={<DataListPage />} />
      <Route path="/tax-calculator" element={<TaxCalculatorPage />} />
      <Route path="/zustand-counter" element={<ZustandCounterPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
