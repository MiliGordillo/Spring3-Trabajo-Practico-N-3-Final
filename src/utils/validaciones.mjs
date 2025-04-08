export const validarSuperheroe = (datos, esEdicion = false) => {
  const errores = [];

  if (!esEdicion) {
    // validación para creación
    if (!datos.nombreSuperheroe || datos.nombreSuperheroe.trim() === '') {
      errores.push("El nombre del superhéroe es obligatorio.");
    }

    if (!datos.nombreReal || datos.nombreReal.trim() === '') {
      errores.push("El nombre real es obligatorio.");
    }

    if (!datos.edad || isNaN(datos.edad) || datos.edad <= 0) {
      errores.push("La edad debe ser un número positivo.");
    }

    if (!datos.planetaOrigen || datos.planetaOrigen.trim() === '') {
      errores.push("El planeta de origen es obligatorio.");
    }

    if (!datos.debilidad || datos.debilidad.trim() === '') {
      errores.push("La debilidad es obligatoria.");
    }

    if (!datos.poderes || (Array.isArray(datos.poderes) && datos.poderes.length === 0) || (typeof datos.poderes === 'string' && !datos.poderes.trim())) {
      errores.push("Debe ingresar al menos un poder.");
    }

    if (datos.aliados && Array.isArray(datos.aliados)) {
      const aliadosValidos = datos.aliados.filter(a => a.trim() !== '');
      if (aliadosValidos.length === 0) {
        errores.push("Debe ingresar al menos un aliado válido o dejarlo vacío.");
      }
    } else if (typeof datos.aliados === 'string' && !datos.aliados.trim()) {
      errores.push("Aliado no puede estar vacío si se ingresa.");
    }

    if (datos.enemigos && Array.isArray(datos.enemigos)) {
      const enemigosValidos = datos.enemigos.filter(e => e.trim() !== '');
      if (enemigosValidos.length === 0) {
        errores.push("Debe ingresar al menos un enemigo válido o dejarlo vacío.");
      }
    } else if (typeof datos.enemigos === 'string' && !datos.enemigos.trim()) {
      errores.push("Enemigo no puede estar vacío si se ingresa.");
    }

  } else {
    // validación para edición
    const campos = [
      'nombreSuperheroe', 'nombreReal', 'edad',
      'planetaOrigen', 'debilidad', 'poderes',
      'aliados', 'enemigos'
    ];

    const algunCampoEditado = campos.some(campo => {
      if (Array.isArray(datos[campo])) {
        return datos[campo].some(val => val && val.trim() !== '');
      } else {
        return datos[campo] && datos[campo].toString().trim() !== '';
      }
    });

    if (!algunCampoEditado) {
      errores.push("Debes modificar al menos un campo.");
    }
  }

  return errores;
};

