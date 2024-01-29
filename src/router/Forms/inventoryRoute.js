import InventoryView from '@/views/Forms/InventoryView.vue';

const inventoriesRoute = {
    path: 'inventories',
    component: InventoryView,
    children: [
      {
        path: '',
        name: 'Inventory',
        component: InventoryView,
      },
      {
        path: 'create',
        name: 'InventoryCreate',
        component: InventoryView,
      },
      {
        path: 'edit/:inventoryId',
        name: 'InventoryEdit',
        component: InventoryView,
      },
      {
        // Redirect /users/edit to /users if there is no userId
        path: 'edit',
        redirect: to => {
          // Check if a userId is provided
          if (!to.params.userId) {
            return { name: 'Inventory' }; // Redirect to the 'Users' route
          }
        },
      },
    ],
};

export default inventoriesRoute;
