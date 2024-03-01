import EmployeeView from '@/views/Forms/EmployeeView.vue';

const employeeRoute = {
    path: 'employees',
    component: EmployeeView,
    children: [
      {
        path: '',
        name: 'Employee',
        component: EmployeeView,
      },
      {
        path: 'create',
        name: 'EmployeeCreate',
        component: EmployeeView,
      },
      {
        path: 'edit/:employeeId',
        name: 'EmployeeEdit',
        component: EmployeeView,
      },
      {
        // Redirect /users/edit to /users if there is no employeeId
        path: 'edit',
        redirect: to => {
          // Check if a employeeId is provided
          if (!to.params.employeeId) {
            return { name: 'Employee' }; // Redirect to the 'Users' route
          }
        },
      },
    ],
};

export default employeeRoute;
