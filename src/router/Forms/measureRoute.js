import MeasureView from '@/views/Forms/MeasureView.vue';

const measureRoute = {
    path: 'measures',
    component: MeasureView,
    children: [
      {
        path: '',
        name: 'Measure',
        component: MeasureView,
      },
      {
        path: 'create',
        name: 'MeasureCreate',
        component: MeasureView,
      },
      {
        path: 'edit/:MeasureId',
        name: 'MeasureEdit',
        component: MeasureView,
      },
      {
        // Redirect /Measure/edit to /Measure if there is no MeasureId
        path: 'edit',
        redirect: to => {
          // Check if a MeasureId is provided
          if (!to.params.MeasureId) {
            return { name: 'Measure' }; // Redirect to the 'Measure' route
          }
        },
      },
    ],
};

export default measureRoute;