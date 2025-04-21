import { validarSuperheroe } from '../utils/validaciones.mjs';
import {
    obtenerSuperheroePorId, obtenerTodosLosSuperheroes,
    buscarSuperheroesPorAtributo, obtenerSuperheroesMayoresDe30,
    crearSuperheroe, actualizarSuperheroe, eliminarSuperheroePorId,
    eliminarSuperheroePorNombre
} from '../services/SuperHeroesService.mjs';

import { renderizarSuperheroe, renderizarListaSuperheroes } from '../views/ResponseView.mjs';
import SuperHero from '../models/SuperHero.mjs';


// 🛠️ Helpers

function validarParametro(req, res, paramName) {
    const valor = req.params[paramName];
    if (!valor) {
        res.status(400).json({ mensaje: `${paramName.charAt(0).toUpperCase() + paramName.slice(1)} es requerido` });
        return null;
    }
    return valor;
}

function convertirACamposArray(valor) {
    if (Array.isArray(valor)) return valor.filter(v => v.trim() !== '');
    if (typeof valor === 'string') return valor.split(',').map(v => v.trim()).filter(v => v !== '');
    return [];
}

function normalizarCamposArray(datos, campos = ['poderes', 'aliados', 'enemigos']) {
    for (const campo of campos) {
        datos[campo] = convertirACamposArray(datos[campo]);
    }
}


// 🔍 API REST Controllers

export async function obtenerSuperheroePorIdController(req, res) {
    const id = validarParametro(req, res, 'id');
    if (!id) return;

    try {
        const superheroe = await obtenerSuperheroePorId(id);
        if (!superheroe) return res.status(404).json({ mensaje: 'Superhéroe no encontrado' });
        res.status(200).json(renderizarSuperheroe(superheroe));
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener el superhéroe', error: error.message });
    }
}

export async function obtenerTodosLosSuperheroesController(req, res) {
    try {
        const heroes = await obtenerTodosLosSuperheroes();
        const heroesNormalizados = renderizarListaSuperheroes(heroes);
        const mensaje = {
            'eliminado': '¡Superhéroe eliminado con éxito!',
            'agregado': '¡Superhéroe agregado con éxito!',
            'editado': '¡Superhéroe editado con éxito!'
        }[req.query.mensaje] || null;

        res.render('dashboard', { heroes: heroesNormalizados, mensaje });
    } catch (error) {
        console.error('Error obteniendo la lista de héroes:', error);
        res.status(500).render('error', { mensaje: 'Error interno del servidor' });
    }
}

export async function buscarSuperheroesPorAtributoController(req, res) {
    const { atributo, valor } = req.params;
    if (!atributo || !valor) {
        return res.status(400).json({ mensaje: 'Atributo y valor son requeridos' });
    }

    try {
        const superheroes = await buscarSuperheroesPorAtributo(atributo, valor);
        if (!superheroes.length) {
            return res.status(404).json({ mensaje: 'No se encontraron superhéroes con ese atributo' });
        }
        res.status(200).json(renderizarListaSuperheroes(superheroes));
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al buscar los superhéroes', error: error.message });
    }
}

export async function obtenerSuperheroesMayoresDe30Controller(req, res) {
    try {
        const superheroes = await obtenerSuperheroesMayoresDe30();
        if (!superheroes.length) {
            return res.status(404).json({ mensaje: 'No se encontraron superhéroes mayores de 30 años' });
        }
        res.status(200).json(renderizarListaSuperheroes(superheroes));
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener superhéroes mayores de 30', error: error.message });
    }
}

export async function crearSuperheroeController(req, res) {
    const datos = req.body;
    normalizarCamposArray(datos);

    const errores = validarSuperheroe(datos);
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const superheroe = await crearSuperheroe(datos);
        res.status(201).json(renderizarSuperheroe(superheroe));
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al crear el superhéroe', error: error.message });
    }
}

export async function actualizarSuperheroeController(req, res) {
    const id = validarParametro(req, res, 'id');
    if (!id) return;

    const datos = req.body;
    normalizarCamposArray(datos);

    const errores = validarSuperheroe(datos);
    if (errores.length > 0) {
        return res.status(400).json({ errores });
    }

    try {
        const actualizado = await actualizarSuperheroe(id, datos);
        if (!actualizado) {
            return res.status(404).json({ mensaje: 'Superhéroe no encontrado' });
        }
        res.status(200).json(renderizarSuperheroe(actualizado));
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar el superhéroe', error: error.message });
    }
}

export async function eliminarSuperheroePorIdController(req, res) {
    const id = validarParametro(req, res, 'id');
    if (!id) return;

    try {
        const eliminado = await eliminarSuperheroePorId(id);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Superhéroe no encontrado' });
        }
        res.status(200).json({ mensaje: 'Superhéroe eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el superhéroe', error: error.message });
    }
}

export async function eliminarSuperheroePorNombreController(req, res) {
    const nombre = validarParametro(req, res, 'nombre');
    if (!nombre) return;

    try {
        const eliminado = await eliminarSuperheroePorNombre(nombre);
        if (!eliminado) {
            return res.status(404).json({ mensaje: 'Superhéroe no encontrado' });
        }
        res.status(200).json({ mensaje: 'Superhéroe eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el superhéroe', error: error.message });
    }
}


// 🧾 Vistas (EJS)

export const agregarSuperheroeController = async (req, res) => {
    const datos = req.body;
    normalizarCamposArray(datos);

    const errores = validarSuperheroe(datos);
    if (errores.length > 0) {
        return res.status(400).render('addSuperhero', { datos, errores });
    }

    try {
        const nuevoHeroe = new SuperHero(datos);
        await nuevoHeroe.save();
        res.redirect('/heroes/api?mensaje=agregado');
    } catch (error) {
        console.error('Error al agregar el superhéroe:', error);
        res.render('addSuperhero', {
            datos,
            errores: ['Error al agregar el superhéroe.']
        });
    }
};

export const mostrarFormularioEditar = async (req, res) => {
    const id = validarParametro(req, res, 'id');
    if (!id) return;

    try {
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
    const id = validarParametro(req, res, 'id');
    if (!id) return;

    const datos = req.body;
    normalizarCamposArray(datos);

    const errores = validarSuperheroe(datos, true);
    if (errores.length > 0) {
        datos._id = id;
        return res.status(400).render('editSuperhero', { datos, errores });
    }

    try {
        await actualizarSuperheroe(id, datos);
        res.redirect('/heroes/api?mensaje=editado');
    } catch (error) {
        console.error('Error al actualizar el superhéroe:', error);
        res.status(500).render('error', { mensaje: 'Error al actualizar el superhéroe' });
    }
};

export async function eliminarSuperheroeYRedirigirController(req, res) {
    const id = validarParametro(req, res, 'id');
    if (!id) return;

    try {
        const resultado = await eliminarSuperheroePorId(id);
        if (!resultado) {
            return res.redirect('/heroes/api?mensaje=no-encontrado');
        }
        res.redirect('/heroes/api?mensaje=eliminado');
    } catch (error) {
        console.error('Error al eliminar:', error);
        res.status(500).render('error', { mensaje: 'Error al eliminar el superhéroe' });
    }
}

