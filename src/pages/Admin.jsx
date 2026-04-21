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

const Input = ({ label, value, onChange, placeholder }) => (
  <div className="space-y-2">
    <span className="text-xs font-black uppercase text-text-main ml-2">{label}</span>
    <input 
      className="w-full bg-white border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 ring-accent-green font-bold text-text-main" 
      value={value} 
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
    />
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
          if (!resData.contact.email) resData.contact.email = '';
          if (!resData.contact.instagram) resData.contact.instagram = '';
          if (!resData.contact.facebook) resData.contact.facebook = '';
          if (!resData.contact.mapUrl) resData.contact.mapUrl = '';
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
      } else {
        showToast('Error al guardar los cambios', 'error');
      }
    } catch (error) {
      showToast('Hubo un error de conexión', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleMapUrlExtraction = (inputValue) => {
    let finalUrl = inputValue;
    if (inputValue.includes('<iframe')) {
      const match = inputValue.match(/src="([^"]+)"/);
      if (match && match[1]) {
        finalUrl = match[1];
      }
    }
    setData({...data, contact: {...data.contact, mapUrl: finalUrl}});
  };

  const handleAddGalleryItem = () => {
    if (!newGalImg) return;
    setUploading(true);
    const preview = URL.createObjectURL(newGalImg);
    setData({
      ...data,
      gallery: [...data.gallery, { file: newGalImg, title: newGalTitle, preview }]
    });
    setNewGalImg(null);
    setNewGalTitle('');
    setUploading(false);
    showToast('Imagen agregada a la cola', 'success');
  };

  const handleRemoveGalleryItem = (index) => {
    const removed = data.gallery[index];
    if (removed.url) {
      setDeletedImages([...deletedImages, removed.url]);
    }
    const newGallery = data.gallery.filter((_, i) => i !== index);
    setData({ ...data, gallery: newGallery });
    showToast('Imagen eliminada', 'info');
  };

  const handleCloseModal = () => {
    setActiveModal(null);
    setImageFile(null);
    setLogoFile(null);
    setNewGalImg(null);
    setNewGalTitle('');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center p-6 font-sans">
        <form onSubmit={handleLogin} className="bg-white p-12 rounded-[3rem] shadow-xl max-w-md w-full space-y-8 border border-gray-200">
          <div className="flex flex-col items-center justify-center space-y-4">
            <img src={defaultLogo} alt="Logo" className="h-20 w-auto object-contain" />
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

  const currentLogoDisplay = logoFile ? URL.createObjectURL(logoFile) : (data.hero.logo || defaultLogo);

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-12 font-sans pb-40">
      
      {toast && (
        <div className={`fixed top-10 left-1/2 -translate-x-1/2 z-[300] px-6 py-4 rounded-full shadow-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-10 fade-in duration-300 ${toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-text-main text-white'}`}>
          {toast.type === 'success' && <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
          {toast.type === 'info' && <svg className="w-5 h-5 text-accent-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          {toast.type === 'error' && <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
          {toast.message}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-200">
          <div className="flex items-center gap-6">
            <img src={data.hero.logo || defaultLogo} alt="Logo Admin" className="h-16 w-auto object-contain hidden md:block" />
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
          <AdminCard title="Cabecera, Hero y Logo" subtitle="Nombre, Terapia y Logo Principal" onClick={() => setActiveModal('hero')} />
          <AdminCard title="Sobre Mí" subtitle="Enfoque y Objetivo" onClick={() => setActiveModal('about')} />
          <AdminCard title="Servicios" subtitle="Lista Individual" onClick={() => setActiveModal('services')} />
          <AdminCard title="Tarifas" subtitle="Precios y Promociones" onClick={() => setActiveModal('pricing')} />
          <AdminCard title="Contacto y Mapa" subtitle="Teléfono, Redes y Ubicación" onClick={() => setActiveModal('contact')} />
          <AdminCard title="Horarios" subtitle="Disponibilidad Diaria" onClick={() => setActiveModal('hours')} />
          <AdminCard title="Galería de Fotos" subtitle="Añadir o Quitar Imágenes" onClick={() => setActiveModal('gallery')} />
        </div>

        {activeModal === 'hero' && (
          <Modal title="Editar Inicio" onClose={handleCloseModal} onSave={saveChanges} saving={saving}>
            <div className="space-y-6">
              
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-text-main ml-2">Logo Principal del Sitio</span>
                <div className="relative w-full h-40 bg-gray-50 border-2 border-dashed border-gray-300 rounded-[2rem] flex flex-col items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors group">
                  <img src={currentLogoDisplay} className="w-full h-full object-contain p-4 group-hover:opacity-40 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="bg-text-main text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl">Reemplazar Logo</span>
                  </div>
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={e => setLogoFile(e.target.files[0])} />
                </div>
              </div>

              <Input label="Nombre Profesional" value={data.hero.name} onChange={v => setData({...data, hero: {...data.hero, name: v}})} />
              <Input label="Título de Subtítulo" value={data.hero.subtitle} onChange={v => setData({...data, hero: {...data.hero, subtitle: v}})} />
              <Input label="Propuesta de Terapia" value={data.hero.therapy} onChange={v => setData({...data, hero: {...data.hero, therapy: v}})} />
            </div>
          </Modal>
        )}

        {activeModal === 'about' && (
          <Modal title="Editar Especialista" onClose={handleCloseModal} onSave={saveChanges} saving={saving}>
            <div className="space-y-4">
              <Input label="Enfoque Clínico" value={data.about.approach} onChange={v => setData({...data, about: {...data.about, approach: v}})} />
              <Input label="Objetivo" value={data.about.objective} onChange={v => setData({...data, about: {...data.about, objective: v}})} />
              <Input label="Público Objetivo" value={data.about.target} onChange={v => setData({...data, about: {...data.about, target: v}})} />
              
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-text-main ml-2">Imagen Principal (Opcional)</span>
                <div className="relative w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-[2rem] flex flex-col items-center justify-center overflow-hidden hover:bg-gray-100 transition-colors group">
                  {(imageFile || data.hero.image) ? (
                    <>
                      <img src={imageFile ? URL.createObjectURL(imageFile) : data.hero.image} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-text-main text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl">Reemplazar Imagen</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-2">
                      <div className="bg-white border border-gray-200 text-text-main px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-sm">Seleccionar Archivo</div>
                      <p className="text-xs font-bold text-gray-400">JPG, PNG o WEBP</p>
                    </div>
                  )}
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
                </div>
              </div>
            </div>
          </Modal>
        )}

        {activeModal === 'services' && (
          <Modal title="Editar Especialidades" onClose={handleCloseModal} onSave={saveChanges} saving={saving}>
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
                      showToast('Servicio eliminado', 'info');
                    }}
                    className="bg-red-50 border border-red-200 text-red-600 w-14 h-14 flex items-center justify-center rounded-xl font-black text-xl hover:bg-red-100 transition-colors shrink-0"
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
          <Modal title="Editar Tarifas" onClose={handleCloseModal} onSave={saveChanges} saving={saving}>
            <div className="grid grid-cols-2 gap-6">
              <Input label="Precio Regular" value={data.pricing.regular} onChange={v => setData({...data, pricing: {...data.pricing, regular: v}})} />
              <Input label="Precio Promoción" value={data.pricing.promo} onChange={v => setData({...data, pricing: {...data.pricing, promo: v}})} />
            </div>
          </Modal>
        )}

        {activeModal === 'contact' && (
          <Modal title="Editar Contacto y Mapa" onClose={handleCloseModal} onSave={saveChanges} saving={saving}>
            <div className="space-y-4">
              <Input label="WhatsApp (Solo números)" value={data.hero.phone} onChange={v => setData({...data, hero: {...data.hero, phone: v}})} />
              <Input label="Teléfono Visible" value={data.contact.displayPhone} onChange={v => setData({...data, contact: {...data.contact, displayPhone: v}})} />
              <Input label="Dirección Completa" value={data.contact.address} onChange={v => setData({...data, contact: {...data.contact, address: v}})} />
              <Input label="Correo Electrónico" value={data.contact.email} onChange={v => setData({...data, contact: {...data.contact, email: v}})} />
              <Input label="Instagram (URL o usuario sin @)" value={data.contact.instagram} onChange={v => setData({...data, contact: {...data.contact, instagram: v}})} />
              <Input label="Facebook (URL completa)" value={data.contact.facebook} onChange={v => setData({...data, contact: {...data.contact, facebook: v}})} />
              <div className="space-y-2">
                <span className="text-xs font-black uppercase text-text-main ml-2">Mapa (Pega el código iframe de Google Maps aquí)</span>
                <p className="text-xs text-gray-500 ml-2 mb-2">Simplemente pega el código que te da Google Maps al "Compartir > Incorporar un mapa". El sistema se encargará del resto.</p>
                <textarea 
                  className="w-full bg-white border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 ring-accent-green font-bold text-text-main min-h-[100px]" 
                  value={data.contact.mapUrl} 
                  onChange={e => handleMapUrlExtraction(e.target.value)}
                  placeholder='<iframe src="..." ...></iframe>'
                />
              </div>
            </div>
          </Modal>
        )}

        {activeModal === 'hours' && (
          <Modal title="Editar Horarios" onClose={handleCloseModal} onSave={saveChanges} saving={saving}>
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

        {activeModal === 'gallery' && (
          <Modal title="Gestor de Galería" onClose={handleCloseModal} onSave={saveChanges} saving={saving}>
            <div className="space-y-8">
              <div className="bg-gray-50 border border-gray-200 p-6 rounded-[2rem] space-y-4">
                <h4 className="font-black uppercase tracking-widest text-xs text-text-main">Añadir nueva imagen</h4>
                <div className="flex flex-col gap-4">
                  <input 
                    type="text" 
                    placeholder="Título (Opcional)" 
                    className="w-full bg-white border border-gray-300 p-4 rounded-xl outline-none focus:ring-2 ring-accent-green font-bold text-sm text-text-main" 
                    value={newGalTitle} 
                    onChange={e => setNewGalTitle(e.target.value)} 
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex-1 cursor-pointer bg-white border border-gray-300 p-4 rounded-xl text-sm font-bold text-gray-500 hover:border-accent-green transition-colors">
                      {newGalImg ? newGalImg.name : "Seleccionar archivo..."}
                      <input type="file" accept="image/*" className="hidden" onChange={e => setNewGalImg(e.target.files[0])} />
                    </label>
                    <button 
                      onClick={handleAddGalleryItem} 
                      disabled={uploading || !newGalImg}
                      className="bg-text-main text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
                    >
                      {uploading ? 'Cargando...' : 'Agregar'}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-black uppercase tracking-widest text-xs text-gray-500 mb-4">Imágenes Actuales en Lista</h4>
                {data.gallery.length === 0 ? (
                  <p className="text-sm font-bold text-gray-400 border-2 border-dashed border-gray-200 p-8 text-center rounded-2xl">La galería está vacía.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {data.gallery.map((img, i) => (
                      <div key={i} className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm aspect-square flex flex-col">
                        <img src={img.url || img.preview} alt={img.title} className="w-full h-full object-cover flex-1" />
                        {img.title && (
                          <div className="absolute bottom-0 w-full p-2 bg-black/60 backdrop-blur-sm">
                            <p className="text-[10px] font-bold text-white truncate">{img.title}</p>
                          </div>
                        )}
                        <button onClick={() => handleRemoveGalleryItem(i)} className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-black opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 shadow-lg">
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}