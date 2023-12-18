import RoleView from '@/views/Forms/RoleView.vue';

const rolesRoute = {
    path: 'roles',
    component: () => RoleView,
    children: [
      {
        path: '',
        name: 'Roles',
        idBack:'234',
        component: () => RoleView,
      },
      {
        path: 'create',
        name: 'RolesCreate',
        component: () => RoleView,
      },
      {
        path: 'edit/:RoleId',
        name: 'RolesEdit',
        component: () => RoleView,
      },
      {
        // Redirect /Roles/edit to /Roles if there is no RoleId
        path: 'edit',
        redirect: to => {
          // Check if a RoleId is provided
          if (!to.params.RoleId) {
            return { name: 'Roles' }; // Redirect to the 'Roles' route
          }
        },
      },
    ],
    beforeEnter(to, from, next) {
      console.log('data',to)
      next();
        }
};

export default rolesRoute;
