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
        <p className="text-lg">No se pudo conectar a la base de datos NeonDB.</p>
        <p className="text-lg">Verifica que agregaste DATABASE_URL en las variables de entorno de Netlify.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold text-text-main animate-pulse">Cargando...</p>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/52${data.hero.phone}?text=CITA`;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-24">
      <header className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-text-main">{data.hero.name}</h1>
        <h2 className="text-2xl font-medium text-accent-orange">{data.hero.subtitle}</h2>
        <p className="text-xl">{data.hero.therapy}</p>
        {data.hero.image && <img src={data.hero.image} alt="Hero" className="mx-auto rounded-xl shadow-lg max-w-md w-full object-cover" />}
        <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-block bg-whatsapp text-white font-bold py-4 px-8 rounded-full hover:scale-105 transition-transform shadow-md text-lg">
          Agenda tu cita
        </a>
      </header>

      <section className="bg-white/50 p-8 rounded-2xl shadow-sm border border-text-main/10">
        <h3 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-accent-green"></span>
          Sobre el Especialista
        </h3>
        <ul className="space-y-4 text-lg">
          <li><strong>Formación:</strong> {data.about.education}</li>
          <li><strong>Enfoque Clínico:</strong> {data.about.approach}</li>
          <li><strong>Objetivo:</strong> {data.about.objective}</li>
          <li><strong>Público:</strong> {data.about.target}</li>
        </ul>
      </section>

      <section>
        <h3 className="text-3xl font-bold mb-6 text-center text-accent-orange">Servicios y Especialidades</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.services.map((service, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-accent-yellow font-medium">
              {service}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-accent-green/10 p-8 rounded-2xl text-center shadow-sm">
        <h3 className="text-3xl font-bold mb-4">Tarifas</h3>
        <div className="text-xl">
          <span className="line-through text-text-main/60 mr-4">${data.pricing.regular}</span>
          <span className="text-4xl font-bold text-accent-green">${data.pricing.promo}</span>
          <p className="mt-2 text-sm uppercase tracking-wider font-bold text-accent-orange">Promoción Actual</p>
        </div>
      </section>

      <footer className="grid md:grid-cols-2 gap-8 bg-text-main text-bg-main p-10 rounded-2xl">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-accent-yellow">Contacto</h3>
          <p className="mb-2"><strong>Teléfono:</strong> {data.contact.displayPhone}</p>
          <p className="mb-2"><strong>Dirección:</strong> {data.contact.address}</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-4 text-accent-yellow">Horarios</h3>
          <p>Lunes a Viernes: {data.contact.hoursWeekday}</p>
          <p>Sábado: {data.contact.hoursSaturday}</p>
          <p>Domingo: {data.contact.hoursSunday}</p>
        </div>
      </footer>
    </div>
  );
}