export const RulesValidation = {
  text: {
    maxLength: 45,
    rules: [
      (value) => !!value || "Este campo es requirido",
      (value) =>
        (value && value.length >= 3) ||
        "Este campo debe de ser de almenos 3 caracteres",
    ],
  },
  justText: {
    maxLength: 25,
    rules: [
      (value) => !!value || "Este campo es requirido",
      (value) =>
        (value && value.length >= 3) ||
        "Este campo debe de ser de almenos 3 caracteres",
      (value) =>
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value) ||
        "Este campo solo puede contener letras",
    ],
  },
  shortText: {
    maxLength: 20,
    rules: [
      (value) => !!value || "Este campo es requirido",
      (value) =>
        (value && value.toString().length < 19) || "Demasiados caracteres",
    ],
  },
  shortTextNull: {
    maxLength: 20,
    rules: [
      (value) =>
        !value || value.toString().length < 19 || "Demasiados caracteres",
    ],
  },
  date: {
    rules: [
      (v) => !!v || "La fecha y hora son requeridas", // Validación de campo requerido
      (v) =>
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v) ||
        /^(\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?)?$/.test(v) ||
        /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(
          v
        ) ||
        "Formato de fecha y hora no válido", // Validación de formato
    ],
  },
  nulldate: {
    rules: [
      (v) => {
        if (v !== null && v !== undefined && v.length != 0)
          return (
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v) ||
            /^(\d{4}-\d{2}-\d{2}(T\d{2}:\d{2})?)?$/.test(v) ||
            /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/.test(
              v
            ) ||
            "Formato de fecha y hora no válido"
          ); // Validación de formato
        return true;
      },
    ],
  },
  longText: {
    maxLength: 300,
    rules: [
      (value) => !!value || "Este campo es requirido",
      (value) =>
        (value && value.length >= 3) ||
        "Este campo debe de ser de almenos 3 caracteres",
      (value) =>
        (value && value.length < 300) ||
        "Este campo debe de ser menor de 300 caracteres",
    ],
  },
  longTextNull: {
    maxLength: 300,
    rules: [
      (value) =>
        !value ||
        value.length >= 3 ||
        "Este campo debe de ser de almenos 3 caracteres",
      (value) =>
        !value ||
        value.length < 300 ||
        "Este campo debe de ser menor de 300 caracteres",
    ],
  },
  identification: {
    maxLength: 12,
    rules: [
      (value) => !!value || "Identificación es requerida",
      (value) =>
        (value && value.length >= 7 && value.length <= 12) ||
        "Identificación tiene que ser entre 7 y 10 caracteres",
    ],
  },
  nullIdentification: {
    maxLength: 12,
    rules: [
      (value) => {
        if (value !== null && value !== undefined && value.length != 0)
          return (
            (value.length >= 7 && value.length <= 12) ||
            "Identificación tiene que ser entre 7 y 10 caracteres"
          );
        return true;
      },
    ],
  },
  email: {
    maxLength: 50,
    rules: [
      (value) => !!value || "Email es requirido",
      (value) =>
        /\S+@\S+\.\S+/.test(value) || "Formato de correo electrónico inválido",
    ],
  },
  emailOptional: {
    maxLength: 25,
    rules: [
      (value) =>
        /\S+@\S+\.\S+/.test(value) || "Formato de correo electrónico inválido",
    ],
  },
  mobile: {
    maxLength: 12,
    rules: [
      (value) => !!value || "El teléfono es requirido",
      (value) =>
        /^[0-9]{10,13}$/.test(value) ||
        "Formato de teléfono inválido (10 dígitos númericos)",
    ],
  },
  select: {
    rules: [(value) => !!value || "Debes seleccionar una opción"],
  },
  password: {
    maxLength: 20,
    rules: [
      (value) => !!value || "Contraseña es requerida",
      (value) =>
        (value && value.length >= 4) ||
        "Contraseña debe tener al menos 6 caracteres",
    ],
  },
  image: {
    rules: [
      (value) =>
        !value ||
        !value.length ||
        value[0].size < 5000000 ||
        "La imagen debe pesar menos de 5 MB",
    ],
  },
  file: {
    rules: [
      (value) =>
        !value ||
        !value.length ||
        value[0].size < 10000000 ||
        "El archivo debe pesar menos de 10 MB",
    ],
  },
  quantity: {
    maxLength: 4,
    rules: [
      (value) =>
        !!value ||
        (!isNaN(parseFloat(value)) && isFinite(value)) ||
        typeof value == "number" ||
        "La cantidad debe ser de tipo númerica",
      (value) => (value < 10000 && value >= 0) || "Rango de cantidad no valida",
    ],
  },
  quantityNull: {
    maxLength: 4,
    rules: [
      (value) => {
        if (value !== null && value !== undefined) {
          return (
            !isNaN(value) ||
            typeof value == "number" ||
            "La cantidad debe ser de tipo numérico"
          );
        }
        return true; // Si el campo es nulo o undefined, no aplicamos la regla de validación
      },
      (value) => {
        if (value !== null && value !== undefined) {
          return (value < 10000 && value >= 0) || "Rango de cantidad no válido";
        }
        return true; // Si el campo es nulo o undefined, no aplicamos la regla de validación
      },
    ],
  },
  price: {
    maxLength: 9,
    rules: [
      (value) =>
        !!value ||
        (!isNaN(parseFloat(value)) && isFinite(value)) ||
        typeof value == "number" ||
        "La cantidad debe ser de tipo númerica",
      (value) =>
        (value < 100000000 && value >= 0) || "Rango de cantidad no valida",
    ],
  },
  optionalPrice: {
    maxLength: 9,
    rules: [
      (value) =>
        !value ||
        (!isNaN(parseFloat(value)) && isFinite(value)) ||
        typeof value == "number" ||
        "La cantidad debe ser de tipo númerica",
      (value) =>
        !value ||
        (value < 10000000 && value >= 0) ||
        "Rango de cantidad no valida",
    ],
  },
  percent: {
    maxLength: 5,
    rules: [
      (value) => {
        if (!value) return "Por favor, ingrese un valor";
        const regex = /^\d{1,2}(\.\d{1,3})?$/; // Expresión regular para validar el formato del porcentaje
        if (!regex.test(value)) return "El formato del porcentaje es inválido";
        return true;
      },
    ],
  },
};
export function validateEmtyObj(item) {
  return Object.keys(item).length === 0;
}
