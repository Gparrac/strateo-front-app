import ProductView from '@/views/Forms/ProductView.vue';

const productRoute = {
    path: 'products',
    component: ProductView,
    children: [
      {
        path: '',
        name: 'Product',
        component: ProductView,
      },
      {
        path: 'create',
        name: 'ProductCreate',
        component: ProductView,
      },
      {
        path: 'edit/:ProductId',
        name: 'ProductEdit',
        component: ProductView,
      },
      {
        // Redirect /Product/edit to /Product if there is no ProductId
        path: 'edit',
        redirect: to => {
          // Check if a ProductId is provided
          if (!to.params.ProductId) {
            return { name: 'Product' }; // Redirect to the 'Brand' route
          }
        },
      },
    ],
};

export default productRoute;
