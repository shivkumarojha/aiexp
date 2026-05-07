import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {BrowserRouter, Routes, Route} from "react-router"
import { Dashboard } from './components/Dashboard.tsx'
import { Signin } from './components/Signin.tsx'
import { Signup } from './components/Signup.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Signin />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/dashboard' element={<App />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
