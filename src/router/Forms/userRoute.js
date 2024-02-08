import UserView from '@/views/Forms/UserView.vue';

const userRoute = {
    path: 'users',
    component: UserView,
    children: [
      {
        path: '',
        name: 'User',
        component: UserView,
      },
      {
        path: 'create',
        name: 'UserCreate',
        component: UserView,
      },
      {
        path: 'edit/:userId',
        name: 'UserEdit',
        component: UserView,
      },
      {
        // Redirect /users/edit to /users if there is no userId
        path: 'edit',
        redirect: to => {
          // Check if a userId is provided
          if (!to.params.userId) {
            return { name: 'User' }; // Redirect to the 'Users' route
          }
        },
      },
    ],
};

export default userRoute;
