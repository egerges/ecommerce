'use strict';

//UI Controller 
const UIController = (function () {
    const DOM = {
        
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

    function getAll() {
        UIModal.addClass(document.querySelector(UIDOM.loaderModal), 'show-modal');

        apiCtrl.getAllInfectedPeople(window.localStorage.getItem("auth_token"))
        .then(response => response.json())
        .then(data => {
            if(!data.error) {
                const tbl = document.querySelector(DOM.tblInfectedPeople);
                const people = data.people;
                const peopleList = people.data;
                for(var i=0; i<people.count; i++) {
                    var person = peopleList[i];
                    var tr = document.createElement("tr");
                    var firstname = document.createElement("td");
                    var lastname = document.createElement("td");
                    var timeRemaining = document.createElement("td");

                    firstname.innerText = person.firstname;
                    lastname.innerText = person.lastname;
                    timeRemaining.innerText = calculateTimeRemaining(person.date_infected);

                    tr.appendChild(firstname);
                    tr.appendChild(lastname);
                    tr.appendChild(timeRemaining);
                    tr.setAttribute("personId", person._id);
                    tr.addEventListener('click', (e) => {
                        handleOpenPersonalDetailsCard(e.currentTarget.getAttribute("personId"));
                    });

                    tbl.appendChild(tr);
                }
            } else {
                UIModal.showErrorAlert("Fetch Failed", data.error_message);
            }
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        }).catch(error => {
            UIModal.showErrorAlert("Fetch Failed", error.error_message);
        });
    }

    function handleStatusContext(element, status) {
        if(status === 1) {
            element.innerHTML = "Positive";
            element.style.backgroundColor = "red";
        } else if(status === 0) {
            element.innerHTML = "Negative";
            element.style.backgroundColor = "green";
        } else {
            throw new Error("Status Error");
        }
    }

    function handleOpenPersonalDetailsCard(id) {
        UIModal.addClass(document.querySelector(UIDOM.loaderModal), 'show-modal');

        apiCtrl.getInfectedPerson(window.localStorage.getItem("auth_token"), id)
        .then(response => response.json())
        .then(data => {
            if(!data.error) {
                const person = data.person.data;
                UIModal.makeVisible(document.querySelector(DOM.personalDetailsCard));
                document.querySelector(DOM.txtPersonalFirstname).innerHTML = person.firstname;
                document.querySelector(DOM.txtPersonalLastname).innerHTML = person.lastname;
                document.querySelector(DOM.txtPersonalDob).innerHTML = formatedDate(person.dob);
                document.querySelector(DOM.txtPersonalResidency).innerHTML = person.residency;
                document.querySelector(DOM.txtPersonalDateInfected).innerHTML = formatedDate(person.date_infected);
                document.querySelector(DOM.txtPersonalCq).innerHTML = person.cq;
                document.querySelector(DOM.txtPersonalDateofLastPCR).innerHTML = formatedDate(person.date_last_PCR);
                document.querySelector(DOM.txtPersonalRemaingDays).innerHTML = calculateTimeRemaining(person.date_infected);
                document.querySelector(DOM.txtPersonalMobile).innerHTML = person.phonenumber;
                document.querySelector(DOM.txtPersonalEmergencyNumber).innerHTML = person.emergencynumber;
                document.querySelector(DOM.txtPersonalNurse).innerHTML = getNurseBy(person.nurse);
                document.querySelector(DOM.txtPersonalAddress).innerHTML = person.address;
                handleStatusContext(document.querySelector(DOM.txtStatusTag), person.status);
                handleEditBtn(id);
            } else {
                UIModal.showErrorAlert("Fetch Failed", data.error_message);
            }
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        }).catch(error => {
            UIModal.showErrorAlert("Fetch Failed", error);
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        });
    }

    function handleEditBtn(id) {
        document.querySelector(DOM.btnEdit).setAttribute("data-id", id);
    }

    function calculateTimeRemaining(time) {
        var r = Math.round((addDays(new Date(time), QUARANTINE_DAYS).getTime()  -  new Date().getTime()) / (1000 * 3600 * 24));
        if(r < 0) {
            return 0;
        }
        return r;
    }

    function addDays(date, days) {
        const copy = new Date(Number(date))
        copy.setDate(date.getDate() + days)
        return copy
    }

    function formatedDate(date) {
        var d = new Date(date);
        return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
    }

    function logout() {
        UIModal.showSuccessAlert("Thank you!", "Have a great day.");
        setTimeout(() => {
            window.localStorage.clear();
            window.location.replace("./home.html");
        }, 2000);
    }

    const setEventListeners = () => {
        document.querySelector(DOM.btnLogout).addEventListener('click', () => {
            //logout();
        });

        document.querySelector(DOM.btnTop).addEventListener('click', () => {
            topFunction();
        });

        document.querySelector(DOM.btnClosePersonalCard).addEventListener('click', () => {
            UIModal.makeInvisible(document.querySelector(DOM.personalDetailsCard));
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        });

        window.onscroll = function() {scrollFunction()};
    }

    function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          document.querySelector(DOM.btnTop).style.display = "block";
        } else {
            document.querySelector(DOM.btnTop).style.display = "none";
        }
    }

    function topFunction() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    }

    return {
        init: function() {
            setEventListeners();
            //checkLogin();
            // setInterval(() => {
            //     checkLogin();
            // }, 600000);
            // setTimeout(() => {
            //     window.localStorage.removeItem("auth_token");
            // }, 1200000);
            // getAll();
        }
    };
})(api, UIController, UIModal);

window.addEventListener('DOMContentLoaded', () => {
    controller.init();
});