import { Navigate, Route, Routes } from 'react-router-dom'
import { List } from './components/List'
import ArticlePage from './pages/ArticlePage'
import { CategoryPage } from './pages/CategoryPage'
import { CustomButtonPage } from './pages/CustomButtonPage'
import { DataListPage } from './pages/DataListPage'
import { InputFieldPage } from './pages/InputFieldPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { StatusDisplayPage } from './pages/StatusDisplayPage'
import { StudyLogPage } from './pages/StudyLogPage'
import { TaxCalculatorPage } from './pages/TaxCalculatorPage'
import { UserProfilePage } from './pages/UserProfilePage'
import { UtilityTypesPage } from './pages/UtilityTypesPage'
import { ZustandCounterPage } from './pages/ZustandCounterPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<List />} />
      <Route path="/study-log" element={<StudyLogPage />} />
      <Route path="/category/projects" element={<ProjectsPage />} />
      <Route path="/:category/:project/:slug" element={<ArticlePage />} />
      <Route path="/:category/:slug" element={<ArticlePage />} />
      <Route path="/category/:categorySlug" element={<CategoryPage />} />
      <Route path="/status-display" element={<StatusDisplayPage />} />
      <Route path="/user-profile" element={<UserProfilePage />} />
      <Route path="/custom-button" element={<CustomButtonPage />} />
      <Route path="/input-field" element={<InputFieldPage />} />
      <Route path="/data-list" element={<DataListPage />} />
      <Route path="/tax-calculator" element={<TaxCalculatorPage />} />
      <Route path="/zustand-counter" element={<ZustandCounterPage />} />
      <Route path="/utility-types" element={<UtilityTypesPage />} />
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  )
}

export default App;
