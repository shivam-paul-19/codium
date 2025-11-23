import { BrowserRouter, Routes, Route } from 'react-router-dom'
import FormPage from './formPage'
import CodeEditor from './editor'
import './Form.css' // Ensure styles are available if needed globally, though FormPage imports it too.

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FormPage />} />
        <Route path="/editor" element={<CodeEditor />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
