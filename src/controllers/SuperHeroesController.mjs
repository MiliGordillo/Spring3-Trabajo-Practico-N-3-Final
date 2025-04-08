import { validarSuperheroe } from '../utils/validaciones.mjs';

import {
    obtenerSuperheroePorId, obtenerTodosLosSuperheroes,
    buscarSuperheroesPorAtributo, obtenerSuperheroesMayoresDe30,
    crearSuperheroe, actualizarSuperheroe, eliminarSuperheroePorId,
    eliminarSuperheroePorNombre
} from '../services/SuperHeroesService.mjs';

import { renderizarSuperheroe, renderizarListaSuperheroes } from '../views/ResponseView.mjs';

export async function obtenerSuperheroePorIdController(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send({ mensaje: 'ID es requerido' });

        const superheroe = await obtenerSuperheroePorId(id);
        if (!superheroe) return res.status(404).send({ mensaje: 'Superhéroe no encontrado' });

        res.status(200).json(renderizarSuperheroe(superheroe));
    } catch (error) {
        res.status(500).send({ mensaje: 'Error al obtener el superhéroe', error: error.message });
    }
}

export async function obtenerTodosLosSuperheroesController(req, res) {
  try {
    const heroes = await obtenerTodosLosSuperheroes();
    const heroesNormalizados = renderizarListaSuperheroes(heroes);
    const mensaje = req.query.mensaje === 'eliminado' ? '¡Superhéroe eliminado con éxito!' : null;
    res.render('dashboard', { heroes: heroesNormalizados, mensaje });
  } catch (error) {
    console.error('Error obteniendo la lista de héroes:', error);
    res.status(500).send('Error interno del servidor');
  }
}

export async function buscarSuperheroesPorAtributoController(req, res) {
    try {
        const { atributo, valor } = req.params;
        if (!atributo || !valor) {
            return res.status(400).send({ mensaje: 'Atributo y valor son requeridos' });
        }

        const superheroes = await buscarSuperheroesPorAtributo(atributo, valor);
        if (!superheroes.length) {
            return res.status(404).send({ mensaje: 'No se encontraron superhéroes con ese atributo' });
        }

        res.status(200).json(renderizarListaSuperheroes(superheroes));
    } catch (error) {
        res.status(500).send({ mensaje: 'Error al buscar los superhéroes', error: error.message });
    }
}

export async function obtenerSuperheroesMayoresDe30Controller(req, res) {
    try {
        const superheroes = await obtenerSuperheroesMayoresDe30();
        if (!superheroes.length) {
            return res.status(404).send({ mensaje: 'No se encontraron superhéroes mayores de 30 años' });
        }

        res.status(200).json(renderizarListaSuperheroes(superheroes));
    } catch (error) {
        res.status(500).send({ mensaje: 'Error al obtener superhéroes mayores de 30', error: error.message });
    }
}

export async function crearSuperheroeController(req, res) {
    try {
        const errores = validarSuperheroe(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ errores });
        }

        const superheroe = await crearSuperheroe(req.body);
        res.status(201).json(renderizarSuperheroe(superheroe));
    } catch (error) {
        res.status(500).send({ mensaje: 'Error al crear el superhéroe', error: error.message });
    }
}


export async function actualizarSuperheroeController(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send({ mensaje: 'ID es requerido' });

        const errores = validarSuperheroe(req.body);
        if (errores.length > 0) {
            return res.status(400).json({ errores });
        }

        const superheroeActualizado = await actualizarSuperheroe(id, req.body);
        if (!superheroeActualizado) {
            return res.status(404).send({ mensaje: 'Superhéroe no encontrado' });
        }

        res.status(200).json(renderizarSuperheroe(superheroeActualizado));
    } catch (error) {
        res.status(500).send({ mensaje: 'Error al actualizar el superhéroe', error: error.message });
    }
}

export async function eliminarSuperheroePorIdController(req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.status(400).send({ mensaje: 'ID es requerido' });

        const superheroeEliminado = await eliminarSuperheroePorId(id);
        if (!superheroeEliminado) {
            return res.status(404).send({ mensaje: 'Superhéroe no encontrado' });
        }

        res.status(200).json({ mensaje: 'Superhéroe eliminado correctamente' });
    } catch (error) {
        res.status(500).send({ mensaje: 'Error al eliminar el superhéroe', error: error.message });
    }
}

export async function eliminarSuperheroePorNombreController(req, res) {
    try {
        const { nombre } = req.params;
        if (!nombre) return res.status(400).send({ mensaje: 'Nombre es requerido' });

        const superheroeEliminado = await eliminarSuperheroePorNombre(nombre);
        if (!superheroeEliminado) {
            return res.status(404).send({ mensaje: 'Superhéroe no encontrado' });
        }

        res.status(200).json({ mensaje: 'Superhéroe eliminado correctamente' });
    } catch (error) {
        res.status(500).send({ mensaje: 'Error al eliminar el superhéroe', error: error.message });
    }
}


import SuperHero from '../models/SuperHero.mjs';

export const agregarSuperheroeController = async (req, res) => {
  try {
    const {
      nombreSuperheroe,
      nombreReal,
      edad,
      planetaOrigen,
      debilidad,
      habilidadEspecial,
      poderes,
      aliados,
      enemigos
    } = req.body;

    const nuevoHeroe = new SuperHero({
      nombreSuperheroe,
      nombreReal,
      edad,
      planetaOrigen,
      debilidad,
      habilidadEspecial,
      poderes: Array.isArray(poderes) ? poderes : [poderes],
      aliados: Array.isArray(aliados) ? aliados : [aliados],
      enemigos: Array.isArray(enemigos) ? enemigos : [enemigos]
    });

    await nuevoHeroe.save();
    res.redirect('/heroes/api?mensaje=agregado');
  } catch (error) {
    console.error('Error al agregar el superhéroe:', error);
    res.render('addSuperhero', {
      datos: req.body,
      errores: ['Error al agregar el superhéroe.']
    });
  }
};

//////////////////////////////////////////////////////////

export const mostrarFormularioEditar = async (req, res) => {
  try {
    const id = req.params.id;
    const heroe = await obtenerSuperheroePorId(id);

    if (!heroe) {
      return res.status(404).render('404', { mensaje: 'Superhéroe no encontrado' });
    }

    res.render('editSuperhero', { datos: heroe, errores: [] });
  } catch (error) {
    console.error('Error al cargar el formulario de edición:', error);
    res.status(500).render('error', { mensaje: 'Error interno al cargar el formulario' });
  }
};

export const editarSuperheroeController = async (req, res) => {
    const id = req.params.id;
    const datos = req.body;
  
    // convertir campos múltiples a arrays
    if (!Array.isArray(datos.poderes)) datos.poderes = datos.poderes ? [datos.poderes] : [];
    if (!Array.isArray(datos.aliados)) datos.aliados = datos.aliados ? [datos.aliados] : [];
    if (!Array.isArray(datos.enemigos)) datos.enemigos = datos.enemigos ? [datos.enemigos] : [];
  
    // limpiar campos vacíos
    datos.poderes = datos.poderes.filter(p => p.trim() !== '');
    datos.aliados = datos.aliados.filter(a => a.trim() !== '');
    datos.enemigos = datos.enemigos.filter(e => e.trim() !== '');
  
    const errores = validarSuperheroe(datos, true);
    if (errores.length > 0) {
      datos._id = id;
      return res.status(400).render('editSuperhero', { datos, errores });
    }
  
    try {
      await actualizarSuperheroe(id, datos);
      res.redirect('/heroes/api?mensaje=editado');
    } catch (error) {
      res.status(500).send('Error al actualizar el superhéroe');
    }
  };
  
  export async function eliminarSuperheroeYRedirigirController(req, res) {
    try {
      const { id } = req.params;
      const resultado = await eliminarSuperheroePorId(id);
  
      if (!resultado) {
        return res.redirect('/heroes/api?mensaje=no-encontrado');
      }
  
      res.redirect('/heroes/api?mensaje=eliminado');
    } catch (error) {
      console.error('Error al eliminar:', error);
      res.status(500).json({ error: 'Error al eliminar el superhéroe' });
    }
  }
  
  
