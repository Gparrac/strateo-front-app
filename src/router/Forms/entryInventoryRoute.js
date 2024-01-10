import InventoryView from '@/views/Forms/InventoryView.vue';

const entryInventoryRoute = {
    path: 'entry-inventory',
    component: InventoryView,
    children: [
      {
        path: '',
        name: 'EntryInventory',
        component: InventoryView,
      },
      {
        path: 'create',
        name: 'EntryInventoryCreate',
        component: InventoryView,
      },
      {
        path: 'edit/:itemId',
        name: 'EntryInventoryEdit',
        component: InventoryView,
      },
      {
        // Redirect /users/edit to /users if there is no userId
        path: 'edit',
        redirect: to => {
          // Check if a userId is provided
          if (!to.params.itemId) {
            return { name: 'EntryInventory' }; // Redirect to the 'Users' route
          }
        },
      },
    ],
};

export default entryInventoryRoute;
