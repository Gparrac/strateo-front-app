import RoleView from '@/views/Forms/RoleView.vue';

const roleRoute = {
    path: 'roles',
    component: RoleView,
    children: [
      {
        path: '',
        name: 'Role',
        component: RoleView,
      },
      {
        path: 'create',
        name: 'RoleCreate',
        component: RoleView,
      },
      {
        path: 'edit/:RoleId',
        name: 'RoleEdit',
        component: RoleView,
      },
      {
        // Redirect /Roles/edit to /Roles if there is no RoleId
        path: 'edit',
        redirect: to => {
          // Check if a RoleId is provided
          if (!to.params.RoleId) {
            return { name: 'Role' }; // Redirect to the 'Roles' route
          }
        },
      },
    ],
    beforeEnter(to, from, next) {
      next();
        }
};

export default roleRoute;
