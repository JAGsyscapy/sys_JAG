import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import defaultLogo from '../assets/logopsichort.jpeg';

export default function Terminos() {
  const [siteLogo, setSiteLogo] = useState(defaultLogo);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if(data && data.hero && data.hero.logo) {
          setSiteLogo(data.hero.logo);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-bg-main p-6 md:p-12 font-sans text-text-main">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[3rem] shadow-xl border border-gray-200 space-y-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-8">
          <img src={siteLogo} alt="Logo" className="h-24 w-auto object-contain" />
          <Link to="/" className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">Volver</Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Términos y Condiciones</h1>
        <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
          <p>El acceso y uso de este sitio web y los servicios ofrecidos por el Centro de Atención Psicológica y Pedagógica de Querétaro están sujetos a los siguientes términos y condiciones.</p>
          <h2 className="text-xl font-bold text-text-main">1. Servicios</h2>
          <p>Se ofrecen servicios de terapia psicológica presencial en Querétaro. La agenda de citas está sujeta a disponibilidad.</p>
          <h2 className="text-xl font-bold text-text-main">2. Cancelaciones y Reprogramaciones</h2>
          <p>Toda cancelación o reprogramación de cita debe realizarse con al menos 24 horas de anticipación. De lo contrario, podrá generar el cobro total o parcial de la sesión programada.</p>
          <h2 className="text-xl font-bold text-text-main">3. Confidencialidad</h2>
          <p>Toda la información compartida durante las sesiones es estrictamente confidencial y se rige bajo el secreto profesional y nuestro Aviso de Privacidad.</p>
          <h2 className="text-xl font-bold text-text-main">4. Pagos</h2>
          <p>Los pagos deben realizarse previo a la sesión o al finalizar la misma, mediante los métodos de pago aceptados en el consultorio. Las tarifas promocionales están sujetas a cambios sin previo aviso.</p>
        </div>
      </div>
    </div>
  );
}