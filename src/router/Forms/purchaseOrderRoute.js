import PurchaseOrderView from '@/views/Forms/PurchaseOrderView.vue';

const purchaseOrderRoute = {
    path: 'purchase-orders',
    component: PurchaseOrderView,
    children: [
      {
        path: '',
        name: 'PurchaseOrder',
        component: PurchaseOrderView,
      },
      {
        path: 'create',
        name: 'PurchaseOrderCreate',
        component: PurchaseOrderView,
      },
      {
        path: 'edit/:PurchaseOrderId',
        name: 'PurchseOrderEdit',
        component: PurchaseOrderView,
      },
      {
        // Redirect /PurchaseOrder/edit to /PurchaseOrder if there is no WarehouseId
        path: 'edit',
        redirect: to => {
          // Check if a WarehouseId is provided
          if (!to.params.PurchaseOrderId) {
            return { name: 'PurchaseOrder' }; // Redirect to the 'PurchaseOrder' route
          }
        },
      },
    ],
};

export default purchaseOrderRoute;
