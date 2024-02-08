import FieldView from '@/views/Forms/FieldView.vue';

const fieldRoute = {
    path: 'fields',
    component: FieldView,
    children: [
      {
        path: '',
        name: 'Fields',
        component: FieldView,
      },
      {
        path: 'create',
        name: 'FieldsCreate',
        component: FieldView,
      },
      {
        path: 'edit/:userId',
        name: 'FieldsEdit',
        component: FieldView,
      },
      {
        // Redirect /users/edit to /users if there is no userId
        path: 'edit',
        redirect: to => {
          // Check if a userId is provided
          if (!to.params.userId) {
            return { name: 'Fields' }; // Redirect to the 'Users' route
          }
        },
      },
    ],
};

export default fieldRoute;
