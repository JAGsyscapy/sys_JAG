import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import defaultLogo from '../assets/logopsichort.jpeg';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(res => res.json())
      .then(resData => {
        if (resData.error) throw new Error();
        setData(resData);
      })
      .catch(() => setError(true));
  }, []);

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    showToast(`${type} copiado`);
  };

  if (error) return <div className="min-h-screen flex items-center justify-center bg-bg-main font-black text-text-main">Error de conexión con la base de datos.</div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center bg-bg-main"><div className="w-10 h-10 border-4 border-accent-green border-t-transparent rounded-full animate-spin"></div></div>;

  const siteLogo = data.hero.logo || defaultLogo;

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-accent-yellow relative">
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] bg-text-main text-white px-6 py-4 rounded-full shadow-2xl font-black text-sm uppercase animate-in slide-in-from-top-10 duration-300">
          {toast}
        </div>
      )}

      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={siteLogo} alt="Logo" className="h-20 w-auto object-contain" />
          </div>
          <Link to="/gracias" className="bg-whatsapp text-white px-8 py-4 rounded-xl font-black text-sm shadow-md hover:scale-105 transition-all uppercase">
            Agendar Cita
          </Link>
        </div>
      </nav>

      <section className="pt-48 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-10">
          <h1 className="text-5xl md:text-7xl font-black text-text-main leading-[1.1] tracking-tight">
            {data.hero.titleMain} <br /> <span className="text-accent-green italic">{data.hero.titleItalic}</span>
          </h1>
          <div className="pt-4 flex items-center justify-center">
            <a href="#servicios" className="inline-block bg-accent-orange text-white font-black uppercase text-sm tracking-widest px-10 py-5 rounded-full shadow-lg hover:scale-105 transition-all w-full sm:w-auto text-center">
              Explorar Servicios ↓
            </a>
          </div>
          <p className="text-xl text-text-main max-w-2xl mx-auto leading-relaxed font-bold pt-6 border-t border-gray-200">
            {data.hero.description}
          </p>
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
                <p className="text-xl font-bold text-text-main">UNAM</p>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Objetivo</h4>
                <p className="text-xl font-bold text-text-main">{data.about.objective}</p>
              </div>
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Modalidad</h4>
                <p className="text-xl font-bold text-text-main">Sesiones Virtuales y Presenciales</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-full bg-bg-main rounded-[2.5rem] shadow-inner border border-gray-200 flex items-center justify-center p-6 overflow-hidden">
              {data.hero.image && <img src={data.hero.image} alt="Consultorio" className="w-full max-h-[500px] object-cover rounded-2xl" />}
            </div>
            <p className="text-center font-black text-2xl text-text-main uppercase tracking-tighter">UNAM</p>
          </div>
        </div>
      </section>

      <section id="servicios" className="max-w-6xl mx-auto px-6 py-20 space-y-16 scroll-mt-32">
        <div className="text-center space-y-3">
          <h3 className="text-4xl font-black text-text-main">Especialidades</h3>
          <p className="text-text-main font-semibold text-lg">Tratamientos enfocados en resultados y bienestar.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.services.map((s, i) => (
            <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-accent-green/30 transition-all text-center">
              <div className="w-10 h-10 bg-accent-yellow rounded-lg mb-4 mx-auto flex items-center justify-center text-text-main font-black text-sm shadow-inner">
                {i + 1}
              </div>
              <p className="font-black text-base text-text-main leading-tight uppercase tracking-tighter">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {data.gallery && data.gallery.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20 border-t border-gray-200">
          <div className="text-center space-y-3 mb-16">
            <h3 className="text-4xl font-black text-text-main">Instalaciones</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.gallery.map((img, i) => (
              <div key={i} className="group relative rounded-[2rem] overflow-hidden bg-white shadow-md cursor-zoom-in" onClick={() => setSelectedImage(img.url)}>
                <img src={img.url} alt={img.title} className="aspect-[4/3] w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-black uppercase text-xs tracking-widest">Ver Imagen</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {data.contact.mapUrl && (
        <section className="max-w-6xl mx-auto px-6 py-20 border-t border-gray-200">
          <div className="w-full h-[450px] rounded-[3rem] overflow-hidden shadow-xl border border-gray-200">
            <iframe src={data.contact.mapUrl} width="100%" height="100%" style={{border: 0}} allowFullScreen="" loading="lazy"></iframe>
          </div>
        </section>
      )}

      <footer className="bg-text-main text-bg-main pt-20 pb-12 rounded-t-[4rem]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-20">
          <div className="space-y-8">
            <img src={siteLogo} alt="Logo" className="h-20 w-auto bg-white p-4 rounded-2xl" />
            <p className="font-bold opacity-80 uppercase text-xs tracking-widest leading-loose">Querétaro, México. <br/> Salud Mental con evidencia científica.</p>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase text-accent-orange tracking-widest">Contacto</h4>
            <div className="space-y-4 font-bold text-sm">
              <p className="opacity-90">{data.contact.address}</p>
              <p onClick={() => handleCopy(data.contact.displayPhone, 'Teléfono')} className="cursor-pointer hover:text-accent-green transition-colors">{data.contact.displayPhone}</p>
              <p onClick={() => handleCopy(data.contact.email, 'Correo')} className="cursor-pointer hover:text-accent-green transition-colors">{data.contact.email}</p>
            </div>
          </div>
          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase text-accent-orange tracking-widest">Horarios</h4>
            <ul className="text-xs font-bold space-y-2 opacity-80 uppercase tracking-tighter">
              <li className="flex justify-between"><span>Lun - Vie:</span> <span>{data.contact.monday}</span></li>
              <li className="flex justify-between"><span>Sábado:</span> <span>{data.contact.saturday}</span></li>
              <li className="flex justify-between text-accent-yellow font-black"><span>Domingo:</span> <span>{data.contact.sunday}</span></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 mt-20 pt-10 border-t border-white/5 text-center">
          <p className="text-[10px] font-black uppercase opacity-40">© 2026 {data.hero.name} | <Link to="/admin" className="text-accent-yellow">Acceso Sistema</Link></p>
        </div>
      </footer>

      <div className="fixed bottom-28 right-6 z-[90] flex flex-col gap-3 items-end pointer-events-none hidden md:flex">
        {data.contact.displayPhone && (
          <a href={`tel:${data.contact.displayPhone.replace(/\D/g,'')}`} className="bg-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce pointer-events-auto border border-gray-100">
            <div className="text-accent-green"><svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg></div>
            <p className="text-xs font-black text-text-main">{data.contact.displayPhone}</p>
          </a>
        )}
      </div>

      <Link to="/gracias" className="fixed bottom-6 right-6 z-[100] bg-whatsapp text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform animate-pulse">
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332-.006c.106-.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.825-3.113 6.938-6.938 6.938z"/></svg>
      </Link>

      {selectedImage && (
        <div className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Zoom" className="max-w-full max-h-[90vh] object-contain rounded-2xl animate-in zoom-in duration-200" />
        </div>
      )}
    </div>
  );
}