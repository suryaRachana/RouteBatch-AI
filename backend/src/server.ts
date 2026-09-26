import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 RouteBatch-AI Backend running on port ${PORT}`);
  console.log(`📡 Allowed Frontend Origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
