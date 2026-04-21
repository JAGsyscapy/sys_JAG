import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

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

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const profRes = await pool.query('SELECT * FROM professional WHERE id = 1');
      const prof = profRes.rows[0];

      const servRes = await pool.query('SELECT name FROM service WHERE professional_id = 1');
      const services = servRes.rows.map(row => row.name);

      const priceRes = await pool.query('SELECT * FROM pricing WHERE professional_id = 1');
      const pricing = priceRes.rows[0];

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
          logo: prof.logo
        },
        about: {
          education: prof.education,
          approach: prof.approach,
          objective: prof.objective,
          target: prof.target
        },
        services: services,
        pricing: {
          promo: pricing.promo,
          regular: pricing.regular
        },
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
        gallery: gallery
      };

      return res.status(200).json(responseData);
    } catch (error) {
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
          education = $6, approach = $7, objective = $8, target = $9, logo = $10
          WHERE id = 1
        `, [
          newData.hero.name, newData.hero.subtitle, newData.hero.therapy, newData.hero.phone, newData.hero.image,
          newData.about.education, newData.about.approach, newData.about.objective, newData.about.target, newData.hero.logo
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
          UPDATE pricing SET promo = $1, regular = $2 WHERE professional_id = 1
        `, [newData.pricing.promo, newData.pricing.regular]);

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