import React, { useState } from 'react';
import { Phone, Mail, ChevronDown } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: '',
    motivo: '',
    mensaje: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Datos enviados:', formData);
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        
        {/* Columna Izquierda: Información Editorial */}
        <div className="contact-info">
          <h1 className="main-title">
            Descubre nuestra colección de plantas ornamentales, árboles nativos y frutales. 
          </h1>
          
          <p className="description">
            Cultivamos vida con pasión para transformar tu hogar y jardín en un lugar único. Contáctanos para asesoría personalizada y descubre cómo podemos ayudarte a crear espacios verdes únicos y llenos de vida.
          </p>

          <div className="contact-details">
            <a href="tel:+50251544669" className="detail-item">
              <Phone className="icon" size={20} strokeWidth={1.5} />
              <span>(+502) 4450-8589</span>
            </a>

            
            <a href="mailto:info@plant.gt" className="detail-item">
              <Mail className="icon" size={20} strokeWidth={1.5} />
              <span>viveropensamientogt@gmail.com</span>
            </a>
          </div>
        </div>

        {/* Columna Derecha: Formulario */}
        <div className="contact-form-wrapper">
          <form className="contact-form" onSubmit={handleSubmit}>
            
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="text"
                  name="apellido"
                  placeholder="Apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group phone-group">
              <div className="country-badge">
                <span role="img" aria-label="Bandera Guatemala">🇬🇹</span>
                <ChevronDown size={14} className="chevron-icon" />
              </div>
              <input
                type="tel"
                name="telefono"
                placeholder="Teléfono/celular*"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico*"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <select
                name="motivo"
                value={formData.motivo}
                onChange={handleChange}
                required
              >
                <option value="" disabled hidden>Selecciona el motivo de contacto</option>
                <option value="paisajismo">Paisajismo y diseño de jardines</option>
                <option value="mantenimiento">Mantenimiento de áreas verdes</option>
                <option value="cotizacion">Cotización mayorista</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="form-group">
              <textarea
                name="mensaje"
                rows="5"
                placeholder="Mensaje"
                value={formData.mensaje}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="btn-submit">
              Enviar
            </button>
          </form>
        </div>

      </div>


   {/* Botón flotante de WhatsApp */}
      <a 
        href="https://wa.me/50240794985" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="whatsapp-float"
        aria-label="Contacto por WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
      </a>
    </section>
  );
}