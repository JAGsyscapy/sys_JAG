import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import defaultLogo from '../assets/logopsichort.jpeg';

export default function Privacidad() {
  const [siteLogo, setSiteLogo] = useState(defaultLogo);
  const [legalData, setLegalData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(data => {
        if(data) {
          if(data.hero && data.hero.logo) setSiteLogo(data.hero.logo);
          if(data.legal && data.legal.privacidad) setLegalData(data.legal.privacidad);
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
        
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Aviso de Privacidad</h1>
        
        <div className="space-y-6 text-gray-700 leading-relaxed font-medium">
          {legalData ? (
            <>
              {legalData.intro && <p>{legalData.intro}</p>}
              {legalData.sections && legalData.sections.map((sec, index) => (
                <div key={index} className="space-y-2">
                  {sec.title && <h2 className="text-xl font-bold text-text-main">{sec.title}</h2>}
                  {sec.text && <p>{sec.text}</p>}
                </div>
              ))}
            </>
          ) : (
            <p>Cargando información...</p>
          )}
        </div>
      </div>
    </div>
  );
}