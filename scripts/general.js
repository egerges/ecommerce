'use strict';

//UI Controller 
const UIController = (function () {
    const DOM = {
        btnLogout: '#btnLogout',
        lblAdminName: '#admin-name',
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

    function checkLogin() {
        if(window.localStorage.getItem("auth_token") == null) {
            UIModal.showErrorAlert("Session Inavailable", "Please Login again.");
            setTimeout(() => {
                window.localStorage.clear();
                window.location.replace("./login.html");
            }, 1000);
        }
    }

    function setSelf() {
        UIModal.addClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        apiCtrl.getEmployee(window.localStorage.getItem("uuid"), window.localStorage.getItem("auth_token"))
        .then(response => response.json())
        .then(employee => {
            if(!employee.error) {
                document.querySelector(DOM.lblAdminName).innerText = employee.data.firstname + ' ' + employee.data.lastname;
            } else {
                UIModal.showErrorAlert("Fetch Failed", employee.error_message);
            }
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        }).catch(error => {
            UIModal.showErrorAlert("Fetch Failed", error.error_message);
            console.log('error', error);
        });
    }

    function logout() {
        UIModal.showSuccessAlert("Thank you!", "Have a great day.");
        setTimeout(() => {
            window.localStorage.clear();
            window.location.replace("./login.html");
        }, 2000);
    }

    const setEventListeners = () => {
        document.querySelector(DOM.btnLogout).addEventListener('click', () => {
            logout();
        });
    }

    return {
        init: function() {
            setEventListeners();
            checkLogin();
            setInterval(() => {
                checkLogin();
            }, 600000);
            setTimeout(() => {
                window.localStorage.removeItem("auth_token");
            }, 1200000);
            setSelf();
        }
    };
})(api, UIController, UIModal);

window.addEventListener('DOMContentLoaded', () => {
    controller.init();
});