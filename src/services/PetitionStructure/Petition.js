export default class Petition {
    /**
     * constructor method that inicialices env
     */
    constructor(){
        this.routeEndpoint = import.meta.env.VITE_API_URL;
    }
    /**
     *
     * @param {string with the url to the endponit service} url
     * @param {string query with the necesary params to the get endpoint service} query
     * @returns return a promise that gives the backend's data or and error with its message
     */
    get(url, query = null){
        return new Promise((resolve, reject) => {
            fetch(`${this.routeEndpoint}${url}${query}`, {
                method: 'GET',
                headers: this.headers(),
            })
            .then(res => res.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        })
    }

    /**
     *
     * @param {string with the url to the endponit service} url
     * @param {formData object with the necesary attributes to the post endpoint service} body
     * @returns return a promise that gives the backend's data or and error with its message
     */
    post(url, body){
        return new Promise((resolve, reject) => {
            let headers = this.headers();
            fetch(`${this.routeEndpoint}${url}`, {
                method: 'POST',
                headers: headers,
                body: body
            })
            .then(res => res.json())
            .then(data => {
                resolve(data)
            })
            .catch(error => {
                reject(error);
            });
        })
    }
    /**
     *
     * @param {string with the url to the endponit service} url
     * @param {object formData with the necesary attributes to the get endpoint service} query
     * @returns return a promise that gives the backend's data or and error with its message
     */
    put(url, body){
        return new Promise((resolve, reject) => {
            let headers = this.headers();
            fetch(`${this.routeEndpoint}${url}?_method=PUT`, {
                method: 'POST',
                headers: headers,
                body: body
            })
            .then(res => res.json())
            .then(data => {
                resolve(data)
            })
            .catch(error => {
                reject(error);
            });
        })
    }
    /**
     *
     * @param {string with the url to the endponit service} url
     * @param {string query with the necesary params to the put endpoint service} query
     * @returns return a promise that gives the backend's data or and error with its message
     */
    delete(url, query = null){
        return new Promise((resolve, reject) => {
            fetch(`${this.routeEndpoint}${url}${query}`, {
                method: 'DELETE',
                headers: this.headers(),
            })
            .then(res => res.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        })
    }
    /**
     *
     * @returns headers necesary for the fetch call
     */
    headers(){
        let headers = new Headers();
        headers.append("X-Requested-With", "XMLHttpRequest");
        return headers;
    }
}
