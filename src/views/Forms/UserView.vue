<template>
    <div>
        <h1 class="pb-7">{{ titleView }}</h1>
        <div>
            <FormUser v-if="isForm" :idEditForm="idEditForm" />
            <TableUser v-else />
        </div>
        <div>
    </div>
    </div>
</template>

<script>
    import { FormUser, TableUser } from '../../components/Forms/User/index.vue';
    import { getFormRoute } from '@/utils/routes.js';

    export default  {
        name: 'UserView',
        data: () => ({
            titleView: 'Parametrización de Usuarios',

            isForm: false,
            idEditForm: null,
        }),
        created(){
            const typeRoute = getFormRoute(this.$route);
            this.isForm = typeRoute.isForm;
            this.idEditForm = typeRoute.idEditForm;
        },
        components:{
            FormUser,
            TableUser,
        },
    }
</script>