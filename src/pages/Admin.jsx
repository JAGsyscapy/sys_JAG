import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoPsic from '../assets/logopsichort.jpeg';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [data, setData] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetch('/api/data')
        .then(res => res.json())
        .then(setData)
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    if (res.ok) {
      const { token: t } = await res.json();
      localStorage.setItem('token', t);
      setToken(t);
    } else {
      alert('Error de acceso');
    }
  };

  const saveChanges = async () => {
    setSaving(true);
    let currentImage = data.hero.image;

    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('upload_preset', 'psicologo_web');
      
      const resImg = await fetch('https://api.cloudinary.com/v1_1/do0tzxctb/image/upload', {
        method: 'POST',
        body: formData
      });
      const resJson = await resImg.json();
      currentImage = resJson.secure_url;
    }

    const payload = { ...data, hero: { ...data.hero, image: currentImage } };

    const res = await fetch('/api/data', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      setData(payload);
      setSaving(false);
      setActiveModal(null);
      setImageFile(null);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 font-sans">
        <form onSubmit={handleLogin} className="bg-white p-12 rounded-[3rem] shadow-xl max-w-md w-full space-y-8 border border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-4">
            <img src={logoPsic} alt="Logo" className="h-20 w-auto object-contain" />
            <div className="text-center">
              <h2 className="text-3xl font-black text-text-main tracking-tight">Acceso Admin</h2>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1">Gestión de Contenidos</p>
            </div>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Usuario" className="w-full bg-gray-50 border border-gray-200 p-5 rounded-2xl focus:ring-2 ring-accent-green outline-none font-bold text-text-main" value={credentials.username} onChange={e => setCredentials({...credentials, username: e.target.value})} />
            <input type="password" placeholder="Contraseña" className="w-full bg-gray-50 border border-gray-200 p-5 rounded-2xl focus:ring-2 ring-accent-green outline-none font-bold text-text-main" value={credentials.password} onChange={e => setCredentials({...credentials, password: e.target.value})} />
          </div>
          <button className="w-full bg-text-main text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all">
            Ingresar
          </button>
        </form>
      </div>
    );
  }

  if (!data) return null;

  const Modal = ({ title, children }) => (
    <div className="fixed inset-0 bg-text-main/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 md:p-8 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <h3 className="text-2xl font-black text-text-main">{title}</h3>
          <button onClick={() => setActiveModal(null)} className="text-gray-500 hover:text-red-600 font-black text-sm uppercase tracking-widest px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">Cerrar</button>
        </div>
        <div className="p-6 md:p-10 space-y-6 max-h-[65vh] overflow-y-auto">
          {children}
        </div>
        <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
          <button onClick={() => setActiveModal(null)} className="px-6 py-3 font-black text-gray-500 hover:text-text-main">Cancelar</button>
          <button onClick={saveChanges} disabled={saving} className="bg-accent-green text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-md hover:bg-green-600 disabled:opacity-50">
            {saving ? 'Guardando...' : 'Aplicar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12 font-sans pb-40">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-200">
          <div className="flex items-center gap-6">
            <img src={logoPsic} alt="Logo Admin" className="h-16 w-auto object-contain hidden md:block" />
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">Dashboard Administrativo</h1>
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-1">Gestión de datos normalizados</p>
            </div>
          </div>
          <button onClick={() => {localStorage.removeItem('token'); setToken(null); navigate('/')}} className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-red-100 transition-colors border border-red-200">
            Cerrar Sesión
          </button>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard title="Cabecera y Hero" subtitle="Nombre y Terapia" onClick={() => setActiveModal('hero')} />
          <AdminCard title="Sobre Mí" subtitle="Formación y Enfoque" onClick={() => setActiveModal('about')} />
          <AdminCard title="Servicios" subtitle="Lista Individual" onClick={() => setActiveModal('services')} />
          <AdminCard title="Tarifas" subtitle="Precios y Promociones" onClick={() => setActiveModal('pricing')} />
          <AdminCard title="Contacto" subtitle="Teléfono y Dirección" onClick={() => setActiveModal('contact')} />
          <AdminCard title="Horarios" subtitle="Disponibilidad Diaria" onClick={() => setActiveModal('hours')} />
        </div>

        {activeModal === 'hero' && (
          <Modal title="Editar Inicio">
            <div className="space-y-4">
              <Input label="Nombre Profesional" value={data.hero.name} onChange={v => setData({...data, hero: {...data.hero, name: v}})} />
              <Input label="Título de Subtítulo" value={data.hero.subtitle} onChange={v => setData({...data, hero: {...data.hero, subtitle: v}})} />
              <Input label="Propuesta de Terapia" value={data.hero.therapy} onChange={v => setData({...data, hero: {...data.hero, therapy: v}})} />
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-text-main ml-2">Imagen Personal (Opcional)</span>
                <input type="file" className="w-full text-sm font-bold file:bg-gray-200 file:border-none file:rounded-xl file:px-6 file:py-3 file:mr-4 file:font-black file:text-text-main hover:file:bg-gray-300" onChange={e => setImageFile(e.target.files[0])} />
              </div>
            </div>
          </Modal>
        )}

        {activeModal === 'about' && (
          <Modal title="Editar Especialista">
            <div className="space-y-4">
              <Input label="Formación" value={data.about.education} onChange={v => setData({...data, about: {...data.about, education: v}})} />
              <Input label="Enfoque Clínico" value={data.about.approach} onChange={v => setData({...data, about: {...data.about, approach: v}})} />
              <Input label="Objetivo" value={data.about.objective} onChange={v => setData({...data, about: {...data.about, objective: v}})} />
              <Input label="Público Objetivo" value={data.about.target} onChange={v => setData({...data, about: {...data.about, target: v}})} />
            </div>
          </Modal>
        )}

        {activeModal === 'services' && (
          <Modal title="Editar Especialidades">
            <div className="space-y-4">
              <p className="text-xs font-black uppercase text-gray-500 mb-4">Administra cada servicio de forma individual</p>
              {data.services.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input 
                    className="flex-1 bg-white border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 ring-accent-green font-bold text-text-main" 
                    value={s} 
                    onChange={e => {
                      const newServices = [...data.services];
                      newServices[i] = e.target.value;
                      setData({...data, services: newServices});
                    }} 
                  />
                  <button 
                    onClick={() => {
                      const newServices = data.services.filter((_, index) => index !== i);
                      setData({...data, services: newServices});
                    }}
                    className="bg-red-50 border border-red-200 text-red-600 w-14 h-14 flex items-center justify-center rounded-xl font-black text-xl hover:bg-red-100 transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button 
                onClick={() => setData({...data, services: [...data.services, 'Nuevo Servicio']})}
                className="w-full bg-accent-green/10 border border-accent-green/20 text-accent-green py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-accent-green hover:text-white transition-colors mt-4"
              >
                + Añadir Servicio
              </button>
            </div>
          </Modal>
        )}

        {activeModal === 'pricing' && (
          <Modal title="Editar Tarifas">
            <div className="grid grid-cols-2 gap-6">
              <Input label="Precio Regular" value={data.pricing.regular} onChange={v => setData({...data, pricing: {...data.pricing, regular: v}})} />
              <Input label="Precio Promoción" value={data.pricing.promo} onChange={v => setData({...data, pricing: {...data.pricing, promo: v}})} />
            </div>
          </Modal>
        )}

        {activeModal === 'contact' && (
          <Modal title="Editar Contacto">
            <div className="space-y-4">
              <Input label="WhatsApp (Solo números)" value={data.hero.phone} onChange={v => setData({...data, hero: {...data.hero, phone: v}})} />
              <Input label="Teléfono Visible" value={data.contact.displayPhone} onChange={v => setData({...data, contact: {...data.contact, displayPhone: v}})} />
              <Input label="Dirección Completa" value={data.contact.address} onChange={v => setData({...data, contact: {...data.contact, address: v}})} />
            </div>
          </Modal>
        )}

        {activeModal === 'hours' && (
          <Modal title="Editar Horarios">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Lunes" value={data.contact.monday} onChange={v => setData({...data, contact: {...data.contact, monday: v}})} />
              <Input label="Martes" value={data.contact.tuesday} onChange={v => setData({...data, contact: {...data.contact, tuesday: v}})} />
              <Input label="Miércoles" value={data.contact.wednesday} onChange={v => setData({...data, contact: {...data.contact, wednesday: v}})} />
              <Input label="Jueves" value={data.contact.thursday} onChange={v => setData({...data, contact: {...data.contact, thursday: v}})} />
              <Input label="Viernes" value={data.contact.friday} onChange={v => setData({...data, contact: {...data.contact, friday: v}})} />
              <Input label="Sábado" value={data.contact.saturday} onChange={v => setData({...data, contact: {...data.contact, saturday: v}})} />
              <div className="sm:col-span-2">
                <Input label="Domingo" value={data.contact.sunday} onChange={v => setData({...data, contact: {...data.contact, sunday: v}})} />
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

const AdminCard = ({ title, subtitle, onClick }) => (
  <button onClick={onClick} className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:border-accent-green hover:-translate-y-1 transition-all text-left group w-full">
    <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl mb-4 group-hover:bg-accent-green group-hover:border-accent-green transition-colors flex items-center justify-center text-gray-400 group-hover:text-white">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
    </div>
    <h4 className="text-xl font-black tracking-tight text-text-main">{title}</h4>
    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{subtitle}</p>
  </button>
);

const Input = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <span className="text-xs font-black uppercase text-text-main ml-2">{label}</span>
    <input className="w-full bg-white border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 ring-accent-green font-bold text-text-main" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);