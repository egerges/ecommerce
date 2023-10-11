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

    const nursesList = [];

    function populateNurses(id) {
        UIModal.addClass(document.querySelector(UIDOM.loaderModal), 'show-modal');

        apiCtrl.getAllNurses(window.localStorage.getItem("auth_token"))
        .then(response => response.json())
        .then(data => {
            if(!data.error) {
                const nurses = data.nurses.data;

                let list = document.querySelector(DOM.lstNurses);

                for(var i=0; i<nurses.length; i++) {
                    var opt = document.createElement("option");
                    opt.value = nurses[i]._id;
                    opt.innerHTML = nurses[i].firstname + " " + nurses[i].lastname;

                    if(id === nurses[i]._id) {
                        opt.selected = true;
                    }

                    // then append it to the select element
                    list.appendChild(opt);

                    nursesList.push({
                        "id": nurses[i]._id,
                        "name": nurses[i].firstname + " " + nurses[i].lastname
                    });
                }
                
            } else {
                UIModal.showErrorAlert("Fetch Failed", data.error_message);
            }
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        }).catch(error => {
            UIModal.showErrorAlert("Fetch Failed", error);
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        });
    }

    function checkLogin() {
        if(window.localStorage.getItem("auth_token") == null) {
            UIModal.showErrorAlert("Session Inavailable", "Please Login again.");
            setTimeout(() => {
                window.localStorage.clear();
                window.location.replace("./home.html");
            }, 1000);
        }
    }

    function handlePopulatePerson() {
        UIModal.addClass(document.querySelector(UIDOM.loaderModal), 'show-modal');

        var form = document.querySelector(DOM.frmPerson);

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('p');

        apiCtrl.getInfectedPerson(window.localStorage.getItem("auth_token"), id)
        .then(response => response.json())
        .then(data => {
            if(!data.error) {
                const person = data.person.data;
                form["fname"].value = person.firstname;
                form["lname"].value = person.lastname;
                form["dob"].value = formatedDate(person.dob);
                form["residency"].value = person.residency;
                form["dateinfected"].value = formatedDate(person.date_infected);
                form["cq"].value = person.cq;
                form["lastpcr"].value = formatedDate(person.date_last_PCR);
                form["mobile"].value = person.phonenumber;
                form["emergencycontact"].value = person.emergencynumber;
                populateNurses(person.nurse);
                form["address"].value = person.address;
                populateStatus(person.status);
            } else {
                UIModal.showErrorAlert("Fetch Failed", data.error_message);
            }
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        }).catch(error => {
            UIModal.showErrorAlert("Fetch Failed", error);
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        });
    }

    function handleUpdate() {
        UIModal.addClass(document.querySelector(UIDOM.loaderModal), 'show-modal');

        var form = document.querySelector(DOM.frmPerson);

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const id = urlParams.get('p');

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

        apiCtrl.updatePerson(window.localStorage.getItem("auth_token"), id, data)
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

    function populateStatus(status) {
        status = (status === 1 ? "positive" : "negative");
        var list = document.querySelector(DOM.frmPerson)["status"].options;
        for(var i=0; i<list.length; i++) {
            if(list[i].value === status) {
                list[i].selected = true;
            }
        }
    }

    function formatedDate(date) {
        var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [year, month, day].join('-');
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
            handleUpdate();
            e.preventDefault();
        });
    }

    return {
        init: function() {
            setEventListeners();
            checkLogin();
            handlePopulatePerson();
        }
    };
})(api, UIController, UIModal);

window.addEventListener('DOMContentLoaded', () => {
    controller.init();
});