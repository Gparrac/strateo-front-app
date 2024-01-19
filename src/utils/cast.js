export function castDate(data) {
  const fecha = new Date(data);

  // Obtener los componentes de la fecha
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1; // Sumar 1 porque los meses comienzan desde 0
  const anio = fecha.getFullYear();

  // Agregar ceros a la izquierda para un formato consistente
  const diaFormateado = dia < 10 ? `0${dia}` : dia;
  const mesFormateado = mes < 10 ? `0${mes}` : mes;
  return `${diaFormateado}/${mesFormateado}/${anio}`;
}

export function castNit(strNit) {
  if (strNit !== "") {
    strNit = strNit.toString();
    // Vector de números primos
    var iNrosPrimos = [
      3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71,
    ];
    // Variable para realizar las operaciones
    var iOperacion = 0;

    // Ciclo para multiplicar cada uno de los dígitos del NIT con el vector
    for (var i = 0; i < strNit.length; i++) {
      iOperacion +=
        parseInt(strNit.substr(strNit.length - (i + 1), 1)) * iNrosPrimos[i];
    }

    // Sacar el residuo de la operación
    iOperacion %= 11;

    if (iOperacion === 0 || iOperacion === 1) {
      return iOperacion;
    } else {
      return 11 - iOperacion;
    }
  } else {
    return "";
  }
}
export function statusAllowed(){
  return [
    { name: "A", label: "Activo" },
    { name: "I", label: "Inactivo" },
  ]
}

export function errorHandler (errors){
  return Object.values(errors).reduce((acc, messages) => {
    return acc.concat(messages);
  }, []);
}
