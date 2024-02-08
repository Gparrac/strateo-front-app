import WarehouseView from '@/views/Forms/WarehouseView.vue';

const warehouseRoute = {
    path: 'warehouses',
    component: WarehouseView,
    children: [
      {
        path: '',
        name: 'Warehouse',
        component: WarehouseView,
      },
      {
        path: 'create',
        name: 'WarehouseCreate',
        component: WarehouseView,
      },
      {
        path: 'edit/:WarehouseId',
        name: 'WarehouseEdit',
        component: WarehouseView,
      },
      {
        // Redirect /Warehouse/edit to /Warehouse if there is no WarehouseId
        path: 'edit',
        redirect: to => {
          // Check if a WarehouseId is provided
          if (!to.params.WarehouseId) {
            return { name: 'Warehouse' }; // Redirect to the 'Warehouse' route
          }
        },
      },
    ],
};

export default warehouseRoute;