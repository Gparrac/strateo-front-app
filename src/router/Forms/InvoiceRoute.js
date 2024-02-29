import InvoiceView from '@/views/Forms/InvoiceView.vue';

const invoiceRoute = {
    path: 'invoices',
    component: InvoiceView,
    children: [
      {
        path: '',
        name: 'Invoice',
        component: InvoiceView,
      },
      {
        path: 'create',
        name: 'InvoiceCreate',
        component: InvoiceView,
      },
      {
        path: 'edit/:InvoiceId',
        name: 'InvoiceEdit',
        component: InvoiceView,
      },
      {
        // Redirect /Invoice/edit to /Invoice if there is no InvoiceId
        path: 'edit',
        redirect: to => {
          // Check if a InvoiceId is provided
          if (!to.params.InvoiceId) {
            return { name: 'Invoice' }; // Redirect to the 'Invoice' route
          }
        },
      },
    ],
};

export default invoiceRoute;
