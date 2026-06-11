require('dotenv').config();
const app = require('./src/app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connecté à MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Erreur de connexion MongoDB :', err.message);
    process.exit(1);
  });