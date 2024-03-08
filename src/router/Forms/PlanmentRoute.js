import PlanmentView from '@/views/Forms/PlanmentView.vue';

const planementRoute = {
    path: 'planments',
    component: PlanmentView,
    children: [
      {
        path: '',
        name: 'Planment',
        component: PlanmentView,
      },
      {
        path: 'create',
        name: 'PlanmentCreate',
        component: PlanmentView,
      },
      {
        path: 'edit/:PlanmentId',
        name: 'PlanmentEdit',
        component: PlanmentView,
      },
      {
        // Redirect /Planment/edit to /Planment if there is no PlanmentId
        path: 'edit',
        redirect: to => {
          // Check if a PlanmentId is provided
          if (!to.params.PlanmentId) {
            return { name: 'Planment' }; // Redirect to the 'Planment' route
          }
        },
      },
    ],
};

export default planementRoute;
