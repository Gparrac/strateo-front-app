import ServiceView from '@/views/Forms/ServiceView.vue';

const servicesRoute = {
    path: 'services',
    component: ServiceView,
    children: [
      {
        path: '',
        name: 'Services',
        component: ServiceView,
      },
      {
        path: 'create',
        name: 'ServicesCreate',
        component: ServiceView,
      },
      {
        path: 'edit/:userId',
        name: 'servicesEdit',
        component: ServiceView,
      },
      {
        // Redirect /users/edit to /users if there is no userId
        path: 'edit',
        redirect: to => {
          // Check if a userId is provided
          if (!to.params.userId) {
            return { name: 'Services' }; // Redirect to the 'Users' route
          }
        },
      },
    ],
};

export default servicesRoute;
