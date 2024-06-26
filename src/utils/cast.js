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
export function castFullDate(date) {
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
  return (
    year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds
  );
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
export function statusAllowed() {
  return [
    { name: "A", label: "Activo" },
    { name: "I", label: "Inactivo" },
  ];
}
export function searchKey(item, arrayKeys) {
  if (!item || !arrayKeys) return;
  let label = item;
  for (let clave of arrayKeys) {
    label = label[clave];
  }

  return label;
}

export function errorHandler(errors) {
  return Object.values(errors).reduce((acc, messages) => {
    return acc.concat(messages);
  }, []);
}
export function calTotalCostItems(items) {
  return items.reduce((acc, obj) => {
    // Si el objeto no tiene 'amount' o 'cost', se toma como 0
    const amount = obj.amount || 0;
    const cost = obj.cost || 0;
    const discount = obj.discount || 0;

    // Sumar el producto de 'amount' y 'cost' al acumulador
    return acc + (amount * cost - discount);
  }, 0);
}
export function calTotalDiscountItems(items) {
  return items.reduce((acc, obj) => {
    const total = obj.cost * obj.amount - (obj.discount || 0) || 0;
    const taxes =
      obj.taxes.reduce((rtotal, item) => {
        const totalTax =
          ((item.type == "D" ? -1 : 1) * (item.percent || 0) * total) / 100 ??
          0;

        return rtotal + +totalTax;
      }, 0) ?? 0;
    // Si el objeto no tiene 'amount' o 'cost', se toma como 0
    // Sumar el producto de 'amount' y 'cost' al acumulador
    return acc + taxes;
  }, 0);
}
export function formatNumberToColPesos(number) {
  // Crear una instancia de Intl.NumberFormat con la configuración para pesos colombianos
  const formatter = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP", // Define la moneda como pesos colombianos
  });
  return formatter.format(number);
}
export function deepCopy(item) {
  return JSON.parse(JSON.stringify(item));
}
export function castStorageToObject(item){
  for (let i = 0; i < 50; i++) {
    if(typeof item == 'object' && item !== null ){

      break;
    }else{
      item = JSON.parse(item);
    }
  }
  return item;
}
export function currentlyTime(showHourse=false, daysBefore = false){
  const msTime =  (daysBefore) ?  daysBefore * 24 * 60 * 60 * 1000 : 5 * 60 * 60 * 1000;
  const time = new Date(new Date().getTime() - (msTime));
  return  time.toISOString().substr(0, showHourse ? 16 : 10);
}

