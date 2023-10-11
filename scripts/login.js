'use strict';

//UI Controller 
const UIController = (function () {
    const DOM = {
        btnLogin: '#btnLogin',

        txtUsername: '#username',
        txtPassword: '#password',
    };

    return {
        getDOMStrings: function() {
            return DOM;
        }
    }
})();

// Global App Controller 
const controller = (function (apiCtrl, UICtrl, UIModal) {
    const DOM = UICtrl.getDOMStrings();
    const UIDOM = UIModal.getUIDOMStrings();

    function login() {
        UIModal.addClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        const username = document.querySelector(DOM.txtUsername).value;
        const password = document.querySelector(DOM.txtPassword).value;

        if(!username) {
            UIModal.showErrorAlert('Missing Fields', 'Username is a required field');
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
            return;
        }

        if(!password) {
            UIModal.showErrorAlert('Missing Fields', 'Password is a required field');
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
            return;
        }

        apiCtrl.login(username, password)
        .then(response => response.json())
        .then(data => {
            if(!data.error) {
                window.localStorage.setItem("auth_token", data.auth_token);
                window.localStorage.setItem("uuid", data.emp_id);
                UIModal.showSuccessAlert(data.message, "You are being redirected");
                setTimeout(() => {
                    window.location.replace("./main.html");
                }, 1000);
            } else {
                UIModal.showErrorAlert('Login Failed', data.error_message);
            }
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        }).catch(error => {
            UIModal.showErrorAlert('Fetch Failed', error);
        });
    }

    const setEventListeners = () => {
        document.querySelector(DOM.btnLogin).addEventListener('click', (e) => {
            login();
            e.preventDefault();
        });

        document.querySelector(DOM.txtUsername).addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
              // Cancel the default action, if needed
              event.preventDefault();
              // Trigger the button element with a click
              login();
            }
        });

        document.querySelector(DOM.txtPassword).addEventListener("keyup", function(event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
              // Cancel the default action, if needed
              event.preventDefault();
              // Trigger the button element with a click
              login();
            }
        });
    }

    return {
        init: function() {
            setEventListeners();
        }
    };
})(api, UIController, UIModal);

window.addEventListener('DOMContentLoaded', () => {
    controller.init();
});