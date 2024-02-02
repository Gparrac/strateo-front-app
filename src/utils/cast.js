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
 export function castFullDate(date){


// Convertir a objeto de fecha de JavaScript
var fechaJS = new Date(date);

// Obtener los componentes de fecha y hora
var year = fechaJS.getFullYear();
var month = ("0" + (fechaJS.getMonth() + 1)).slice(-2);
var day = ("0" + fechaJS.getDate()).slice(-2);
var hours = ("0" + fechaJS.getHours()).slice(-2);
var minutes = ("0" + fechaJS.getMinutes()).slice(-2);
var seconds = ("0" + fechaJS.getSeconds()).slice(-2);

// Formatear la fecha según el formato "Y-m-d H:i:s"
return  year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;

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
