function getFormRoute(route){
    const fullPath = route.fullPath;
    // Split the fullPath into segments and get the second one
    const segments = fullPath.split('/');
    const secondPath = segments[2];

    if(!secondPath) return {isForm: false, idEditForm: null};

    return {
        isForm: true,
        idEditForm: secondPath == 'edit' ? parseInt(segments[3]) : null,
    }
}

export {getFormRoute}