// Composables
import { createRouter, createWebHistory } from "vue-router";
import formsRoute from "./Forms";
import Petition from "@/services/PetitionStructure/Petition";
import AuthUser from "@/services/auth/AuthUser";
import { useUserAuthStore } from "@/store/userAuth";
import { useFilterTableStore } from "@/store/filterTables";

const authUser = new AuthUser();
const petition = new Petition();
const routes = [
  {
    path: "/",
    component: () => import("@/layouts/AppBar.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "change-password",
        name: "changePassword",
        component: () => import("@/views/auth/ChangePasswordView.vue"),
      },
      ...formsRoute,
    ],
    beforeEnter: async (to, from, next) => {
      let path = null;
      try {
        //check auth 🚨
        const userData = await authUser.user();
        if (userData.statusResponse != 200) {
          const userStore = useUserAuthStore();
          localStorage.clear();
          userStore.$reset();
          path = "/sign-in";
        } else {
          if (from.path == "/sign-in" && to.path == "/") {
            //check enterprise 🚨
            const response = await petition.get("/check-enterprise", "", true);
            if (response.message && response.message == "Successful") {
              if (response.data === false) {
                path = "/enterprises";
              }
            }
          }
        }
      } catch (error) {
        console.error("entrando?", error);
      }
      path ? next(path) : next();
    },
  },
  {
    path: "/sign-in",
    component: () => import("@/views/auth/LoginView.vue"),
    name: "SignIn",
  },
  {
    path: "/recovery-password",
    name: "RecoveryPassword",
    component: () => import("@/views/auth/RecoveryPassword.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
router.beforeEach((_to, _from, next) => {
  const filterTableStore = useFilterTableStore();
  filterTableStore.$reset();
  next();
})

export default router;
