import UserView from '@/views/Forms/UserView.vue';

const usersRoute = {
    path: 'users',
    component: () => UserView,
    children: [
      {
        path: '',
        name: 'Users',
        component: () => UserView,
      },
      {
        path: 'create',
        name: 'UsersCreate',
        component: () => UserView,
      },
      {
        path: 'edit/:userId',
        name: 'UsersEdit',
        component: () => UserView,
      },
      {
        // Redirect /users/edit to /users if there is no userId
        path: 'edit',
        redirect: to => {
          // Check if a userId is provided
          if (!to.params.userId) {
            return { name: 'Users' }; // Redirect to the 'Users' route
          }
        },
      },
    ],
};

export default usersRoute;