export function renderizarSuperheroe(superheroe) {
  const data = superheroe._doc || superheroe;
  return {
    Nombre: data.nombreSuperHeroe || data.nombreSuperheroe || "Sin nombre",
    "Nombre Real": data.nombreReal,
    Edad: data.edad,
    "Planeta de Origen": data.planetaOrigen,
    Debilidad: data.debilidad,
    "Habilidad Especial": data.habilidadEspecial,
    Poderes: data.poderes,
    Aliados: data.aliados,
    Enemigos: data.enemigos
  };
}

export function renderizarListaSuperheroes(superheroes) {
  return superheroes.map(superheroe => ({
    _id: superheroe._id.toString(),
    ...renderizarSuperheroe(superheroe)
  }));
}










  



