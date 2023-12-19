import EnterpriseView from '@/views/Forms/EnterpriseView.vue';

const enterpriseRoute = {
    path: 'enterprises',
    component: EnterpriseView,
    children: [
      {
        path: '',
        name: 'Enterprises',
        component: EnterpriseView,
      },
      {
        path: 'create',
        name: 'EnterprisesCreate',
        component: EnterpriseView,
      },
      {
        path: 'edit/:RoleId',
        name: 'EnterprisesEdit',
        component: EnterpriseView,
      },
      {
        // Redirect /enterprises/edit to /enterprises if there is no RoleId
        path: 'edit',
        redirect: to => {
          // Check if a RoleId is provided
          if (!to.params.RoleId) {
            return { name: 'Enterprises' }; // Redirect to the 'Enterprises' route
          }
        },
      },
    ],
};

export default enterpriseRoute;
