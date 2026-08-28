import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import CatalogoInterior from './CatalogoInterior.jsx'
import CatalogoFrutales from './CatalogoFrutales.jsx'
import CatalogoExterior from './CatalogoExterior.jsx'
import { CartProvider } from './CartContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/interior" element={<CatalogoInterior />} />
          <Route path="/frutales" element={<CatalogoFrutales />} />
          <Route path="/exterior" element={<CatalogoExterior />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </StrictMode>,
)