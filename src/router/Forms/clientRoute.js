import ClientView from '@/views/Forms/ClientView.vue';

const clientRoute = {
    path: 'clients',
    component: ClientView,
    children: [
      {
        path: '',
        name: 'Client',
        component: ClientView,
      },
      {
        path: 'create',
        name: 'ClientCreate',
        component: ClientView,
      },
      {
        path: 'edit/:ClientId',
        name: 'ClientEdit',
        component: ClientView,
      },
      {
        // Redirect /Office/edit to /Office if there is no OfficeId
        path: 'edit',
        redirect: to => {
          // Check if a OfficeId is provided
          if (!to.params.ClientId) {
            return { name: 'Client' }; // Redirect to the 'Office' route
          }
        },
      },
    ],
};

export default clientRoute;