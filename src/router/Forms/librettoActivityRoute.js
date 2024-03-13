import LibrettoActivityView from '@/views/Forms/LibrettoActivityView.vue';

const librettoActivityRoute = {
    path: 'libretto-activities',
    component: LibrettoActivityView,
    children: [
      {
        path: '',
        name: 'LibrettoActivity',
        component: LibrettoActivityView,
      },
      {
        path: 'create',
        name: 'LibrettoActivityCreate',
        component: LibrettoActivityView,
      },
      {
        path: 'edit/:LibrettoActivityId',
        name: 'LibrettoActivityEdit',
        component: LibrettoActivityView,
      },
      {
        // Redirect /LibrettoActivity/edit to /LibrettoActivity if there is no LibrettoActivityId
        path: 'edit',
        redirect: to => {
          // Check if a LibrettoActivityId is provided
          if (!to.params.LibrettoActivityId) {
            return { name: 'LibrettoActivity' }; // Redirect to the 'LibrettoActivity' route
          }
        },
      },
    ],
};

export default librettoActivityRoute;
