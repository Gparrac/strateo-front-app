import EnterpriseView from '@/views/Forms/EnterpriseView.vue';

const enterpriseRoute = {
    path: 'enterprises',
    component: EnterpriseView,
    children: [
      {
        path: '',
        name: 'Enterprises',
        component: EnterpriseView,
      },
    ],
};

export default enterpriseRoute;
