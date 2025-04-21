export const validarSuperheroe = (datos, esEdicion = false) => {
  const errores = [];

  const validarTexto = (campo, nombreCampo) => {
    if (!campo || campo.trim() === '') {
      return `${nombreCampo} es obligatorio.`;
    }
    const valor = campo.trim();
    if (valor.length < 3 || valor.length > 60) {
      return `${nombreCampo} debe tener entre 3 y 60 caracteres.`;
    }
    return null;
  };

  const validarArrayTexto = (arr, nombreCampo, obligatorio = true) => {
    if (!Array.isArray(arr)) {
      return `${nombreCampo} debe ser un arreglo.`;
    }

    const elementosValidos = arr.filter(item => typeof item === 'string' && item.trim() !== '');

    if (obligatorio && elementosValidos.length === 0) {
      return `${nombreCampo} es obligatorio y debe tener entre 3 y 60 caracteres.`;
    }

    for (const item of elementosValidos) {
      const valor = item.trim();
      if (valor.length < 3 || valor.length > 60) {
        return `Cada elemento de ${nombreCampo} debe tener entre 3 y 60 caracteres.`;
      }
    }

    return null;
  };

  if (!esEdicion) {
    // Validaciones principales para crear
    const nombreSuperheroeError = validarTexto(datos.nombreSuperheroe, 'El nombre del superhéroe');
    if (nombreSuperheroeError) errores.push(nombreSuperheroeError);

    const nombreRealError = validarTexto(datos.nombreReal, 'El nombre real');
    if (nombreRealError) errores.push(nombreRealError);

    if (datos.edad === undefined || datos.edad === null || datos.edad.toString().trim() === '') {
      errores.push('La edad es obligatoria.');
    } else if (isNaN(datos.edad)) {
      errores.push('La edad debe ser un número.');
    } else if (Number(datos.edad) < 0) {
      errores.push('La edad no puede ser negativa.');
    }

    const poderesError = validarArrayTexto(datos.poderes, 'Poderes');
    if (poderesError) errores.push(poderesError);

    const aliadosError = validarArrayTexto(datos.aliados, 'Aliados', false);
    if (aliadosError) errores.push(aliadosError);

    const enemigosError = validarArrayTexto(datos.enemigos, 'Enemigos', false);
    if (enemigosError) errores.push(enemigosError);

  } else {
    // Validación de edición: se puede editar solo algunos campos
    const campos = [
      'nombreSuperheroe', 'nombreReal', 'edad',
      'planetaOrigen', 'debilidad', 'poderes',
      'aliados', 'enemigos'
    ];

    const algunCampoEditado = campos.some(campo => {
      const valor = datos[campo];
      if (Array.isArray(valor)) {
        return valor.some(item => item && item.trim() !== '');
      } else {
        return valor && valor.toString().trim() !== '';
      }
    });

    if (!algunCampoEditado) {
      errores.push("Debes modificar al menos un campo.");
    } else {
      // Solo validamos los campos que estén presentes
      if (datos.nombreSuperheroe) {
        const e = validarTexto(datos.nombreSuperheroe, 'El nombre del superhéroe');
        if (e) errores.push(e);
      }

      if (datos.nombreReal) {
        const e = validarTexto(datos.nombreReal, 'El nombre real');
        if (e) errores.push(e);
      }

      if (datos.edad !== undefined && datos.edad !== null && datos.edad.toString().trim() !== '') {
        if (isNaN(datos.edad)) {
          errores.push('La edad debe ser un número.');
        } else if (Number(datos.edad) < 0) {
          errores.push('La edad no puede ser negativa.');
        }
      }

      if (datos.poderes) {
        const e = validarArrayTexto(datos.poderes, 'Poderes');
        if (e) errores.push(e);
      }

      if (datos.aliados) {
        const e = validarArrayTexto(datos.aliados, 'Aliados', false);
        if (e) errores.push(e);
      }

      if (datos.enemigos) {
        const e = validarArrayTexto(datos.enemigos, 'Enemigos', false);
        if (e) errores.push(e);
      }
    }
  }

  return errores;
};
