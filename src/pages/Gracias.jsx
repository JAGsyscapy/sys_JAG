import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import defaultLogo from '../assets/logopsichort.jpeg';

export default function Gracias() {
  const [waLink, setWaLink] = useState('');
  const [siteLogo, setSiteLogo] = useState(defaultLogo);

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', {'send_to': 'AW-XXXXXXXX/YYYYYYYYYY'});
    }
    
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if(data && data.hero && data.hero.phone) {
          const msg = encodeURIComponent('Hola buen dia, mi nombre es:\nY el motivo de consulta es:');
          const link = `https://wa.me/52${data.hero.phone}?text=${msg}`;
          setWaLink(link);
          if (data.hero.logo) {
            setSiteLogo(data.hero.logo);
          }
          setTimeout(() => {
            window.location.href = link;
          }, 3000);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="bg-white p-10 rounded-[3rem] shadow-xl max-w-lg w-full space-y-6 border border-gray-200">
        <img src={siteLogo} alt="Logo" className="h-20 w-auto mx-auto object-contain" />
        <h1 className="text-4xl font-black text-text-main tracking-tight">¡Gracias por tu interés!</h1>
        <p className="text-lg text-gray-600 font-medium">Serás redirigido a WhatsApp en unos segundos para confirmar tu cita.</p>
        
        {waLink && (
          <a href={waLink} className="inline-block bg-whatsapp text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-widest shadow-md hover:scale-105 transition-all mt-4">
            Ir a WhatsApp ahora
          </a>
        )}
        
        <div className="pt-6">
          <Link to="/" className="text-sm font-bold text-accent-orange hover:underline">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}