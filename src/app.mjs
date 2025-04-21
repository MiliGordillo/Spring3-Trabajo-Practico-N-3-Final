import express from 'express';
import { connectDB } from './config/dbConfig.mjs';
import SuperHeroRoutes from './routes/SuperHeroRoutes.mjs';
import fetch from 'node-fetch';
import { renderizarListaSuperheroes } from './views/ResponseView.mjs';
import methodOverride from 'method-override';

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', './views');

connectDB();

app.get('/', (req, res) => {
  res.render('index');
});

app.use('/heroes', SuperHeroRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('404', { mensaje: "Ruta no encontrada" });
});

// Servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});




