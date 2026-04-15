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
        <p className="text-lg text-text-main/60">No pudimos conectar con la base de datos.</p>
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
    <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-accent-yellow/30">
      <nav className="fixed top-0 w-full bg-white/70 backdrop-blur-xl z-50 border-b border-text-main/5">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoPsic} alt="Logo" className="h-12 w-12 rounded-xl object-cover shadow-sm" />
            <span className="font-black text-xl tracking-tighter hidden sm:block">{data.hero.name}</span>
          </div>
          <div className="flex items-center gap-6">
            <a href={whatsappLink} target="_blank" rel="noreferrer" className="bg-whatsapp text-white px-6 py-2.5 rounded-2xl font-bold text-sm shadow-lg shadow-whatsapp/20 hover:scale-105 transition-all">
              Agendar Cita
            </a>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <div className="inline-flex items-center gap-2 bg-white/50 border border-text-main/5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-accent-orange shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent-orange animate-pulse"></span>
            Consulta Presencial en Querétaro
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-text-main leading-[1.1] tracking-tight">
            Encuentra el equilibrio <br /> <span className="text-accent-green italic">que necesitas.</span>
          </h1>
          <p className="text-xl text-text-main/60 max-w-2xl mx-auto leading-relaxed font-medium">
            {data.hero.therapy}. Especialista en Terapia Cognitivo Conductual para adolescentes y adultos.
          </p>
          <div className="pt-4">
            <a href="#contacto" className="text-text-main/40 font-bold uppercase text-xs tracking-[0.2em] hover:text-accent-orange transition-colors">
              Explorar Servicios ↓
            </a>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-[3rem] p-10 md:p-20 shadow-2xl shadow-text-main/5 grid md:grid-cols-2 gap-16 items-center border border-text-main/5">
          <div className="space-y-10">
            <h3 className="text-4xl font-black text-text-main tracking-tight leading-none">
              Atención profesional <br /> <span className="text-accent-orange">con enfoque humano.</span>
            </h3>
            <div className="space-y-8">
              <div className="group">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main/30 mb-2">Formación</h4>
                <p className="text-lg font-bold group-hover:text-accent-green transition-colors">{data.about.education}</p>
              </div>
              <div className="group">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main/30 mb-2">Enfoque</h4>
                <p className="text-lg font-bold group-hover:text-accent-green transition-colors">{data.about.approach}</p>
              </div>
              <div className="group">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-text-main/30 mb-2">Objetivo</h4>
                <p className="text-lg font-bold group-hover:text-accent-green transition-colors">{data.about.objective}</p>
              </div>
            </div>
          </div>
          <div className="aspect-square bg-bg-main rounded-[2.5rem] overflow-hidden shadow-inner border border-text-main/5">
            {data.hero.image && <img src={data.hero.image} alt="Consultorio" className="w-full h-full object-cover" />}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20 space-y-16">
        <div className="text-center space-y-3">
          <h3 className="text-3xl font-black">Especialidades</h3>
          <p className="text-text-main/40 font-medium">Tratamientos enfocados en resultados y bienestar.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.services.map((s, i) => (
            <div key={i} className="bg-white p-8 rounded-[2rem] border border-text-main/5 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all">
              <div className="w-10 h-10 bg-accent-yellow/20 rounded-xl mb-6 flex items-center justify-center text-accent-orange font-black">
                {i + 1}
              </div>
              <p className="font-black text-lg leading-tight">{s}</p>
            </div>
          ))}
        </div>
      </section>

      <footer id="contacto" className="bg-text-main text-bg-main pt-32 pb-12 mt-20 rounded-t-[4rem]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-20">
          <div className="space-y-8">
            <img src={logoPsic} alt="Logo Footer" className="h-16 w-16 rounded-2xl object-cover grayscale brightness-200" />
            <p className="opacity-50 text-sm leading-relaxed font-medium">
              Comprometidos con la salud mental de la comunidad de Querétaro a través de evidencia científica y calidez humana.
            </p>
          </div>
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-accent-orange">Ubicación</h4>
            <div className="space-y-4 font-bold text-lg">
              <p>{data.contact.displayPhone}</p>
              <p className="opacity-70 leading-snug text-sm">{data.contact.address}</p>
            </div>
          </div>
          <div className="space-y-8">
            <h4 className="text-xs font-black uppercase tracking-[0.3em] text-accent-orange">Disponibilidad</h4>
            <ul className="space-y-4 text-sm font-bold">
              <li className="flex justify-between border-b border-white/5 pb-2"><span>Lunes</span> <span>{data.contact.monday}</span></li>
              <li className="flex justify-between border-b border-white/5 pb-2"><span>Martes</span> <span>{data.contact.tuesday}</span></li>
              <li className="flex justify-between border-b border-white/5 pb-2"><span>Miércoles</span> <span>{data.contact.wednesday}</span></li>
              <li className="flex justify-between border-b border-white/5 pb-2"><span>Jueves</span> <span>{data.contact.thursday}</span></li>
              <li className="flex justify-between border-b border-white/5 pb-2"><span>Viernes</span> <span>{data.contact.friday}</span></li>
              <li className="flex justify-between border-b border-white/5 pb-2"><span>Sábado</span> <span>{data.contact.saturday}</span></li>
              <li className="flex justify-between text-accent-yellow"><span>Domingo</span> <span>{data.contact.sunday}</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 items-center">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-30">© 2026 {data.hero.name}</p>
          <Link to="/admin" className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-yellow hover:opacity-100 transition-opacity">
            Acceso Sistema
          </Link>
        </div>
      </footer>
    </div>
  );
}