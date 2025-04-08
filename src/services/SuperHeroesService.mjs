import SuperHeroRepository from '../repositories/SuperHeroRepository.mjs';

export async function obtenerSuperheroePorId(id) {
    return await SuperHeroRepository.obtenerPorId(id);
}

export async function obtenerTodosLosSuperheroes() {
    const superheroes = await SuperHeroRepository.obtenerTodos();
    return Array.isArray(superheroes) ? superheroes : [];
}

export async function buscarSuperheroesPorAtributo(atributo, valor) {
    return await SuperHeroRepository.buscarPorAtributo(atributo, valor);
}

export async function obtenerSuperheroesMayoresDe30() {
    return await SuperHeroRepository.obtenerMayoresDe30();
}

export async function crearSuperheroe(datos) {
    return await SuperHeroRepository.crear(datos);
}

export async function actualizarSuperheroe(id, datos) {
    return await SuperHeroRepository.actualizar(id, datos);
}

export async function eliminarSuperheroePorId(id) {
    return await SuperHeroRepository.eliminarPorId(id);
}

export async function eliminarSuperheroePorNombre(nombre) {
    return await SuperHeroRepository.eliminarPorNombre(nombre);
}

export const agregarSuperheroeService = async (superheroe) => {
    return await SuperHeroRepository.crear(superheroe);
};

  
