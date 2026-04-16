import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
      const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '8h' });
      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    return res.status(400).json({ error: 'Bad request' });
  }
}