import { useState, useEffect } from 'react';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (token) {
      fetch('/api/data')
        .then(res => {
          if (!res.ok) throw new Error('Network Error');
          return res.json();
        })
        .then(resData => {
          if (resData.error || !resData.hero) throw new Error('Data Invalid');
          setData(resData);
        })
        .catch(() => setError(true));
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem('token', token);
      setToken(token);
    } else {
      alert('Credenciales incorrectas');
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return data.hero.image;
    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'tu_cloudinary_preset');
    const res = await fetch('https://api.cloudinary.com/v1_1/tu_cloud_name/image/upload', {
      method: 'POST',
      body: formData
    });
    const result = await res.json();
    return result.secure_url;
  };

  const handleSave = async () => {
    setSaving(true);
    const imageUrl = await uploadImage();
    const updatedData = { ...data, hero: { ...data.hero, image: imageUrl } };
    
    await fetch('/api/data', {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });
    setData(updatedData);
    setSaving(false);
    alert('Guardado correctamente');
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Admin Login</h2>
          <input type="text" placeholder="Usuario" className="border p-2 rounded" value={username} onChange={e => setUsername(e.target.value)} />
          <input type="password" placeholder="Contraseña" className="border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="bg-text-main text-white py-2 rounded">Entrar</button>
        </form>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-red-600 font-bold text-2xl">Error de Base de Datos</h2>
        <button onClick={() => {localStorage.removeItem('token'); setToken(null)}} className="mt-4 bg-text-main text-white px-4 py-2 rounded">Volver al Login</button>
      </div>
    );
  }

  if (!data) return <div className="p-10 text-center font-bold text-xl">Cargando datos...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white my-10 rounded-xl shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Editor de Contenido</h1>
        <button onClick={handleSave} disabled={saving} className="bg-whatsapp text-white px-6 py-2 rounded-lg font-bold">
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div className="space-y-4 border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-bold">Hero</h2>
        <input className="w-full border p-2" value={data.hero.name} onChange={e => setData({...data, hero: {...data.hero, name: e.target.value}})} />
        <input className="w-full border p-2" value={data.hero.subtitle} onChange={e => setData({...data, hero: {...data.hero, subtitle: e.target.value}})} />
        <input className="w-full border p-2" value={data.hero.therapy} onChange={e => setData({...data, hero: {...data.hero, therapy: e.target.value}})} />
        <input className="w-full border p-2" placeholder="Teléfono para WhatsApp" value={data.hero.phone} onChange={e => setData({...data, hero: {...data.hero, phone: e.target.value}})} />
        <input type="file" onChange={e => setImageFile(e.target.files[0])} className="w-full border p-2" />
      </div>

      <div className="space-y-4 border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-bold">Sobre el Especialista</h2>
        <input className="w-full border p-2" value={data.about.education} onChange={e => setData({...data, about: {...data.about, education: e.target.value}})} />
        <input className="w-full border p-2" value={data.about.approach} onChange={e => setData({...data, about: {...data.about, approach: e.target.value}})} />
        <input className="w-full border p-2" value={data.about.objective} onChange={e => setData({...data, about: {...data.about, objective: e.target.value}})} />
        <input className="w-full border p-2" value={data.about.target} onChange={e => setData({...data, about: {...data.about, target: e.target.value}})} />
      </div>

      <div className="space-y-4 border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-bold">Servicios (Separados por coma)</h2>
        <textarea 
          className="w-full border p-2 h-24" 
          value={data.services.join(', ')} 
          onChange={e => setData({...data, services: e.target.value.split(',').map(s => s.trim())})} 
        />
      </div>

      <div className="space-y-4 border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-bold">Precios</h2>
        <input className="w-full border p-2" placeholder="Promo" value={data.pricing.promo} onChange={e => setData({...data, pricing: {...data.pricing, promo: e.target.value}})} />
        <input className="w-full border p-2" placeholder="Regular" value={data.pricing.regular} onChange={e => setData({...data, pricing: {...data.pricing, regular: e.target.value}})} />
      </div>

      <div className="space-y-4 border p-4 rounded bg-gray-50">
        <h2 className="text-xl font-bold">Contacto</h2>
        <input className="w-full border p-2" value={data.contact.displayPhone} onChange={e => setData({...data, contact: {...data.contact, displayPhone: e.target.value}})} />
        <textarea className="w-full border p-2" value={data.contact.address} onChange={e => setData({...data, contact: {...data.contact, address: e.target.value}})} />
        <input className="w-full border p-2" value={data.contact.hoursWeekday} onChange={e => setData({...data, contact: {...data.contact, hoursWeekday: e.target.value}})} />
        <input className="w-full border p-2" value={data.contact.hoursSaturday} onChange={e => setData({...data, contact: {...data.contact, hoursSaturday: e.target.value}})} />
        <input className="w-full border p-2" value={data.contact.hoursSunday} onChange={e => setData({...data, contact: {...data.contact, hoursSunday: e.target.value}})} />
      </div>
    </div>
  );
}