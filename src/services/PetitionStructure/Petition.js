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
    get(url, query = '', token = false){
      if(query.length != 0) query = `?${query}`
        return new Promise((resolve, reject) => {
            fetch(`${this.routeEndpoint}${url}${query}`, {
                method: 'GET',
                headers: this.headers(token),
            })
            .then(res => {
                return res.json().then(data => {
                    data.statusResponse = res.status;
                    return data;
                });
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
        })
    }
    getFile(url, query = '', token = false, fileName = 'datos.xlsx'){
      if(query.length != 0) query = `?${query}`

            fetch(`${this.routeEndpoint}${url}${query}`, {
                method: 'GET',
                headers: this.headers(token),
            })
            .then(response => response.blob())
            .then(blob => {
              const url = window.URL.createObjectURL(blob);

              // Crea un enlace temporal y haz clic en él para descargar el archivo
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', fileName);
              document.body.appendChild(link);
              link.click();

              // Libera los recursos del enlace temporal
              window.URL.revokeObjectURL(url);
              document.body.removeChild(link);

            })


    }

    /**
     *
     * @param {string with the url to the endponit service} url
     * @param {formData object with the necesary attributes to the post endpoint service} body
     * @returns return a promise that gives the backend's data or and error with its message
     */
    post(url, body, token = false){
        return new Promise((resolve, reject) => {
            fetch(`${this.routeEndpoint}${url}`, {
                method: 'POST',
                headers: this.headers(token),
                body: body
            })
            .then(res => {
                return res.json().then(data => {
                    data.statusResponse = res.status;
                    return data;
                });
            })
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
    put(url, body, token = false, query){
        return new Promise((resolve, reject) => {
            fetch(`${this.routeEndpoint}${url}?_method=PUT&${query}`, {
                method: 'POST',
                headers: this.headers(token),
                body: body
            })
            .then(res => {
                return res.json().then(data => {
                    data.statusResponse = res.status;
                    return data;
                });
            })
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
    delete(url, query = '', token = false){
        return new Promise((resolve, reject) => {
            fetch(`${this.routeEndpoint}${url}${query}`, {
                method: 'DELETE',
                headers: this.headers(token),
            })
            .then(res => {
                return res.json().then(data => {
                    data.statusResponse = res.status;
                    return data;
                });
            })
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
    headers(token = false) {
        const headers = new Headers({
          "X-Requested-With": "XMLHttpRequest",
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true'

        });

        if (token) {
          const authToken = localStorage.getItem('auth-token');
          authToken && headers.append("Authorization", `Bearer ${authToken}`);
        }
        return headers;
    }
}
