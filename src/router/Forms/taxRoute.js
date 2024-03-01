import TaxView from '@/views/Forms/TaxView.vue';

const taxRoute = {
    path: 'taxes',
    component: TaxView,
    children: [
      {
        path: '',
        name: 'Tax',
        component: TaxView,
      },
      {
        path: 'create',
        name: 'TaxCreate',
        component: TaxView,
      },
      {
        path: 'edit/:TaxId',
        name: 'TaxEdit',
        component: TaxView,
      },
      {
        // Redirect /Tax/edit to /Tax if there is no TaxId
        path: 'edit',
        redirect: to => {
          // Check if a TaxId is provided
          if (!to.params.TaxId) {
            return { name: 'Tax' }; // Redirect to the 'Tax' route
          }
        },
      },
    ],
};

export default taxRoute;