import React, { useState } from 'react';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function LoginAdmin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const exito = login(password);
    
    if (exito) {
      navigate('/admin'); // Si es correcta, entra al panel
    } else {
      setError('Contraseña incorrecta. Acceso denegado.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-vivero-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-vivero-green/20 text-center">
        <div className="bg-vivero-dark w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md text-vivero-yellow">
          <ShieldCheck className="w-8 h-8" />
        </div>
        
        <h2 className="text-3xl font-bold text-vivero-dark font-serif mb-2">Acceso Restringido</h2>
        <p className="text-vivero-dark/60 mb-8">Panel de administración del Vivero Pensamiento</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-vivero-dark/40 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Contraseña maestra"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-vivero-purple outline-none transition-shadow"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button type="submit" className="w-full bg-vivero-purple text-white font-bold py-4 rounded-xl hover:bg-opacity-90 transition-colors flex justify-center items-center shadow-lg">
            Ingresar al Panel <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        </form>

        <div className="mt-8">
          <Link to="/" className="text-sm text-vivero-dark/50 hover:text-vivero-green transition-colors">
            ← Volver a la tienda pública
          </Link>
        </div>
      </div>
    </div>
  );
}