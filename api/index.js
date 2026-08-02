import app from '../backend/src/server.js';

export default async function handler(req, res) {
  try {
    return app(req, res);
  } catch (error) {
    console.error('SERVERLESS ENTRYPOINT ERROR:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Serverless function execution failure',
      stack: error.stack
    });
  }
}
