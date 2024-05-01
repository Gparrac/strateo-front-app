import PaymentView from '@/views/Forms/PaymentView.vue';

const paymentRoute = {
    path: 'payments',
    component: PaymentView,
    children: [
      {
        path: '',
        name: 'Payment',
        component: PaymentView,
      },
    ],
};

export default paymentRoute;
