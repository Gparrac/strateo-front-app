import SupplierView from '@/views/Forms/SupplierView.vue';

const suppliersRoute = {
    path: 'suppliers',
    component: SupplierView,
    children: [
      {
        path: '',
        name: 'Suppliers',
        component: SupplierView,
      },
      {
        path: 'create',
        name: 'SuppliersCreate',
        component: SupplierView,
      },
      {
        path: 'edit/:userId',
        name: 'suppliersEdit',
        component: SupplierView,
      },
      {
        // Redirect /users/edit to /users if there is no userId
        path: 'edit',
        redirect: to => {
          // Check if a userId is provided
          if (!to.params.userId) {
            return { name: 'Suppliers' }; // Redirect to the 'Users' route
          }
        },
      },
    ],
};

export default suppliersRoute;
