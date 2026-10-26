import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, MessageCircle } from 'lucide-react';

// Footer reutilizable (mismo diseño que el de App.jsx) para las páginas fuera del inicio.
// Al hacer clic en un enlace, regresa al inicio y baja a la sección indicada.
export default function Footer() {
  const navigate = useNavigate();

  const irA = (e, seccion = null) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      const elemento = seccion && document.getElementById(seccion);
      if (elemento) {
        elemento.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  const enlace = 'hover:text-vivero-yellow transition-colors';

  return (
    <footer className="bg-vivero-dark text-vivero-cream pt-16 pb-8 border-t-8 border-vivero-purple">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="bg-white inline-block p-2 rounded-xl mb-6">
              <img src="/logo.png" alt="Logo Vivero" className="h-16 w-auto cursor-pointer" onClick={(e) => irA(e)} />
            </div>
            <p className="text-vivero-cream/70 text-sm leading-relaxed mb-6">
              Cultivando vida, embelleciendo el mundo. Especialistas en plantas ornamentales y árboles frutales.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold font-serif mb-6 text-white">Explorar</h3>
            <ul className="space-y-4 text-vivero-cream/80">
              <li><a href="/" onClick={(e) => irA(e)} className={enlace}>Inicio</a></li>
              <li><a href="/#categorias" onClick={(e) => irA(e, 'categorias')} className={enlace}>Catálogo de Plantas</a></li>
              <li><a href="/#nosotros" onClick={(e) => irA(e, 'nosotros')} className={enlace}>Sobre Nosotros</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold font-serif mb-6 text-white">Servicios</h3>
            <ul className="space-y-4 text-vivero-cream/80">
              <li><a href="/#servicios" onClick={(e) => irA(e, 'servicios')} className={enlace}>Asesoría Técnica</a></li>
              <li><a href="/#servicios" onClick={(e) => irA(e, 'servicios')} className={enlace}>Ventas por Mayor</a></li>
              <li><a href="/#servicios" onClick={(e) => irA(e, 'servicios')} className={enlace}>Diseño de Jardines</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold font-serif mb-6 text-white">Contacto</h3>
            <ul className="space-y-4 text-vivero-cream/80">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-vivero-yellow flex-shrink-0 mt-0.5" />
                <span>Sector Viveros, Chimaltenango, Guatemala</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-vivero-yellow flex-shrink-0" />
                <span>+502 4450-8589</span>
              </li>
              <li className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-3 text-vivero-yellow flex-shrink-0" />
                <span>Lunes a Sábado: 8am - 5pm</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-vivero-cream/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-vivero-cream/50">
          <p>&copy; {new Date().getFullYear()} Vivero Pensamiento. Todos los derechos reservados.</p>
          <p className="mt-4 md:mt-0">Diseñado con ❤️ en Guatemala</p>
        </div>
      </div>
    </footer>
  );
}