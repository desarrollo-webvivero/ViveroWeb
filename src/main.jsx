import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.jsx'
import CatalogoInterior from './CatalogoInterior.jsx'
import CatalogoFrutales from './CatalogoFrutales.jsx'
import CatalogoExterior from './CatalogoExterior.jsx'
import AdminPanel from './AdminPanel.jsx'
import LoginAdmin from './LoginAdmin.jsx'
import { CartProvider } from './CartContext.jsx'
import { AuthProvider, RutaProtegida } from './AuthContext.jsx'
import './index.css'
import PagoContraEntrega from './PagoContraEntrega';
import DashboardAdmin from './DashboardAdmin';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Rutas Públicas */}
            <Route path="/" element={<App />} />
            <Route path="/interior" element={<CatalogoInterior />} />
            <Route path="/frutales" element={<CatalogoFrutales />} />
            <Route path="/exterior" element={<CatalogoExterior />} />
            <Route path="/login" element={<LoginAdmin />} />
            <Route path="/pago-contra-entrega" element={<PagoContraEntrega />} />   
           
            {/* Ruta Protegida (Privada) */}
            <Route path="/admin" element={
              <RutaProtegida>
                <AdminPanel />
              </RutaProtegida>
            } />
            <Route path="/dashboard" element={
              <RutaProtegida>
              <DashboardAdmin />
              </RutaProtegida>
            } />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </StrictMode>,
)