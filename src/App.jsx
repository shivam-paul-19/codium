import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FormPage from './formPage'
import './Form.css' // Ensure styles are available if needed globally, though FormPage imports it too.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
