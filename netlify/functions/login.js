import jwt from 'jsonwebtoken';

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  try {
    const { username, password } = JSON.parse(event.body);

    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
      const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '8h' });
      return { 
        statusCode: 200, 
        body: JSON.stringify({ token }) 
      };
    } else {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid credentials' }) };
    }
  } catch (error) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Bad request' }) };
  }
};