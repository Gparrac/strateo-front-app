export const RulesValidation = {
  text: {
    maxLength: 25,
    rules: [
      (value) => !!value || "Este campo es requirido",
      (value) =>
        (value && value.length >= 3) ||
        "Este campo debe de ser de almenos 3 caracteres",
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
  email: {
    maxLength: 25,
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
        "Formato de teléfono inválido (10 dígitos)",
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
        value[0].size < 2000000 ||
        "La imagen debe pesar menos de 2 MB",
    ],
  },
  file: {
    rules: [
      (value) =>
        !value ||
        !value.length ||
        value[0].size < 10000000 ||
        "El archivo debe pesar menos de 3 MB",
    ],
  },
};
