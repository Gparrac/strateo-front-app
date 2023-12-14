export function castDate(data){
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
