import React, { useState } from 'react';
import { Menu, X, ArrowRight, Truck, Leaf, ShieldCheck, MapPin, Phone, MessageCircle, Globe, Mail } from 'lucide-react';

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="min-h-screen bg-vivero-cream text-vivero-dark font-sans antialiased selection:bg-vivero-green selection:text-white">
      
      {/* BARRA SUPERIOR (TOP BAR) */}
      <div className="bg-vivero-dark text-vivero-cream py-2 px-4 text-xs sm:text-sm font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-2 sm:mb-0">
            <span className="flex items-center"><Truck className="w-4 h-4 mr-2" /> Envíos seguros a toda Guatemala</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><Phone className="w-4 h-4 mr-2" /> +502 4079-4985</span>
            <span className="flex items-center"><MapPin className="w-4 h-4 mr-2" /> Chimaltenango, Guatemala</span>
          </div>
        </div>
      </div>

      {/* NAVEGACIÓN PRINCIPAL */}
      <header className="sticky top-0 z-50 bg-vivero-cream/95 backdrop-blur-md border-b border-vivero-green/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20 sm:h-24">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <img src="/logo.png" alt="Logo Vivero Pensamiento" className="h-16 sm:h-20 w-auto drop-shadow-sm transition-transform hover:scale-105" />
            </div>
            
            {/* Menú Escritorio */}
            <nav className="hidden md:flex items-center space-x-8 font-medium">
              <a href="#inicio" className="text-vivero-dark hover:text-vivero-purple transition-colors">Inicio</a>
              <a href="#categorias" className="text-vivero-dark hover:text-vivero-purple transition-colors">Categorías</a>
              <a href="#nosotros" className="text-vivero-dark hover:text-vivero-purple transition-colors">Nosotros</a>
              <a href="#contacto" className="text-vivero-dark hover:text-vivero-purple transition-colors">Contacto</a>
            </nav>

            {/* Botón WhatsApp Escritorio */}
            <div className="hidden md:flex">
              <a href="#" className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-vivero-purple hover:bg-opacity-90 shadow-md transition-all transform hover:-translate-y-0.5">
                <MessageCircle className="w-5 h-5 mr-2" />
                Cotizar ahora
              </a>
            </div>

            {/* Botón Menú Móvil */}
            <div className="md:hidden flex items-center">
              <button onClick={toggleMenu} className="text-vivero-dark hover:text-vivero-purple focus:outline-none p-2">
                {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* Menú Desplegable Móvil */}
        {isOpen && (
          <div className="md:hidden bg-vivero-cream border-t border-vivero-green/20 px-4 pt-2 pb-6 shadow-xl absolute w-full">
            <div className="flex flex-col space-y-2">
              <a href="#inicio" className="px-4 py-3 rounded-lg text-base font-medium text-vivero-dark hover:bg-vivero-green hover:text-vivero-cream transition-colors">Inicio</a>
              <a href="#categorias" className="px-4 py-3 rounded-lg text-base font-medium text-vivero-dark hover:bg-vivero-green hover:text-vivero-cream transition-colors">Categorías</a>
              <a href="#nosotros" className="px-4 py-3 rounded-lg text-base font-medium text-vivero-dark hover:bg-vivero-green hover:text-vivero-cream transition-colors">Nosotros</a>
              <a href="#" className="mt-4 inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-vivero-purple shadow-md">
                <MessageCircle className="w-5 h-5 mr-2" /> Escríbenos
              </a>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* SECCIÓN HERO (Banner Principal) */}
        <section id="inicio" className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            {/* Imagen de fondo. Puedes cambiarla descargando una y usando src="/hero.jpg" */}
            <img src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?q=80&w=2070&auto=format&fit=crop" alt="Fondo Vivero" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-vivero-dark/90 to-vivero-dark/60 mix-blend-multiply"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left flex flex-col md:items-start items-center">
            <span className="inline-block py-1 px-3 rounded-full bg-vivero-yellow/20 text-vivero-yellow border border-vivero-yellow/30 text-sm font-semibold tracking-wider mb-4 uppercase">
              Calidad y Naturaleza
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-vivero-cream tracking-tight font-serif mb-6 max-w-3xl leading-tight">
              Damos vida a tus <span className="text-vivero-yellow">espacios</span>
            </h1>
            <p className="text-lg sm:text-xl text-vivero-cream/90 max-w-2xl mb-10 font-light leading-relaxed">
              Descubre nuestra colección de plantas ornamentales, árboles nativos y frutales. Cultivamos vida con pasión para transformar tu hogar y jardín.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
              <a href="#categorias" className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-vivero-dark bg-vivero-yellow hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Explorar Catálogo
              </a>
              <a href="#contacto" className="inline-flex justify-center items-center px-8 py-4 border-2 border-vivero-cream text-base font-medium rounded-full text-vivero-cream hover:bg-vivero-cream hover:text-vivero-dark transition-all">
                Contáctanos <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>
        </section>

        {/* SECCIÓN CARACTERÍSTICAS (Por qué elegirnos) */}
        <section className="py-12 bg-white border-b border-vivero-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-vivero-cream/50 transition-colors">
                <div className="bg-vivero-green/10 p-4 rounded-full mb-4 text-vivero-green">
                  <Leaf className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-vivero-dark mb-2 font-serif">Variedad Exclusiva</h3>
                <p className="text-vivero-dark/70">Extenso catálogo de plantas ornamentales adaptadas a nuestro clima.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-vivero-cream/50 transition-colors">
                <div className="bg-vivero-purple/10 p-4 rounded-full mb-4 text-vivero-purple">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-vivero-dark mb-2 font-serif">Calidad Garantizada</h3>
                <p className="text-vivero-dark/70">Cultivadas con los mejores abonos y cuidados por expertos viveristas.</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-vivero-cream/50 transition-colors">
                <div className="bg-vivero-yellow/20 p-4 rounded-full mb-4 text-yellow-600">
                  <Truck className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-vivero-dark mb-2 font-serif">Envíos a Domicilio</h3>
                <p className="text-vivero-dark/70">Llevamos la naturaleza hasta la puerta de tu casa o proyecto.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN CATEGORÍAS (Catálogo Visual) */}
        <section id="categorias" className="py-20 bg-vivero-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-vivero-dark font-serif mb-4">Nuestras Categorías</h2>
              <div className="w-24 h-1 bg-vivero-purple mx-auto rounded-full mb-6"></div>
              <p className="text-lg text-vivero-dark/70 max-w-2xl mx-auto">Encuentra la planta ideal según tus necesidades y espacios.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Tarjeta 1 */}
              <div className="group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer aspect-[4/5]">
                <img src="/plantas-interior.jpg" alt="Plantas de Interior" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-vivero-dark/90 via-vivero-dark/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-300 group-hover:-translate-y-2">
                  <h3 className="text-2xl font-bold text-white font-serif mb-2">Plantas de Interior</h3>
                  <p className="text-vivero-cream/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Perfectas para dar vida a salas, oficinas y habitaciones.</p>
                  <span className="text-vivero-yellow font-medium flex items-center">Ver selección <ArrowRight className="w-4 h-4 ml-1" /></span>
                </div>
              </div>

              {/* Tarjeta 2 */}
              <div className="group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer aspect-[4/5]">
                <img src="https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?q=80&w=800&auto=format&fit=crop" alt="Árboles Frutales" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-vivero-dark/90 via-vivero-dark/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-300 group-hover:-translate-y-2">
                  <h3 className="text-2xl font-bold text-white font-serif mb-2">Árboles Frutales</h3>
                  <p className="text-vivero-cream/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Cultiva tus propios frutos con nuestras especies nativas e injertos.</p>
                  <span className="text-vivero-yellow font-medium flex items-center">Ver selección <ArrowRight className="w-4 h-4 ml-1" /></span>
                </div>
              </div>

              {/* Tarjeta 3 */}
              <div className="group relative rounded-3xl overflow-hidden shadow-lg cursor-pointer aspect-[4/5]">
                <img src="https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=800&auto=format&fit=crop" alt="Plantas Ornamentales" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-vivero-dark/90 via-vivero-dark/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full transform transition-transform duration-300 group-hover:-translate-y-2">
                  <h3 className="text-2xl font-bold text-white font-serif mb-2">Jardinería Exterior</h3>
                  <p className="text-vivero-cream/80 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Diseña jardines espectaculares con flores y follajes de temporada.</p>
                  <span className="text-vivero-yellow font-medium flex items-center">Ver selección <ArrowRight className="w-4 h-4 ml-1" /></span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECCIÓN NOSOTROS */}
        <section id="nosotros" className="py-20 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="relative mb-12 lg:mb-0">
                <div className="absolute -inset-4 bg-vivero-green/10 rounded-3xl transform -rotate-3 transition-transform hover:rotate-0 duration-500"></div>
                <img className="relative rounded-2xl shadow-2xl object-cover w-full h-[500px]" src="/plantas.jpg" alt="Interior del Vivero Pensamiento" />
                {/* Cuadro flotante de experiencia */}
                <div className="absolute -bottom-6 -right-6 bg-vivero-purple text-white p-6 rounded-2xl shadow-xl hidden sm:block">
                  <p className="text-4xl font-bold font-serif">100%</p>
                  <p className="text-sm font-medium">Calidad natural</p>
                </div>
              </div>
              
              <div className="lg:pl-8">
                <span className="text-vivero-green font-bold tracking-wider uppercase text-sm mb-2 block">Nuestra Historia</span>
                <h2 className="text-3xl md:text-4xl font-bold text-vivero-dark font-serif mb-6 leading-tight">Pasión por cultivar un futuro más verde</h2>
                <div className="w-20 h-1 bg-vivero-yellow mb-8 rounded-full"></div>
                <p className="text-lg text-vivero-dark/80 mb-6 leading-relaxed">
                  En <span className="font-semibold text-vivero-dark">Vivero Pensamiento</span>, nos dedicamos a ofrecer servicios forestales y a producir especies de la más alta calidad. 
                </p>
                <p className="text-lg text-vivero-dark/80 mb-8 leading-relaxed">
                  Nuestra misión es <span className="font-semibold text-vivero-purple">preservar la naturaleza con un sentido de responsabilidad social</span>, conservando especies vegetales y comercializando plantas ornamentales, árboles nativos y frutales para todo tipo de proyectos.
                </p>
                
                <ul className="space-y-4 mb-8">
                  <li className="flex items-start">
                    <Leaf className="w-6 h-6 text-vivero-green mr-3 flex-shrink-0" />
                    <span className="text-vivero-dark/80">Asesoría personalizada para tu jardín.</span>
                  </li>
                  <li className="flex items-start">
                    <Leaf className="w-6 h-6 text-vivero-green mr-3 flex-shrink-0" />
                    <span className="text-vivero-dark/80">Proyectos de paisajismo y reforestación.</span>
                  </li>
                </ul>

                <a href="#contacto" className="inline-flex items-center text-vivero-purple font-bold hover:text-vivero-dark transition-colors text-lg">
                  Conoce más sobre nuestros servicios <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* PIE DE PÁGINA (Footer Completo) */}
      <footer id="contacto" className="bg-vivero-dark text-vivero-cream pt-16 pb-8 border-t-8 border-vivero-purple">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            
            {/* Columna 1: Marca */}
            <div className="md:col-span-1">
              <div className="bg-white inline-block p-2 rounded-xl mb-6">
                <img src="/logo.png" alt="Logo Vivero" className="h-16 w-auto" />
              </div>
              <p className="text-vivero-cream/70 text-sm leading-relaxed mb-6">
                Cultivando vida, embelleciendo el mundo. Especialistas en plantas ornamentales y árboles frutales.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-vivero-cream/60 hover:text-vivero-yellow transition-colors" title="Página Web"><Globe className="w-6 h-6" /></a>
                <a href="#" className="text-vivero-cream/60 hover:text-vivero-yellow transition-colors" title="Correo"><Mail className="w-6 h-6" /></a>
                <a href="#" className="text-vivero-cream/60 hover:text-vivero-yellow transition-colors" title="WhatsApp"><MessageCircle className="w-6 h-6" /></a>
              </div>
            </div>

            {/* Columna 2: Enlaces */}
            <div>
              <h3 className="text-lg font-bold font-serif mb-6 text-white">Explorar</h3>
              <ul className="space-y-4 text-vivero-cream/80">
                <li><a href="#inicio" className="hover:text-vivero-yellow transition-colors">Inicio</a></li>
                <li><a href="#categorias" className="hover:text-vivero-yellow transition-colors">Catálogo de Plantas</a></li>
                <li><a href="#nosotros" className="hover:text-vivero-yellow transition-colors">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-vivero-yellow transition-colors">Proyectos Realizados</a></li>
              </ul>
            </div>

            {/* Columna 3: Legal */}
            <div>
              <h3 className="text-lg font-bold font-serif mb-6 text-white">Servicios</h3>
              <ul className="space-y-4 text-vivero-cream/80">
                <li><a href="#" className="hover:text-vivero-yellow transition-colors">Asesoría Técnica</a></li>
                <li><a href="#" className="hover:text-vivero-yellow transition-colors">Ventas por Mayor</a></li>
                <li><a href="#" className="hover:text-vivero-yellow transition-colors">Diseño de Jardines</a></li>
                <li><a href="#" className="hover:text-vivero-yellow transition-colors">Envíos</a></li>
              </ul>
            </div>

            {/* Columna 4: Contacto */}
            <div>
              <h3 className="text-lg font-bold font-serif mb-6 text-white">Contacto</h3>
              <ul className="space-y-4 text-vivero-cream/80">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-3 text-vivero-yellow flex-shrink-0 mt-0.5" />
                  <span>Sector Viveros, Chimaltenango, Guatemala</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-5 h-5 mr-3 text-vivero-yellow flex-shrink-0" />
                  <span>+502 4079-4985</span>
                </li>
                <li className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-3 text-vivero-yellow flex-shrink-0" />
                  <span>Lunes a Sábado: 8am - 5pm</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Línea Divisoria y Copyright */}
          <div className="border-t border-vivero-cream/20 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-vivero-cream/50">
            <p>&copy; {new Date().getFullYear()} Vivero Pensamiento. Todos los derechos reservados.</p>
            <p className="mt-4 md:mt-0">Diseñado con ❤️ en Guatemala</p>
          </div>
        </div>
      </footer>
    </div>
  );
}