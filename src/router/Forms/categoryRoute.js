import CategoryView from '@/views/Forms/CategoryView.vue';

const categoryRoute = {
    path: 'categories',
    component: CategoryView,
    children: [
      {
        path: '',
        name: 'Category',
        component: CategoryView,
      },
      {
        path: 'create',
        name: 'CategoryCreate',
        component: CategoryView,
      },
      {
        path: 'edit/:CategoryId',
        name: 'CategoryEdit',
        component: CategoryView,
      },
      {
        // Redirect /Category/edit to /Category if there is no CategoryId
        path: 'edit',
        redirect: to => {
          // Check if a CategoryId is provided
          if (!to.params.CategoryId) {
            return { name: 'Category' }; // Redirect to the 'Category' route
          }
        },
      },
    ],
};

export default categoryRoute;