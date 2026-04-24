import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultLogo from '../assets/logopsichort.jpeg';

const Modal = ({ title, onClose, onSave, saving, children }) => (
  <div className="fixed inset-0 bg-text-main/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
    <div className="bg-white w-full max-w-4xl rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
      <div className="p-6 md:p-8 border-b border-gray-200 flex justify-between items-center bg-gray-50">
        <h3 className="text-2xl font-black text-text-main">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-red-600 font-black text-sm uppercase tracking-widest px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200">Cerrar</button>
      </div>
      <div className="p-6 md:p-10 space-y-6 max-h-[65vh] overflow-y-auto">
        {children}
      </div>
      <div className="p-6 md:p-8 bg-gray-50 border-t border-gray-200 flex justify-end gap-4">
        <button onClick={onClose} className="px-6 py-3 font-black text-gray-500 hover:text-text-main">Cancelar</button>
        <button onClick={onSave} disabled={saving} className="bg-accent-green text-white px-8 py-3 rounded-xl font-black text-sm uppercase tracking-widest shadow-md hover:bg-green-600 disabled:opacity-50">
          {saving ? 'Procesando...' : 'Aplicar Cambios'}
        </button>
      </div>
    </div>
  </div>
);

const AdminCard = ({ title, subtitle, onClick }) => (
  <button onClick={onClick} className="bg-white p-8 rounded-[2rem] border border-gray-200 shadow-sm hover:shadow-xl hover:border-accent-green hover:-translate-y-1 transition-all text-left group w-full">
    <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl mb-4 group-hover:bg-accent-green group-hover:border-accent-green transition-colors flex items-center justify-center text-gray-400 group-hover:text-white">
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
    </div>
    <h4 className="text-xl font-black tracking-tight text-text-main">{title}</h4>
    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{subtitle}</p>
  </button>
);

const Input = ({ label, value, onChange, placeholder, isTextArea }) => (
  <div className="space-y-2">
    <span className="text-xs font-black uppercase text-text-main ml-2">{label}</span>
    {isTextArea ? (
      <textarea 
        className="w-full bg-white border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 ring-accent-green font-bold text-text-main min-h-[100px]" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    ) : (
      <input 
        className="w-full bg-white border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 ring-accent-green font-bold text-text-main" 
        value={value} 
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
  </div>
);

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [data, setData] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newGalImg, setNewGalImg] = useState(null);
  const [newGalTitle, setNewGalTitle] = useState('');
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      fetch('/api/data')
        .then(res => res.json())
        .then(resData => {
          if (!resData.gallery) resData.gallery = [];
          setData(resData);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        });
    }
  }, [token]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

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

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'psicologo_web'); 
    const res = await fetch('https://api.cloudinary.com/v1_1/do0tzxctb/image/upload', {
      method: 'POST',
      body: formData
    });
    const json = await res.json();
    return json.secure_url;
  };

  const saveChanges = async () => {
    setSaving(true);
    let currentImage = data.hero.image;
    let currentLogo = data.hero.logo;
    let pendingDeletes = [...deletedImages];
    try {
      if (imageFile) {
        if (currentImage) pendingDeletes.push(currentImage);
        currentImage = await uploadToCloudinary(imageFile);
      }
      if (logoFile) {
        if (currentLogo) pendingDeletes.push(currentLogo);
        currentLogo = await uploadToCloudinary(logoFile);
      }
      const finalGallery = [];
      for (const item of data.gallery) {
        if (item.file) {
          const url = await uploadToCloudinary(item.file);
          finalGallery.push({ url, title: item.title });
        } else {
          finalGallery.push({ url: item.url, title: item.title });
        }
      }
      const payload = { 
        ...data, 
        hero: { ...data.hero, image: currentImage, logo: currentLogo },
        gallery: finalGallery,
        deletedImages: pendingDeletes
      };
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
        setActiveModal(null);
        setImageFile(null);
        setLogoFile(null);
        setDeletedImages([]);
        showToast('Cambios guardados exitosamente', 'success');
      }
    } catch (error) {
      showToast('Hubo un error', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setImageFile(null);
    setLogoFile(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 font-sans">
        <form onSubmit={handleLogin} className="bg-white p-12 rounded-[3rem] shadow-xl max-w-md w-full space-y-8 border border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-4">
            <img src={defaultLogo} alt="Logo" className="h-20 w-auto object-contain" />
            <h2 className="text-3xl font-black text-text-main tracking-tight">Acceso Admin</h2>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Usuario" className="w-full bg-gray-50 border border-gray-200 p-5 rounded-2xl focus:ring-2 ring-accent-green outline-none font-bold text-text-main" value={credentials.username} onChange={e => setCredentials({...credentials, username: e.target.value})} />
            <input type="password" placeholder="Contraseña" className="w-full bg-gray-50 border border-gray-200 p-5 rounded-2xl focus:ring-2 ring-accent-green outline-none font-bold text-text-main" value={credentials.password} onChange={e => setCredentials({...credentials, password: e.target.value})} />
          </div>
          <button className="w-full bg-text-main text-white py-5 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all">Ingresar</button>
        </form>
      </div>
    );
  }

  if (!data) return null;
  const currentLogoDisplay = logoFile ? URL.createObjectURL(logoFile) : (data.hero.logo || defaultLogo);

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12 font-sans pb-40">
      {toast && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[300] px-6 py-4 rounded-full shadow-2xl font-black text-sm uppercase bg-text-main text-white animate-in slide-in-from-top-10 duration-300">
          {toast.message}
        </div>
      )}
      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-200">
          <h1 className="text-3xl font-black text-text-main">Dashboard Administrativo</h1>
          <button onClick={() => {localStorage.removeItem('token'); setToken(null); navigate('/')}} className="bg-red-50 text-red-600 px-6 py-3 rounded-xl font-black text-xs uppercase border border-red-200">Cerrar Sesión</button>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard title="Textos Principales" subtitle="Títulos y Descripción" onClick={() => setActiveModal('hero')} />
          <AdminCard title="Imagen y Objetivos" subtitle="Foto y Texto Informativo" onClick={() => setActiveModal('about')} />
          <AdminCard title="Especialidades" subtitle="Lista de Servicios" onClick={() => setActiveModal('services')} />
          <AdminCard title="Contacto" subtitle="Teléfono y Ubicación" onClick={() => setActiveModal('contact')} />
          <AdminCard title="Horarios" subtitle="Disponibilidad" onClick={() => setActiveModal('hours')} />
          <AdminCard title="Galería" subtitle="Fotos Instalaciones" onClick={() => setActiveModal('gallery')} />
        </div>

        {activeModal === 'hero' && (
          <Modal title="Editar Textos Principales" onClose={handleCloseModal} onSave={saveChanges} saving={saving}>
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-text-main ml-2">Logo Principal</span>
                <div className="relative w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-[2rem] flex items-center justify-center overflow-hidden">
                  <img src={currentLogoDisplay} className="h-full object-contain p-4" />
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setLogoFile(e.target.files[0])} />
                </div>
              </div>
              <Input label="Título Línea 1" value={data.hero.titleMain} onChange={v => setData({...data, hero: {...data.hero, titleMain: v}})} />
              <Input label="Título Línea 2 (Verde)" value={data.hero.titleItalic} onChange={v => setData({...data, hero: {...data.hero, titleItalic: v}})} />
              <Input label="Descripción Destacada (Abajo de botones)" value={data.hero.description} onChange={v => setData({...data, hero: {...data.hero, description: v}})} isTextArea />
              <Input label="Nombre Profesional" value={data.hero.name} onChange={v => setData({...data, hero: {...data.hero, name: v}})} />
            </div>
          </Modal>
        )}

        {activeModal === 'about' && (
          <Modal title="Editar Imagen y Objetivos" onClose={handleCloseModal} onSave={saveChanges} saving={saving}>
            <div className="space-y-6">
              <Input label="Objetivo General" value={data.about.objective} onChange={v => setData({...data, about: {...data.about, objective: v}})} isTextArea />
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-text-main ml-2">Imagen de Consultorio</span>
                <div className="relative w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-[2rem] flex items-center justify-center overflow-hidden">
                  <img src={imageFile ? URL.createObjectURL(imageFile) : data.hero.image} className="w-full h-full object-cover" />
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setImageFile(e.target.files[0])} />
                </div>
              </div>
            </div>
          </Modal>
        )}

        {activeModal === 'services' && (
          <Modal title="Editar Especialidades" onClose={handleCloseModal} onSave={saveChanges} saving={saving}>
            <div className="space-y-4">
              {data.services.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input className="flex-1 bg-white border border-gray-300 p-4 rounded-xl font-bold" value={s} onChange={e => {
                    const n = [...data.services]; n[i] = e.target.value; setData({...data, services: n});
                  }} />
                  <button onClick={() => setData({...data, services: data.services.filter((_, idx) => idx !== i)})} className="bg-red-50 text-red-600 w-14 rounded-xl font-black">×</button>
                </div>
              ))}
              <button onClick={() => setData({...data, services: [...data.services, 'Nueva Especialidad']})} className="w-full bg-accent-green/10 text-accent-green py-4 rounded-xl font-black uppercase">+ Añadir</button>
            </div>
          </Modal>
        )}

        {activeModal === 'contact' && (
          <Modal title="Editar Contacto" onClose={handleCloseModal} onSave={saveChanges} saving={saving}>
            <div className="space-y-4">
              <Input label="WhatsApp (Solo números)" value={data.hero.phone} onChange={v => setData({...data, hero: {...data.hero, phone: v}})} />
              <Input label="Teléfono Visible" value={data.contact.displayPhone} onChange={v => setData({...data, contact: {...data.contact, displayPhone: v}})} />
              <Input label="Dirección" value={data.contact.address} onChange={v => setData({...data, contact: {...data.contact, address: v}})} />
              <Input label="Google Maps (Iframe)" value={data.contact.mapUrl} onChange={v => setData({...data, contact: {...data.contact, mapUrl: v}})} isTextArea />
            </div>
          </Modal>
        )}

        {activeModal === 'hours' && (
          <Modal title="Editar Horarios" onClose={handleCloseModal} onSave={saveChanges} saving={saving}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                <Input key={day} label={day} value={data.contact[day]} onChange={v => setData({...data, contact: {...data.contact, [day]: v}})} />
              ))}
            </div>
          </Modal>
        )}

        {activeModal === 'gallery' && (
          <Modal title="Galería" onClose={handleCloseModal} onSave={saveChanges} saving={saving}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {data.gallery.map((img, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden border">
                    <img src={img.url || img.preview} className="w-full h-full object-cover" />
                    <button onClick={() => {
                      if (img.url) setDeletedImages([...deletedImages, img.url]);
                      setData({...data, gallery: data.gallery.filter((_, idx) => idx !== i)});
                    }} className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full">×</button>
                  </div>
                ))}
              </div>
              <input type="file" onChange={e => {
                const f = e.target.files[0];
                setData({...data, gallery: [...data.gallery, { file: f, preview: URL.createObjectURL(f) }]});
              }} />
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}