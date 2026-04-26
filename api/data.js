import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const defaultColors = {
  bgMain: '#E6EED6',
  textMain: '#4A3525',
  whatsapp: '#4CAF50',
  accentOrange: '#D96C42',
  accentYellow: '#E8B830',
  accentGreen: '#7AB539'
};

const defaultPrivacidad = {
  intro: "De conformidad con lo establecido en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, se pone a disposición el presente Aviso de Privacidad.",
  sections: [
    { title: "1. Identidad y domicilio del responsable", text: "El Centro de Atención Psicológica y Pedagógica de Querétaro, con domicilio en Querétaro, México, es responsable del uso y protección de sus datos personales." },
    { title: "2. Datos personales que se recaban", text: "Para llevar a cabo las finalidades descritas en este aviso, utilizaremos datos de identificación, contacto y, en su caso, datos sensibles relativos a su estado de salud mental, los cuales serán tratados con estricta confidencialidad." },
    { title: "3. Finalidades del tratamiento de datos", text: "Los datos personales que recabamos serán utilizados para proveer los servicios de atención psicológica solicitados, conformar su expediente clínico y contactarle para seguimiento de citas." },
    { title: "4. Medios para ejercer derechos ARCO", text: "Usted tiene derecho a conocer qué datos personales tenemos de usted, para qué los utilizamos y las condiciones del uso que les damos (Acceso). Asimismo, es su derecho solicitar la corrección de su información personal en caso de que esté desactualizada, sea inexacta o incompleta (Rectificación); que la eliminemos de nuestros registros o bases de datos cuando considere que la misma no está siendo utilizada conforme a los principios, deberes y obligaciones previstas en la normativa (Cancelación); así como oponerse al uso de sus datos personales para fines específicos (Oposición). Estos derechos se conocen como derechos ARCO." }
  ]
};

const defaultTerminos = {
  intro: "El acceso y uso de este sitio web y los servicios ofrecidos por el Centro de Atención Psicológica y Pedagógica de Querétaro están sujetos a los siguientes términos y condiciones.",
  sections: [
    { title: "1. Servicios", text: "Se ofrecen servicios de terapia psicológica presencial en Querétaro. La agenda de citas está sujeta a disponibilidad." },
    { title: "2. Cancelaciones y Reprogramaciones", text: "Toda cancelación o reprogramación de cita debe realizarse con al menos 24 horas de anticipación. De lo contrario, podrá generar el cobro total o parcial de la sesión programada." },
    { title: "3. Confidencialidad", text: "Toda la información compartida durante las sesiones es estrictamente confidencial y se rige bajo el secreto profesional y nuestro Aviso de Privacidad." },
    { title: "4. Pagos", text: "Los pagos deben realizarse previo a la sesión o al finalizar la misma, mediante los métodos de pago aceptados en el consultorio. Las tarifas promocionales están sujetas a cambios sin previo aviso." }
  ]
};

const deleteCloudinaryImage = async (url) => {
  try {
    const parts = url.split('/upload/');
    if (parts.length < 2) return;
    const fileWithExt = parts[1].split('/').slice(1).join('/');
    const publicId = fileWithExt.substring(0, fileWithExt.lastIndexOf('.'));
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) return;
    const auth = Buffer.from(apiKey + ':' + apiSecret).toString('base64');
    await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ public_ids: [publicId] })
    });
  } catch (e) {}
};

// Función de seguridad para procesar el JSON legal y evitar el Error 500
const parseSafeLegal = (dbData, fallbackData) => {
  if (!dbData) return fallbackData;
  try {
    return JSON.parse(dbData);
  } catch (e) {
    // Si falla el parseo, significa que hay texto plano antiguo. Lo convertimos a la nueva estructura.
    return { intro: dbData, sections: [] };
  }
};

export default async function handler(req, res) {
  try {
    await pool.query('ALTER TABLE professional ADD COLUMN IF NOT EXISTS about_title TEXT');
    await pool.query('ALTER TABLE professional ADD COLUMN IF NOT EXISTS about_title_highlight TEXT');
    await pool.query('ALTER TABLE professional ADD COLUMN IF NOT EXISTS about_subtitle TEXT');
    await pool.query('ALTER TABLE professional ADD COLUMN IF NOT EXISTS about_caption TEXT');
    await pool.query('ALTER TABLE professional ADD COLUMN IF NOT EXISTS acompanamiento TEXT');
    await pool.query('ALTER TABLE professional ADD COLUMN IF NOT EXISTS site_colors TEXT');
    await pool.query('ALTER TABLE professional ADD COLUMN IF NOT EXISTS privacidad TEXT');
    await pool.query('ALTER TABLE professional ADD COLUMN IF NOT EXISTS terminos TEXT');
  } catch(e) {}

  if (req.method === 'GET') {
    try {
      const profRes = await pool.query('SELECT * FROM professional WHERE id = 1');
      const prof = profRes.rows[0];

      const servRes = await pool.query('SELECT name FROM service WHERE professional_id = 1');
      const services = servRes.rows.map(row => row.name);

      const contactRes = await pool.query('SELECT * FROM contact WHERE professional_id = 1');
      const contact = contactRes.rows[0];

      const galleryRes = await pool.query('SELECT url, title FROM gallery WHERE professional_id = 1');
      const gallery = galleryRes.rows;

      const responseData = {
        hero: {
          name: prof.name,
          subtitle: prof.subtitle,
          therapy: prof.therapy,
          phone: prof.phone,
          image: prof.image,
          logo: prof.logo,
          titleMain: prof.title_main || 'Encuentra el equilibrio',
          titleItalic: prof.title_italic || 'que necesitas.'
        },
        about: {
          education: prof.education,
          approach: prof.approach,
          objective: prof.objective,
          target: prof.target,
          title: prof.about_title || 'Atención profesional',
          titleHighlight: prof.about_title_highlight || 'con enfoque humano.',
          subtitle: prof.about_subtitle || 'Sesiones virtuales y presencial',
          caption: prof.about_caption || 'UNAM'
        },
        services: services,
        acompanamiento: prof.acompanamiento ? JSON.parse(prof.acompanamiento) : ['Adolescentes', 'Adultos', 'Parejas'],
        colors: prof.site_colors ? JSON.parse(prof.site_colors) : defaultColors,
        contact: {
          displayPhone: contact.display_phone,
          address: contact.address,
          email: contact.email || '',
          instagram: contact.instagram || '',
          facebook: contact.facebook || '',
          mapUrl: contact.map_url || '',
          monday: contact.monday,
          tuesday: contact.tuesday,
          wednesday: contact.wednesday,
          thursday: contact.thursday,
          friday: contact.friday,
          saturday: contact.saturday,
          sunday: contact.sunday
        },
        gallery: gallery,
        legal: {
          privacidad: parseSafeLegal(prof.privacidad, defaultPrivacidad),
          terminos: parseSafeLegal(prof.terminos, defaultTerminos)
        }
      };

      return res.status(200).json(responseData);
    } catch (error) {
      console.error(error); // Imprimir el error exacto en los logs del servidor
      return res.status(500).json({ error: 'Database error' });
    }
  }

  if (req.method === 'PUT') {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;
      if (!authHeader) return res.status(401).json({ error: 'Unauthorized' });

      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET);

      const newData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const client = await pool.connect();

      try {
        await client.query('BEGIN');

        await client.query(`
          UPDATE professional SET
          name = $1, subtitle = $2, therapy = $3, phone = $4, image = $5,
          education = $6, approach = $7, objective = $8, target = $9, logo = $10,
          title_main = $11, title_italic = $12, about_title = $13, about_title_highlight = $14,
          about_subtitle = $15, about_caption = $16, acompanamiento = $17, site_colors = $18,
          privacidad = $19, terminos = $20
          WHERE id = 1
        `, [
          newData.hero.name, newData.hero.subtitle, newData.hero.therapy, newData.hero.phone, newData.hero.image,
          newData.about.education, newData.about.approach, newData.about.objective, newData.about.target, newData.hero.logo,
          newData.hero.titleMain, newData.hero.titleItalic, newData.about.title, newData.about.titleHighlight,
          newData.about.subtitle, newData.about.caption, JSON.stringify(newData.acompanamiento), JSON.stringify(newData.colors),
          JSON.stringify(newData.legal.privacidad), JSON.stringify(newData.legal.terminos)
        ]);

        await client.query('DELETE FROM service WHERE professional_id = 1');
        for (const s of newData.services) {
          if (s) await client.query('INSERT INTO service (professional_id, name) VALUES (1, $1)', [s]);
        }

        await client.query('DELETE FROM gallery WHERE professional_id = 1');
        if (newData.gallery && newData.gallery.length > 0) {
          for (const item of newData.gallery) {
            if (item.url) {
              await client.query('INSERT INTO gallery (professional_id, url, title) VALUES (1, $1, $2)', [item.url, item.title]);
            }
          }
        }

        await client.query(`
          UPDATE contact SET
          display_phone = $1, address = $2, monday = $3, tuesday = $4, wednesday = $5, thursday = $6, friday = $7, saturday = $8, sunday = $9, email = $10, instagram = $11, facebook = $12, map_url = $13
          WHERE professional_id = 1
        `, [
          newData.contact.displayPhone, newData.contact.address,
          newData.contact.monday, newData.contact.tuesday, newData.contact.wednesday,
          newData.contact.thursday, newData.contact.friday, newData.contact.saturday, newData.contact.sunday,
          newData.contact.email, newData.contact.instagram, newData.contact.facebook, newData.contact.mapUrl
        ]);

        await client.query('COMMIT');

        if (newData.deletedImages && newData.deletedImages.length > 0) {
          for (const oldUrl of newData.deletedImages) {
            await deleteCloudinaryImage(oldUrl);
          }
        }

      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }

      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token or update failed' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}