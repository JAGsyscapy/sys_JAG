import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import defaultLogo from '../assets/logopsichort.jpeg';

export default function Privacidad() {
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
          <img src={siteLogo} alt="Logo" className="h-16 w-auto object-contain" />
          <Link to="/" className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-colors">Volver</Link>
        </div>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Aviso de Privacidad</h1>
        <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
          <p>De conformidad con lo establecido en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, se pone a disposición el presente Aviso de Privacidad.</p>
          <h2 className="text-xl font-bold text-text-main">1. Identidad y domicilio del responsable</h2>
          <p>El Centro de Atención Psicológica y Pedagógica de Querétaro, con domicilio en Querétaro, México, es responsable del uso y protección de sus datos personales.</p>
          <h2 className="text-xl font-bold text-text-main">2. Datos personales que se recaban</h2>
          <p>Para llevar a cabo las finalidades descritas en este aviso, utilizaremos datos de identificación, contacto y, en su caso, datos sensibles relativos a su estado de salud mental, los cuales serán tratados con estricta confidencialidad.</p>
          <h2 className="text-xl font-bold text-text-main">3. Finalidades del tratamiento de datos</h2>
          <p>Los datos personales que recabamos serán utilizados para proveer los servicios de atención psicológica solicitados, conformar su expediente clínico y contactarle para seguimiento de citas.</p>
          <h2 className="text-xl font-bold text-text-main">4. Medios para ejercer derechos ARCO</h2>
          <p>Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada conforme a los principios, deberes y obligaciones previstas en la normativa (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición). Estos derechos se conocen como derechos ARCO.</p>
        </div>
      </div>
    </div>
  );
}