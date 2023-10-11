const api = (function () {

    const baseUrl = 'http://localhost:2003/backoffice/'; //API URL

    const config = {
        headers: {
            'content-type' : 'application/json'
        }
    };

    function login(username, password) {
        var url = baseUrl + 'login';
        var data = {
            "username": username,
            "password": password
        };

        return fetch(url, {method: 'POST', body:JSON.stringify(data), ...config});
    }

    function getEmployee(id, token) {
        var url = baseUrl + 'employee/' + id;
        config.headers["auth-token"] = token;

        return fetch(url, {method: 'GET', ...config});
    }

    function getEmployees(token) {
        var url = baseUrl + 'employees';
        config.headers["auth-token"] = token;

        return fetch(url, {method: 'GET', ...config});
    }

    function getProducts(token) {
        var url = baseUrl + 'products';
        config.headers["auth-token"] = token;

        return fetch(url, {method: 'GET', ...config});
    }

    function getProduct(token, criteria, id) {
        var url = baseUrl + 'product';
        config.headers["auth-token"] = token;

        var body = {};
        body[criteria] = id;

        return fetch(url, {method: 'POST', body:JSON.stringify(body), ...config});
    }

    /*function addPerson(token, data) {
        var url = baseUrl + 'posts/addPerson';
        config.headers["auth-token"] = token;
        return fetch(url, {method: 'POST', body:JSON.stringify(data), ...config});
    }

    function updatePerson(token, id, data) {
        var url = baseUrl + 'posts/person/' + id;
        config.headers["auth-token"] = token;
        return fetch(url, {method: 'PUT', body:JSON.stringify(data), ...config});
    }

    function getAllInfectedPeople(token) {
        var url = baseUrl + 'posts/getAll';
        config.headers["auth-token"] = token;
        return fetch(url, {method: 'GET', ...config});
    }

    function getAllNurses(token) {
        var url = baseUrl + 'posts/getNurses';
        config.headers["auth-token"] = token;
        return fetch(url, {method: 'GET', ...config});
    }

    function getInfectedPerson(token, id) {
        var url = baseUrl + 'posts/get';
        config.headers["auth-token"] = token;
        url = url + "/" + id;
        return fetch(url, {method: 'GET', ...config});
    }*/

    return {
        login,
        getEmployee,
        getProducts,
        getProduct,
        /*getAllInfectedPeople,
        getInfectedPerson,
        getAllNurses,
        addPerson,
        updatePerson*/
    };
})();