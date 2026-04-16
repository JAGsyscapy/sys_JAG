import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logoPsic from '../assets/logopsichort.jpeg';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/data')
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(resData => {
        if (resData.error || !resData.hero) throw new Error();
        setData(resData);
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-bg-main">
        <h2 className="text-3xl font-black text-accent-orange mb-4">Aviso de Sistema</h2>
        <p className="text-lg text-text-main font-medium">No pudimos conectar con la base de datos.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <div className="w-10 h-10 border-4 border-accent-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/52${data.hero.phone}?text=CITA`;

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-accent-yellow selection:text-text-main relative">
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logoPsic} alt="Logo" className="h-14 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-6">
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-whatsapp text-white px-6 py-3 rounded-xl font-black text-sm shadow-md hover:scale-105 transition-all">
              Agendar Cita
            </a>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 bg-white border border-accent-orange/20 px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest text-accent-orange shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent-orange animate-pulse"></span>
            Consulta Presencial en Querétaro
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-text-main leading-[1.1] tracking-tight">
            Encuentra el equilibrio <br /> <span className="text-accent-green italic">que necesitas.</span>
          </h1>
          <p className="text-xl text-text-main max-w-2xl mx-auto leading-relaxed font-semibold">
            {data.hero.therapy}. Especialista en Terapia Cognitivo Conductual para adolescentes y adultos.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#servicios" className="inline-block bg-white border border-gray-200 text-text-main font-black uppercase text-sm tracking-widest px-8 py-4 rounded-full shadow-sm hover:border-accent-orange hover:text-accent-orange transition-colors">
              Explorar Servicios ↓
            </a>
            {data.gallery && data.gallery.length > 0 && (
              <a href="#galeria" className="inline-block bg-transparent text-text-main font-black uppercase text-sm tracking-widest px-8 py-4 hover:text-accent-green transition-colors">
                Ver Galería
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-[3rem] p-10 md:p-20 shadow-xl grid md:grid-cols-2 gap-16 items-center border border-gray-100">
          <div className="space-y-10">
            <h3 className="text-4xl font-black text-text-main tracking-tight leading-none">
              Atención profesional <br /> <span className="text-accent-orange">con enfoque humano.</span>
            </h3>
            <div className="space-y-8">
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Formación</h4>
                <p className="text-xl font-bold text-text-main">{data.about.education}</p>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Enfoque</h4>
                <p className="text-xl font-bold text-text-main">{data.about.approach}</p>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Objetivo</h4>
                <p className="text-xl font-bold text-text-main">{data.about.objective}</p>
              </div>
            </div>
          </div>
          <div className="w-full bg-bg-main rounded-[2.5rem] shadow-inner border border-gray-200 flex items-center justify-center p-6">
            {data.hero.image && <img src={data.hero.image} alt="Consultorio" className="w-full max-h-[500px] object-contain rounded-2xl" />}
          </div>
        </div>
      </section>

      <section id="servicios" className="max-w-6xl mx-auto px-6 py-20 space-y-16 scroll-mt-24">
        <div className="text-center space-y-3">
          <h3 className="text-4xl font-black text-text-main">Especialidades</h3>
          <p className="text-text-main font-semibold text-lg">Tratamientos enfocados en resultados y bienestar.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.services.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-md hover:shadow-xl hover:border-accent-green/30 hover:-translate-y-2 transition-all">
              <div className="w-12 h-12 bg-accent-yellow rounded-xl mb-6 flex items-center justify-center text-text-main font-black text-xl shadow-inner">
                {i + 1}
              </div>
              <p className="font-black text-xl text-text-main leading-tight">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {data.gallery && data.gallery.length > 0 && (
        <section id="galeria" className="max-w-6xl mx-auto px-6 py-20 space-y-16 scroll-mt-24 border-t border-gray-200">
          <div className="text-center space-y-3">
            <h3 className="text-4xl font-black text-text-main">Nuestras Instalaciones</h3>
            <p className="text-text-main font-semibold text-lg">Un espacio seguro y diseñado para tu comodidad.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.gallery.map((img, i) => (
              <div key={i} className="group relative rounded-[2rem] overflow-hidden bg-white shadow-md border border-gray-200 flex items-center justify-center p-4">
                <div className="aspect-[4/3] w-full flex items-center justify-center">
                  <img src={img.url} alt={img.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 pointer-events-none">
                  <span className="text-white font-bold text-lg">{img.title}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer id="contacto" className="bg-text-main text-bg-main pt-32 pb-12 mt-20 rounded-t-[4rem]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-20">
          <div className="space-y-8">
            <img src={logoPsic} alt="Logo Footer" className="h-20 w-auto object-contain rounded-xl grayscale brightness-150" />
            <p className="text-base leading-relaxed font-semibold opacity-90">
              Comprometidos con la salud mental de la comunidad de Querétaro a través de evidencia científica y calidez humana.
            </p>
          </div>
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-widest text-accent-orange">Ubicación</h4>
            <div className="space-y-4 font-bold text-xl">
              <p>{data.contact.displayPhone}</p>
              <p className="opacity-90 leading-snug text-base">{data.contact.address}</p>
            </div>
          </div>
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-widest text-accent-orange">Disponibilidad</h4>
            <ul className="space-y-4 text-base font-bold opacity-90">
              <li className="flex justify-between border-b border-white/10 pb-2"><span>Lunes</span> <span>{data.contact.monday}</span></li>
              <li className="flex justify-between border-b border-white/10 pb-2"><span>Martes</span> <span>{data.contact.tuesday}</span></li>
              <li className="flex justify-between border-b border-white/10 pb-2"><span>Miércoles</span> <span>{data.contact.wednesday}</span></li>
              <li className="flex justify-between border-b border-white/10 pb-2"><span>Jueves</span> <span>{data.contact.thursday}</span></li>
              <li className="flex justify-between border-b border-white/10 pb-2"><span>Viernes</span> <span>{data.contact.friday}</span></li>
              <li className="flex justify-between border-b border-white/10 pb-2"><span>Sábado</span> <span>{data.contact.saturday}</span></li>
              <li className="flex justify-between text-accent-yellow font-black"><span>Domingo</span> <span>{data.contact.sunday}</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-32 pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between gap-6 items-center">
          <p className="text-xs font-black uppercase tracking-widest opacity-50">© 2026 {data.hero.name}</p>
          <Link to="/admin" className="text-xs font-black uppercase tracking-widest text-accent-yellow hover:text-white transition-colors">
            Acceso Sistema
          </Link>
        </div>
      </footer>

      <a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[100] bg-whatsapp text-white p-4 rounded-full shadow-2xl hover:bg-green-500 transition-colors animate-bounce"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </a>
    </div>
  );
}