import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './stylesheet/index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Login from './Login.jsx'
import Dashboard from './Dashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
