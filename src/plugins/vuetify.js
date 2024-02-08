/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
// export default createVuetify({
//   theme: {
//     themes: {
//       light: {
//         dark: false,
//         colors: {
//           primary: "#1867C0",
//           secondary: "#5CBBF6",
//         },
//       },
//       dark: {
//         dark: true,
//         colors: {
//           background: "#FFFFFF",
//         },
//       },
//     },
//   },
// });
const customDarkTheme = {
  dark: true,
  colors: {
    background: "#15202b",
    surface: "#15202b",
    primary: "#3f51b5",
    secondary: "#03dac6",
    error: "#ff5722",
  },
};

const customLightTheme = {
  dark: false,
  colors: {
    background: "4D4D49",
    surface: "#15202b",
    primary: "#3f51b5",
    secondary: "#00ccff",
    error: "#ffcc00",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "light",
    themes: {
      customDarkTheme,
      customLightTheme,
    },
  },
});
