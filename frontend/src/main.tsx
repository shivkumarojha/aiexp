import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import {BrowserRouter, Routes, Route} from "react-router"
import { Signin } from './components/Signin'
import { Signup } from './components/Signup'
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
