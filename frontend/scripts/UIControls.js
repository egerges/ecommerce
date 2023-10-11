'use strict';

//UI Controller 
const UIModal = (function () {
    const DOMstrings = {
        loaderModal: "#loader-modal",
 
        successAlert: "#success-alert",
        errorAlert: "#error-alert",
        successCloseBtn: "#success-close-btn",
        errorCloseBtn: "#error-close-btn",
        successTitle: '#success-title',
        successMessage: '#success-message',
        errorTitle: '#error-title',
        errorMessage: '#error-message',
    };

    return {
        getUIDOMStrings: function() {
            return DOMstrings;
        },

        toggleClass: function(elem, cls){
            elem.classList.toggle(cls);
        },

        makeVisible: function(elem){
            elem.style.visibility = "visible";  
            elem.style.opacity = 1;  
        },

        makeInvisible: function(elem){
            elem.style.visibility = "hidden";  
            elem.style.opacity = 0;  
        },
 
        addClass: function(elem, cls){
            if(!elem.classList.contains(cls))
                elem.classList.add(cls);   
        },
 
        removeClass: function(elem, cls){
            if(elem.classList.contains(cls))
                elem.classList.remove(cls);   
        },
 
        showErrorAlert: function(title, message){
            this.addClass(document.querySelector(DOMstrings.errorAlert), 'show-alert');
            document.querySelector(DOMstrings.errorTitle).innerHTML = title;
            document.querySelector(DOMstrings.errorMessage).innerHTML = message;
        },
 
        showSuccessAlert: function(title, message){
            this.addClass(document.querySelector(DOMstrings.successAlert), 'show-alert');
            document.querySelector(DOMstrings.successTitle).innerHTML = title;
            document.querySelector(DOMstrings.successMessage).innerHTML = message;
        },
    }
})();

// GLOBAL APP CONTROLLER
var UIModalController = (function(UICtrl) {
 
    var DOM = UICtrl.getUIDOMStrings();
    var setupEventListeners = function() {
        
        document.querySelector(DOM.successCloseBtn).addEventListener('click',function(){
            UICtrl.removeClass(document.querySelector(DOM.successAlert), 'show-alert')
        });
 
        document.querySelector(DOM.errorCloseBtn).addEventListener('click',function(){
            UICtrl.removeClass(document.querySelector(DOM.errorAlert), 'show-alert')
        });

    };
 
    return {
        init: function() {
            setupEventListeners();
        }
    };
 
})(UIModal);
 
window.addEventListener('load', function () {
    UIModalController.init(); 
});