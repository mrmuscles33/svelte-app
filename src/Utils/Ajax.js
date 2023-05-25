const Ajax = {
    url: 'http://localhost/php-app/test.php',
    send: (servlet, method, params, success, fail) => {
        let xhttp = new XMLHttpRequest();
        xhttp.open("POST", Ajax.url, true);
        xhttp.setRequestHeader("Content-Type", "application/json");
        xhttp.setRequestHeader("Access-Control-Allow-Origin", "*");
        xhttp.setRequestHeader("Access-Control-Allow-Headers", "*");
        xhttp.setRequestHeader("Access-Control-Max-Age", "3600");
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText);
                if(response.error) {
                    fail(response);
                } else {
                    success(response.datas);
                }
            }
        };
        xhttp.send(JSON.stringify({
            'servlet': servlet,
            'method': method,
            'params': params
        }));
    }
};
export default Ajax;