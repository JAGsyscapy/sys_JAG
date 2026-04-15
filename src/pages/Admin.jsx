import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
      formData.append('upload_preset', 'tu_cloudinary_preset');
      const resImg = await fetch('https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload', {
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
        <form onSubmit={handleLogin} className="bg-white p-12 rounded-[3rem] shadow-2xl max-w-md w-full space-y-8 border border-text-main/5">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-text-main tracking-tighter">Acceso Admin</h2>
            <p className="text-xs font-bold text-text-main/30 uppercase tracking-widest">Gestión de Contenidos</p>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Usuario" className="w-full bg-bg-main/50 border-none p-5 rounded-2xl focus:ring-2 ring-accent-green transition-all outline-none font-bold" value={credentials.username} onChange={e => setCredentials({...credentials, username: e.target.value})} />
            <input type="password" placeholder="Contraseña" className="w-full bg-bg-main/50 border-none p-5 rounded-2xl focus:ring-2 ring-accent-green transition-all outline-none font-bold" value={credentials.password} onChange={e => setCredentials({...credentials, password: e.target.value})} />
          </div>
          <button className="w-full bg-text-main text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-xl active:scale-95 transition-all">
            Ingresar al Sistema
          </button>
        </form>
      </div>
    );
  }

  if (!data) return null;

  const Modal = ({ title, children }) => (
    <div className="fixed inset-0 bg-text-main/40 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-200">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-2xl font-black tracking-tight">{title}</h3>
          <button onClick={() => setActiveModal(null)} className="text-gray-400 hover:text-red-500 font-bold">Cerrar</button>
        </div>
        <div className="p-10 space-y-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        <div className="p-8 bg-gray-50 flex justify-end gap-4">
          <button onClick={() => setActiveModal(null)} className="px-6 py-3 font-bold text-gray-400">Cancelar</button>
          <button onClick={saveChanges} disabled={saving} className="bg-accent-green text-white px-10 py-3 rounded-2xl font-black text-xs uppercase tracking-widest disabled:opacity-50">
            {saving ? 'Guardando...' : 'Aplicar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-12 font-sans pb-40">
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-text-main tracking-tighter italic">Dashboard Administrativo</h1>
            <p className="text-xs font-bold text-text-main/30 uppercase tracking-[0.3em] mt-1">Gestión de datos en tiempo real</p>
          </div>
          <button onClick={() => {localStorage.removeItem('token'); setToken(null); navigate('/')}} className="bg-white text-red-500 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest border border-red-50 border-b-4 hover:border-b-2 transition-all">
            Cerrar Sesión
          </button>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard title="Cabecera y Hero" subtitle="Nombre y Terapia" onClick={() => setActiveModal('hero')} />
          <AdminCard title="Sobre Mí" subtitle="Formación y Enfoque" onClick={() => setActiveModal('about')} />
          <AdminCard title="Servicios" subtitle="Lista de Especialidades" onClick={() => setActiveModal('services')} />
          <AdminCard title="Tarifas" subtitle="Precios y Promociones" onClick={() => setActiveModal('pricing')} />
          <AdminCard title="Contacto" subtitle="Teléfono y Dirección" onClick={() => setActiveModal('contact')} />
          <AdminCard title="Horarios" subtitle="Días y Horas" onClick={() => setActiveModal('hours')} />
        </div>

        {activeModal === 'hero' && (
          <Modal title="Editar Inicio">
            <div className="space-y-4">
              <Input label="Nombre Profesional" value={data.hero.name} onChange={v => setData({...data, hero: {...data.hero, name: v}})} />
              <Input label="Título de Subtítulo" value={data.hero.subtitle} onChange={v => setData({...data, hero: {...data.hero, subtitle: v}})} />
              <Input label="Propuesta de Terapia" value={data.hero.therapy} onChange={v => setData({...data, hero: {...data.hero, therapy: v}})} />
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase text-gray-400 ml-2">Imagen Hero</span>
                <input type="file" className="w-full text-sm file:bg-bg-main file:border-none file:rounded-xl file:px-4 file:py-2 file:font-bold" onChange={e => setImageFile(e.target.files[0])} />
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
          <Modal title="Editar Servicios">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-gray-400 ml-2">Especialidades (Separadas por comas)</span>
              <textarea className="w-full bg-gray-50 p-6 rounded-3xl min-h-[200px] outline-none font-bold" value={data.services.join(', ')} onChange={e => setData({...data, services: e.target.value.split(',').map(s => s.trim())})} />
            </div>
          </Modal>
        )}

        {activeModal === 'pricing' && (
          <Modal title="Editar Tarifas">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Precio Regular" value={data.pricing.regular} onChange={v => setData({...data, pricing: {...data.pricing, regular: v}})} />
              <Input label="Precio Promo" value={data.pricing.promo} onChange={v => setData({...data, pricing: {...data.pricing, promo: v}})} />
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
            <div className="space-y-4">
              <Input label="Lunes a Viernes" value={data.contact.hoursWeekday} onChange={v => setData({...data, contact: {...data.contact, hoursWeekday: v}})} />
              <Input label="Sábados" value={data.contact.hoursSaturday} onChange={v => setData({...data, contact: {...data.contact, hoursSaturday: v}})} />
              <Input label="Domingos" value={data.contact.hoursSunday} onChange={v => setData({...data, contact: {...data.contact, hoursSunday: v}})} />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}

const AdminCard = ({ title, subtitle, onClick }) => (
  <button onClick={onClick} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-accent-green/20 hover:-translate-y-1 transition-all text-left group">
    <div className="w-10 h-10 bg-bg-main rounded-xl mb-4 group-hover:bg-accent-green/10 transition-colors flex items-center justify-center text-accent-green">
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
    </div>
    <h4 className="text-lg font-black tracking-tight">{title}</h4>
    <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">{subtitle}</p>
  </button>
);

const Input = ({ label, value, onChange }) => (
  <div className="space-y-2">
    <span className="text-[10px] font-black uppercase text-gray-400 ml-2">{label}</span>
    <input className="w-full bg-gray-50 p-4 rounded-2xl outline-none focus:ring-2 ring-accent-green/20 font-bold" value={value} onChange={e => onChange(e.target.value)} />
  </div>
);