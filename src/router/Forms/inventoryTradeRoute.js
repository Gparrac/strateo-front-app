import InventoryView from '@/views/Forms/InventoryView.vue';

const inventoryTrade = {
    path: 'inventory-trades',
    component: InventoryView,
    children: [
      {
        path: '',
        name: 'InventoryTrade',
        component: InventoryView,
      },
      {
        path: 'create',
        name: 'InventoryTradeCreate',
        component: InventoryView,
      },
      {
        path: 'edit/:itemId',
        name: 'InventoryTradeEdit',
        component: InventoryView,
      },
      {
        // Redirect /users/edit to /users if there is no userId
        path: 'edit',
        redirect: to => {
          // Check if a userId is provided
          if (!to.params.itemId) {
            return { name: 'InventoryTrade' }; // Redirect to the 'Users' route
          }
        },
      },
    ],
};

export default inventoryTrade;
