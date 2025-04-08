import express from 'express';
import {
  obtenerSuperheroePorIdController,
  obtenerTodosLosSuperheroesController,
  buscarSuperheroesPorAtributoController,
  obtenerSuperheroesMayoresDe30Controller,
  crearSuperheroeController,
  actualizarSuperheroeController,
  eliminarSuperheroePorIdController,
  eliminarSuperheroePorNombreController,
  agregarSuperheroeController,
  mostrarFormularioEditar,
  editarSuperheroeController,
  eliminarSuperheroeYRedirigirController
} from '../controllers/SuperHeroesController.mjs';
import { renderizarListaSuperheroes } from '../views/ResponseView.mjs';
import { obtenerTodosLosSuperheroes } from '../services/SuperHeroesService.mjs';

const router = express.Router();

router.get('/api/buscar/:atributo/:valor', buscarSuperheroesPorAtributoController);
router.get('/api/mayores-de-30', obtenerSuperheroesMayoresDe30Controller);
router.get('/api/:id', obtenerSuperheroePorIdController);
router.post('/api', crearSuperheroeController);
router.put('/api/:id', actualizarSuperheroeController);
router.delete('/api/:id', eliminarSuperheroePorIdController);
router.delete('/api/nombre/:nombre', eliminarSuperheroePorNombreController);

/// VISTAS / FORMULARIOS
router.get('/api', async (req, res) => {
  try {
    const rawSuperheroes = await obtenerTodosLosSuperheroes();
    const superheroes = renderizarListaSuperheroes(rawSuperheroes);

    const mensaje = req.query.mensaje;

    res.render('dashboard', {
      mensaje,
      heroes: superheroes
    });
  } catch (error) {
    res.status(500).render('dashboard', {
      mensaje: null,
      heroes: [],
      error: 'Error al obtener los superhéroes'
    });
  }
});

// formulario para agregar
router.get('/formulario/agregar', (req, res) => {
  res.render('addSuperhero', { datos: {}, errores: [] });
});
router.post('/agregar', agregarSuperheroeController);

// formulario para editar
router.get('/formulario/editar/:id', mostrarFormularioEditar);
router.post('/formulario/editar/:id', editarSuperheroeController);

// fliminar superhéroe
router.delete('/:id', eliminarSuperheroeYRedirigirController);

export default router;

