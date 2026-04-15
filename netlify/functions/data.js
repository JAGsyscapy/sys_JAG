import { Pool } from 'pg';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const handler = async (event, context) => {
  if (event.httpMethod === 'GET') {
    try {
      const { rows } = await pool.query('SELECT content FROM website_data WHERE id = 1');
      return { 
        statusCode: 200, 
        body: JSON.stringify(rows[0].content) 
      };
    } catch (error) {
      return { statusCode: 500, body: JSON.stringify({ error: 'Database error' }) };
    }
  } 
  
  else if (event.httpMethod === 'PUT') {
    try {
      const authHeader = event.headers.authorization || event.headers.Authorization;
      if (!authHeader) return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
      
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET); 
      
      const newData = JSON.parse(event.body); 
      await pool.query('UPDATE website_data SET content = $1 WHERE id = 1', [newData]);
      
      return { statusCode: 200, body: JSON.stringify({ success: true }) };
    } catch (error) {
      return { statusCode: 401, body: JSON.stringify({ error: 'Invalid token or update failed' }) };
    }
  } 
  
  else {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }
};