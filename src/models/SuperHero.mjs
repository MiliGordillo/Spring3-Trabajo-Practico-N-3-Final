import mongoose from 'mongoose';

const superheroSchema = new mongoose.Schema({
  nombreSuperheroe: { type: String, required: true },
  nombreReal: { type: String, required: true },
  edad: { type: Number, required: true },
  planetaOrigen: { type: String, required: true },
  debilidad: { type: String, required: true },
  habilidadEspecial: { type: String, required: true },
  poderes: { type: [String], default: [] },
  aliados: { type: [String], default: [] },
  enemigos: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const superHero = mongoose.model('SuperHero', superheroSchema, 'Grupo-11');
export default superHero;

