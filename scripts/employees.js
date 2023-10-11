'use strict';

//UI Controller 
const selfUIController = (function () {
    const DOM = {
        tblEmployees: 'tblemployees',
        dataViewId: 'tblProductsDataView',
        exportTypes: {
            EXCEL: 1,
            PDF: 2,
            CSV: 3,
            PNG: 4,
        },
        btnExportPNG:'btnExportPNG',
        btnExportEXCEL:'btnExportEXCEL',
        btnExportPDF:'btnExportPDF',
        btnExportCSV:'btnExportCSV',
    };


    const exportView = (type) => {
        var nameOfFile = 'ProductsList_' + getFullDate();
    switch(type) {
        case DOM.exportTypes.CSV:
            webix.toCSV($$(DOM.dataViewId), {filename: nameOfFile, filterHTML:true, download:true});
            break;
        case DOM.exportTypes.EXCEL:
            webix.toExcel($$(DOM.dataViewId), {filename: nameOfFile, filterHTML:true, download:true, name: "Products"});
            break;
        case DOM.exportTypes.PDF:
            webix.toPDF($$(DOM.dataViewId), {filename: nameOfFile, filterHTML:true, download:true, autowidth:true, orientation:"landscape"});
            break;
        case DOM.exportTypes.PNG:
            webix.toPNG($$(DOM.dataViewId), {filename: nameOfFile, filterHTML:true, download:true});
            break;
        default:
            throw new Error('Export type not defined');
    }
    };

    return {
        getDOMStrings: function() {
            return DOM;
        },

        exportViewData: (type)=> {
            exportView(type);
        }
    }
})();

// Global App Controller 
const selfController = (function (apiCtrl, UICtrl, UIModal) {
    const DOM = UICtrl.getDOMStrings();
    const UIDOM = UIModal.getUIDOMStrings();

    var product_sheet = null;
    var prop = null;

    function populateData(data) {
        webix.ready(function(){
            webix.ui({
                container: DOM.tblEmployees,
                rows:[
                    {
                        cols:[
                            {
                                height: 30,
                                template:'<b>All Employees</b>'
                            },
                            {view:"button", align:"left", css:"webix_primary", label: 'Export Data', autowidth:true, popup:"export_popup" }
                        ]
                    },
                    {
                        view:"datatable",
                        id: DOM.dataViewId,
                        data: data,
                        maxWidth: '100%',
                        css:"webix_header_border",
                        columns:[
                            
                        ],
                        autoheight: true,
                        on:{
                            onBeforeLoad:function(){
                                webix.message("Loading...");
                            },
                            onAfterLoad:function(){
                                if (!this.count()) {
                                    webix.message("Sorry, there is no data");
                                } else
                                    this.hideOverlay();
                            },
                            onItemClick:(rowItem, event) => {
                                
                            }
                        },
                        pager:"table_pager",
                        select:true,
                    },
                    {
                        view:"pager", id:"table_pager",
                        animate:{
                            subtype:"in"
                        },
                        template:`{common.first()} {common.prev()} {common.pages()}
                            {common.next()} {common.last()}`,
                        size:10,
                        group:5
                    },
                ],
            });

            webix.ui({
                view:"popup",
                id:"export_popup",
                width:300,
                body:{
                    rows: [
                        { 
                            view:"button", 
                            id:DOM.btnExportPNG, 
                            label: "</span><span class='text'>Export to PNG</span>",
                            on: {
                                onItemClick:() => {
                                    console.log('clicked');
                                    UICtrl.exportViewData(DOM.exportTypes.PNG);
                                }
                            }
                        },
                        { 
                            view:"button", 
                            id:DOM.btnExportEXCEL, 
                            label: "</span><span class='text'>Export to Excel</span>",
                            on: {
                                onItemClick:() => {
                                    UICtrl.exportViewData(DOM.exportTypes.EXCEL);
                                }
                            }
                        },
                        { 
                            view:"button", 
                            id:DOM.btnExportPDF, 
                            label: "</span><span class='text'>Export to PDF</span>",
                            on: {
                                onItemClick:() => {
                                    UICtrl.exportViewData(DOM.exportTypes.PDF);
                                }
                            }
                         },
                        { 
                            view:"button", 
                            id:DOM.btnExportCSV, 
                            label: "</span><span class='text'>Export to CSV</span>",
                            on: {
                                onItemClick:() => {
                                    UICtrl.exportViewData(DOM.exportTypes.CSV);
                                }
                            }
                         },
                    ]
                }
            });
        });
    }

    function getAll() {
        UIModal.addClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        apiCtrl.getEmployees(window.localStorage.getItem("auth_token"))
        .then(response => response.json())
        .then(employees => {
            if(!employees.error) {
                console.log('employees', employees);
                populateData(data);
            } else {
                UIModal.showErrorAlert("Fetch Failed", employees.error_message);
            }
            UIModal.removeClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        }).catch(error => {
            UIModal.showErrorAlert("Fetch Failed", error);
        });
    }

    const setEventListeners = () => {
        
    }

    return {
        init: function() {
            setEventListeners();
            getAll();
        }
    };
})(api, selfUIController, UIModal);

window.addEventListener('DOMContentLoaded', () => {
    selfController.init();
});