import { useEffect, useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error('Error Network');
        return res.json();
      })
      .then(resData => {
        if (resData.error || !resData.hero) throw new Error('Data Invalida');
        setData(resData);
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-bold text-red-600 mb-4">Error de Conexión</h2>
        <p className="text-lg">No se pudo cargar la información del consultorio.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-accent-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/52${data.hero.phone}?text=CITA`;

  return (
    <div className="min-h-screen bg-bg-main text-text-main pb-12">
      {/* Hero Section */}
      <header className="bg-white/40 backdrop-blur-sm border-b border-text-main/10 pt-20 pb-16 px-6 text-center shadow-sm">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-text-main tracking-tight">
            {data.hero.name}
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-accent-green">
            {data.hero.subtitle}
          </h2>
          <p className="text-lg md:text-xl text-text-main/80 max-w-2xl mx-auto">
            {data.hero.therapy}
          </p>
          
          <div className="pt-8">
            <a 
              href={whatsappLink} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-2 bg-whatsapp text-white font-bold py-4 px-10 rounded-full hover:scale-105 transition-all shadow-lg hover:shadow-xl text-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
              Agenda tu cita
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-16 space-y-20">
        
        {/* Sobre el Especialista */}
        <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-text-main/5 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 space-y-6">
            <h3 className="text-3xl font-bold text-text-main flex items-center gap-3">
              <span className="w-4 h-4 rounded-full bg-accent-orange"></span>
              Sobre el Especialista
            </h3>
            <div className="space-y-4 text-lg">
              <p><strong className="text-accent-orange">Formación:</strong> {data.about.education}</p>
              <p><strong className="text-accent-orange">Enfoque Clínico:</strong> {data.about.approach}</p>
              <p><strong className="text-accent-orange">Objetivo:</strong> {data.about.objective}</p>
              <p><strong className="text-accent-orange">Público:</strong> {data.about.target}</p>
            </div>
          </div>
        </section>

        {/* Servicios */}
        <section>
          <h3 className="text-3xl font-bold mb-10 text-center text-text-main">Especialidades que atiende</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.services.map((service, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-accent-green hover:-translate-y-1 transition-transform">
                <p className="font-semibold text-lg text-text-main">{service}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tarifas */}
        <section className="bg-white/60 p-10 rounded-3xl text-center shadow-sm border-t-4 border-accent-yellow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-yellow/10 rounded-bl-full -z-10"></div>
          <h3 className="text-3xl font-bold mb-6 text-text-main">Tarifas de Consulta</h3>
          <div className="flex items-center justify-center gap-6">
            <span className="line-through text-text-main/50 text-2xl">${data.pricing.regular}</span>
            <span className="text-5xl font-black text-accent-green">${data.pricing.promo}</span>
          </div>
          <div className="mt-4 inline-block bg-accent-orange text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-widest shadow-sm">
            Promoción Actual
          </div>
        </section>

      </main>

      {/* Footer / Contacto */}
      <footer className="max-w-5xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-10 bg-text-main text-bg-main p-10 md:p-14 rounded-3xl shadow-xl">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-accent-yellow flex items-center gap-2">
              Ubicación y Contacto
            </h3>
            <div className="space-y-3">
              <p className="flex items-center gap-3">
                <strong className="text-accent-orange">Teléfono:</strong> 
                <span className="text-lg">{data.contact.displayPhone}</span>
              </p>
              <p className="flex items-start gap-3">
                <strong className="text-accent-orange mt-1">Dirección:</strong> 
                <span className="leading-relaxed">{data.contact.address}</span>
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-accent-yellow">Horarios de Atención</h3>
            <ul className="space-y-3">
              <li className="flex justify-between border-b border-bg-main/20 pb-2">
                <span>Lunes a Viernes</span>
                <strong>{data.contact.hoursWeekday}</strong>
              </li>
              <li className="flex justify-between border-b border-bg-main/20 pb-2">
                <span>Sábado</span>
                <strong>{data.contact.hoursSaturday}</strong>
              </li>
              <li className="flex justify-between pb-2 text-accent-orange font-semibold">
                <span>Domingo</span>
                <strong>{data.contact.hoursSunday}</strong>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}