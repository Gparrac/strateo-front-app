export default class FormsFactory {
    create(body){
        throw new Error("create method not implemented");
    }
    read(query = null){
        throw new Error("read method not implemented");
    }
    update(body){
        throw new Error("update method not implemented");
    }
    delete(query = null){
        throw new Error("delete method not implemented");
    }
}