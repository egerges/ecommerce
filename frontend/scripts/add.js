'use strict';

//UI Controller 
const UIController = (function () {
    const DOM = {
        btnLogout: '#btnLogout',
        btnAdd: "#btnAdd",

        lstNurses: "#nurse",

        frmPerson: "#addInfectedPerson",
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
                window.location.replace("./home.html");
            }, 1000);
        }
    }

    function handleAdd() {
        UIModal.addClass(document.querySelector(UIDOM.loaderModal), 'show-modal');

        var form = document.querySelector(DOM.frmPerson);

        var data = {
            "firstname": form["fname"].value,
            "lastname": form["lname"].value,
            "dob": form["dob"].value,
            "date_infected": form["dateinfected"].value,
            "date_last_PCR": form["lastpcr"].value,
            "cq": form["cq"].value,
            "phonenumber": form["mobile"].value,
            "address": form["address"].value,
            "residency": form["residency"].value,
            "nurse": form["nurse"].value,
            "emergencynumber": form["emergencycontact"].value,
            "status": (form["status"].value === "positive" ? 1 : 0)
        }

        apiCtrl.addPerson(window.localStorage.getItem("auth_token"), data)
        .then(response => response.json())
        .then(data => {
            if(!data.error) {
                UIModal.showSuccessAlert(data.message, "You are being redirected to Main page.");
                setTimeout(() => {
                    window.location.replace('./main.html');
                }, 2000);
            } else {
                UIModal.showErrorAlert("Fetch Failed", data.error_message);
            }
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
            
        }).catch(error => {
            UIModal.showErrorAlert("Fetch Failed", error);
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        });
    }

    function logout() {
        UIModal.showSuccessAlert("Thank you!", "You are a hero.");
        setTimeout(() => {
            window.localStorage.clear();
            window.location.replace("./home.html");
        }, 2000);
    }

    const setEventListeners = () => {
        document.querySelector(DOM.btnLogout).addEventListener('click', () => {
            logout();
        });

        document.querySelector(DOM.btnAdd).addEventListener('click', (e) => {
            handleAdd();
            e.preventDefault();
        });
    }

    return {
        init: function() {
            setEventListeners();
            //checkLogin();
        }
    };
})(api, UIController, UIModal);

window.addEventListener('DOMContentLoaded', () => {
    controller.init();
});