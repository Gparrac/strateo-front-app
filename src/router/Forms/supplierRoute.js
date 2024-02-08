import SupplierView from '@/views/Forms/SupplierView.vue';

const suppliersRoute = {
    path: 'suppliers',
    component: SupplierView,
    children: [
      {
        path: '',
        name: 'Supplier',
        component: SupplierView,
      },
      {
        path: 'create',
        name: 'SupplierCreate',
        component: SupplierView,
      },
      {
        path: 'edit/:userId',
        name: 'supplierEdit',
        component: SupplierView,
      },
      {
        // Redirect /users/edit to /users if there is no userId
        path: 'edit',
        redirect: to => {
          // Check if a userId is provided
          if (!to.params.userId) {
            return { name: 'Supplier' }; // Redirect to the 'Users' route
          }
        },
      },
    ],
};

export default suppliersRoute;
