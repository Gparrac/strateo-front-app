import OfficeView from '@/views/Forms/OfficeView.vue';

const OfficeRoute = {
    path: 'offices',
    component: OfficeView,
    children: [
      {
        path: '',
        name: 'Office',
        component: OfficeView,
      },
      {
        path: 'create',
        name: 'OfficeCreate',
        component: OfficeView,
      },
      {
        path: 'edit/:OfficeId',
        name: 'OfficeEdit',
        component: OfficeView,
      },
      {
        // Redirect /Office/edit to /Office if there is no OfficeId
        path: 'edit',
        redirect: to => {
          // Check if a OfficeId is provided
          if (!to.params.OfficeId) {
            return { name: 'Office' }; // Redirect to the 'Office' route
          }
        },
      },
    ],
};

export default OfficeRoute;