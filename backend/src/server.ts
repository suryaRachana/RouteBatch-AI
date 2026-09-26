import app from './app';

const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 RouteBatch-AI Production Backend listening on 0.0.0.0:${PORT}`);
  console.log(`📡 Allowed Frontend Origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
