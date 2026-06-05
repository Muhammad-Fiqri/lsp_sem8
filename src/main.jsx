import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './stylesheet/index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import Login from './Login.jsx'
import DashboardLayout from './DashboardLayout.jsx'
import Dashboard from './Dashboard.jsx'
import PersediaanBarang from './PersediaanBarang.jsx';
import MasterData from './MasterData.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/persediaan-barang" element={<PersediaanBarang />} />
          <Route path="/master-data" element={<MasterData/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
