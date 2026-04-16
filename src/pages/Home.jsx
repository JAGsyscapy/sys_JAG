import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logoPsic from '../assets/logopsichort.jpeg';

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toast, setToast] = useState(null);

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

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    showToast(`${type} copiado al portapapeles`);
  };

  const handleEmailClick = (e, email) => {
    e.preventDefault();
    handleCopy(email, 'Correo');
    setTimeout(() => {
      window.location.href = `mailto:${email}`;
    }, 500);
  };

  const handlePhoneClick = (e, phone) => {
    e.preventDefault();
    handleCopy(phone, 'Teléfono');
    setTimeout(() => {
      window.location.href = `tel:${phone.replace(/\D/g, '')}`;
    }, 500);
  };

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

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans selection:bg-accent-yellow selection:text-text-main relative">
      
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] bg-text-main text-white px-6 py-4 rounded-full shadow-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-10 fade-in duration-300">
          <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          {toast}
        </div>
      )}

      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-xl z-50 border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logoPsic} alt="Logo" className="h-14 w-auto object-contain" />
          </div>
          <div className="flex items-center gap-6">
            <Link to="/gracias" className="bg-whatsapp text-white px-6 py-3 rounded-xl font-black text-sm shadow-md hover:scale-105 transition-all">
              Agendar Cita
            </Link>
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
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/gracias" className="inline-block bg-whatsapp text-white font-black uppercase text-sm tracking-widest px-8 py-4 rounded-full shadow-lg hover:scale-105 transition-transform w-full sm:w-auto text-center">
              Agendar Cita Ahora
            </Link>
            <a href="#servicios" className="inline-block bg-white border border-gray-200 text-text-main font-black uppercase text-sm tracking-widest px-8 py-4 rounded-full shadow-sm hover:border-accent-orange hover:text-accent-orange transition-colors w-full sm:w-auto text-center">
              Explorar Servicios ↓
            </a>
          </div>
          <p className="text-xl text-text-main max-w-2xl mx-auto leading-relaxed font-semibold pt-6">
            {data.hero.therapy}. Especialista en Terapia Cognitivo Conductual para adolescentes y adultos.
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
              <div 
                key={i} 
                className="group relative rounded-[2rem] overflow-hidden bg-white shadow-md border border-gray-200 flex items-center justify-center p-4 cursor-zoom-in"
                onClick={() => setSelectedImage(img.url)}
              >
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

      {data.contact.mapUrl && (
        <section id="ubicacion" className="max-w-6xl mx-auto px-6 py-10 mt-10 border-t border-gray-200 scroll-mt-24">
          <div className="text-center space-y-3 mb-10">
            <h3 className="text-4xl font-black text-text-main">Ubicación</h3>
            <p className="text-text-main font-semibold text-lg">Visítanos en nuestro consultorio.</p>
          </div>
          <div className="w-full h-[450px] rounded-[2rem] overflow-hidden shadow-xl border border-gray-200 bg-gray-100">
            <iframe 
              src={data.contact.mapUrl} 
              width="100%" 
              height="100%" 
              style={{border: 0}} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      )}

      <footer id="contacto" className="bg-text-main text-bg-main pt-32 pb-12 mt-20 rounded-t-[4rem]">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-20">
          <div className="space-y-8">
            <img src={logoPsic} alt="Logo Footer" className="h-28 w-auto object-contain bg-white px-6 py-4 rounded-3xl" />
            <p className="text-base leading-relaxed font-semibold opacity-90">
              Comprometidos con la salud mental de la comunidad de Querétaro a través de evidencia científica y calidez humana.
            </p>
          </div>
          
          <div className="space-y-8">
            <h4 className="text-sm font-black uppercase tracking-widest text-accent-orange">Contacto</h4>
            <div className="space-y-6 font-bold text-base">
              
              {data.contact.address && (
                <a 
                  href="#ubicacion" 
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="bg-white/10 p-3 rounded-full shadow-lg text-accent-orange group-hover:bg-accent-orange group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <p className="opacity-90 leading-snug group-hover:opacity-100 transition-opacity">{data.contact.address}</p>
                </a>
              )}

              {data.contact.displayPhone && (
                <a 
                  href={`tel:${data.contact.displayPhone.replace(/\D/g,'')}`} 
                  onClick={(e) => handlePhoneClick(e, data.contact.displayPhone)} 
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="bg-white/10 p-3 rounded-full shadow-lg text-accent-green group-hover:bg-accent-green group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <p className="opacity-90 leading-snug group-hover:opacity-100 transition-opacity">{data.contact.displayPhone}</p>
                </a>
              )}

              {data.contact.email && (
                <a 
                  href={`mailto:${data.contact.email}`} 
                  onClick={(e) => handleEmailClick(e, data.contact.email)} 
                  className="flex items-center gap-4 group cursor-pointer"
                >
                  <div className="bg-white/10 p-3 rounded-full shadow-lg text-blue-400 group-hover:bg-blue-400 group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <p className="opacity-90 leading-snug group-hover:opacity-100 transition-opacity">{data.contact.email}</p>
                </a>
              )}
            </div>

            <div className="flex gap-6 pt-4">
              {data.contact.facebook && (
                <a href={data.contact.facebook} target="_blank" rel="noreferrer" className="bg-[#1877F2] p-3 rounded-full shadow-lg hover:bg-blue-600 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V7.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
              )}
              {data.contact.instagram && (
                <a href={data.contact.instagram.startsWith('http') ? data.contact.instagram : `https://${data.contact.instagram}`} target="_blank" rel="noreferrer" className="bg-pink-600 p-3 rounded-full shadow-lg hover:bg-pink-700 transition-colors">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                </a>
              )}
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
          <p className="text-xs font-black uppercase tracking-widest opacity-50">© 2026 {data.hero.name} | Cédula Profesional: 12345678</p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 mt-4 md:mt-0">
            <Link to="/privacidad" className="text-xs font-bold text-gray-300 hover:text-white transition-colors">Privacidad</Link>
            <Link to="/terminos" className="text-xs font-bold text-gray-300 hover:text-white transition-colors">Términos</Link>
            <Link to="/admin" className="text-xs font-black uppercase tracking-widest text-accent-yellow hover:text-white transition-colors ml-4">
              Acceso Sistema
            </Link>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-28 right-6 z-[90] flex flex-col gap-3 items-end pointer-events-none hidden md:flex">
        {data.contact.address && (
          <a 
            href="#ubicacion" 
            className="bg-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce pointer-events-auto border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="text-accent-orange">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <p className="text-xs font-bold text-text-main max-w-[150px] truncate">{data.contact.address}</p>
          </a>
        )}
        
        {data.contact.displayPhone && (
          <a 
            href={`tel:${data.contact.displayPhone.replace(/\D/g,'')}`} 
            onClick={(e) => handlePhoneClick(e, data.contact.displayPhone)}
            className="bg-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce pointer-events-auto border border-gray-100 hover:bg-gray-50 transition-colors" 
            style={{ animationDelay: '100ms' }}
          >
            <div className="text-accent-green">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <p className="text-xs font-bold text-text-main">{data.contact.displayPhone}</p>
          </a>
        )}
        
        {data.contact.email && (
          <a 
            href={`mailto:${data.contact.email}`} 
            onClick={(e) => handleEmailClick(e, data.contact.email)}
            className="bg-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3 animate-bounce pointer-events-auto border border-gray-100 hover:bg-gray-50 transition-colors" 
            style={{ animationDelay: '200ms' }}
          >
            <div className="text-blue-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <p className="text-xs font-bold text-text-main">{data.contact.email}</p>
          </a>
        )}

        <div className="flex gap-2 pointer-events-auto" style={{ animationDelay: '300ms' }}>
          {data.contact.facebook && (
            <a href={data.contact.facebook} target="_blank" rel="noreferrer" className="bg-[#1877F2] p-2 rounded-full animate-bounce shadow-lg hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V7.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          )}
          {data.contact.instagram && (
            <a href={data.contact.instagram.startsWith('http') ? data.contact.instagram : `https://${data.contact.instagram}`} target="_blank" rel="noreferrer" className="bg-pink-600 p-2 rounded-full animate-bounce shadow-lg hover:scale-110 transition-transform" style={{ animationDelay: '400ms' }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
            </a>
          )}
        </div>
      </div>

      <Link
        to="/gracias"
        className="fixed bottom-6 right-6 z-[100] bg-whatsapp text-white p-4 rounded-full shadow-2xl hover:bg-green-500 transition-colors animate-bounce"
        aria-label="Contactar por WhatsApp"
      >
        <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332-.006c.106-.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm.029 18.88c-1.161 0-2.305-.292-3.318-.844l-3.677.964.984-3.595c-.607-1.052-.927-2.246-.926-3.468.001-3.825 3.113-6.937 6.937-6.937 3.825 0 6.938 3.112 6.938 6.937 0 3.825-3.113 6.938-6.938 6.938z"/>
        </svg>
      </Link>

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Vista ampliada" 
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl animate-in zoom-in duration-200" 
          />
        </div>
      )}
    </div>
  );
}