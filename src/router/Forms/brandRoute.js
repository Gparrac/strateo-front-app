import BrandView from '@/views/Forms/BrandView.vue';

const brandRoute = {
    path: 'brands',
    component: BrandView,
    children: [
      {
        path: '',
        name: 'Brand',
        component: BrandView,
      },
      {
        path: 'create',
        name: 'BrandCreate',
        component: BrandView,
      },
      {
        path: 'edit/:BrandId',
        name: 'BrandEdit',
        component: BrandView,
      },
      {
        // Redirect /Brand/edit to /Brand if there is no BrandId
        path: 'edit',
        redirect: to => {
          // Check if a BrandId is provided
          if (!to.params.BrandId) {
            return { name: 'Brand' }; // Redirect to the 'Brand' route
          }
        },
      },
    ],
};

export default brandRoute;