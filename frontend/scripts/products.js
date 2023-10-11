'use strict';

//UI Controller 
const selfUIController = (function () {
    const DOM = {
        tblProducts: 'tblProducts',
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

    const getFullDate = () => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
        const dateObj = new Date();
        const month = monthNames[dateObj.getMonth()];
        const day = dateObj.getDate().toString();
        const year = dateObj.getFullYear();
        return day + ' ' + month + ' ' + year;
    }

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
                container: DOM.tblProducts,
                rows:[
                    {
                        cols:[
                            {
                                height: 30,
                                template:'<b>All Products</b>'
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
                            { id:"barcode", header:"Barcode", sort: "string" },
                            { id:"name", header:"Product Name", minWidth: 100, maxWidth: 150, fillspace:true, adjust: true, sort: "string" },
                            { id:"subcategory_id", header:[
                                { text:"Subcategory"},
                                { content:"selectFilter" }
                              ]
                            },
                
                            { id:"brand_id", header:[
                                { text:"Brand"},
                                { content:"selectFilter" }
                            ]},
                
                            { id:"cost",
                              header:[
                                { content:"columnGroup", batch:"inventory", adjust: true,
                                 groupText:"Inventory", colspan: 3 },
                                "Cost"
                              ], sort: "int", },
                            { id:"stock_qtt", batch:"inventory", header:[null, "Stock Qtt"], adjust: true, sort: "int" },
                            { id:"price", batch:"inventory", header:[null, "Price"], adjust: true, sort: "int" },
                            { id:"description", header:"Description", fillspace:true, adjust: true },
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
                                var record = $$(DOM.dataViewId).getItem(rowItem.row);
                                var barcode = record.barcode;
                                var criteria = 'barcode';
                                apiCtrl.getProduct(window.localStorage.getItem("auth_token"), 
                                                    criteria, barcode)
                                .then(response => response.json())
                                .then(data => {
                                    var price = calculatePrice(data.data.inventory.cost,
                                        data.data.inventory.vat,
                                        data.data.inventory.profit_margin);
                                    data["data"]["inventory"]["price"] = price;
                                    webix.ready(() => {
                                        product_sheet = webix.ui(
                                            {
                                                view:"window",
                                                id:"win",
                                                position:"center",
                                                zIndex: 1000,
                                                head:{
                                                    view:"toolbar", elements:[
                                                        { view:'label', label:"<span class='mainColor'><b>Product Details</b></span>", align:"center"},
                                                        { view:"icon", icon:"wxi-pencil", 
                                                            click:function(){
                                                                window.location.replace("./product.html?barcode=" + data.data.barcode)
                                                            } 
                                                        },
                                                        { view:"icon", icon:"wxi-close", 
                                                            click:function(){
                                                                $$("win").hide();
                                                            }
                                                        }
                                                    ]
                                                },
                                                modal: true,
                                                body:{
                                                    id: 'product_propertysheet', 
                                                    cols:[    
                                                      {
                                                        rows:[
                                                            {
                                                                view:"property",
                                                                editable:false,
                                                                id:'product_propertysheet_1',
                                                                data: data,
                                                                complexData:true,
                                                                width:300,
                                                                elements:[
                                                                    { label:"Details", type:"label" },
                                                                    { label:"Barcode", type:"text", id:"barcode"},
                                                                    { label:"Name", type:"text", id:"name"},
                                                                    { label:"Subcategory", type:"text", id:"subcategory_id"},
                                                                    { label:"Attributes", type:"text", id:"attributes_id"},
                                                                    { label:"Status", type:"text", id:"status"},
                                                                    { label:"Description",  type:"popup", popup:"descriptiontextpopup", id:"description" },
                                                                    { label: "Image", template: "<span><img src='' alt='' style='width: 20px; height: 20px;'/></span>" },
                                                                ]
                                                            }
                                                        ]
                                                      },
                                                      {
                                                        rows:[
                                                            {
                                                                view:"property",  
                                                                id:'product_propertysheet_2',
                                                                editable:false,
                                                                complexData:true,
                                                                data: data,
                                                                width:175,
                                                                elements:[
                                                                    { label:"Inventory", type:"label" },
                                                                    { label:"Qtt in Stock", type:"text", id:"inventory.stock_qtt"},
                                                                    { label:"Cost", type:"text", id:"inventory.cost"},
                                                                    { label:"VAT", type:"text", id:"inventory.vat"},
                                                                    { label:"Profit Margin", type:"text", id:"inventory.profit_margin"},
                                                                    { label:"Price", type:"text", id:"inventory.price"},
                                                                    { label:"Min Stock Level", type:"text", id:"inventory.min_stock_level"},
                                                                ]
                                                            }
                                                        ]
                                                      },
                                                      {
                                                        rows:[
                                                            {
                                                                view:"property",  
                                                                id:'product_propertysheet_3',
                                                                editable:false,
                                                                data: data,
                                                                complexData:true,
                                                                width:175,
                                                                elements:[
                                                                    { label:"Volume", type:"label" },
                                                                    { label:"Width", type:"text", id:"volume.width"},
                                                                    { label:"Height", type:"text", id:"volume.height"},
                                                                    { label:"Depth", type:"text", id:"volume.depth"},
                                                                    { label:"Nutriction Facts", type:"label" },
                                                                    { label:"Calories", type:"text", id:"nutritionfacts.calories" },
                                                                    { label:"Serving Size", type:"text", id:"nutritionfacts.serving_size"},
                                                                ]
                                                            }
                                                        ]
                                                      }
                                                    ]
                                                }
                                            }
                                        );
                                        product_sheet.show();
                    
                                        //defining its appearance
                                        webix.ui({  
                                            id:"descriptiontextpopup",
                                            view:"popup",
                                            body:{ view:"textarea", width:300, height:100 }
                                        });
                                    });
                                })
                                .catch(err => {
                                    webix.message(err);
                                });
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

    function calculatePrice(cost, vat, margin) {
        return (cost * vat) + (cost * margin) + cost + '$';
    }

    function getAll() {
        UIModal.addClass(document.querySelector(UIDOM.loaderModal), 'show-modal');
        apiCtrl.getProducts(window.localStorage.getItem("auth_token"))
        .then(response => response.json())
        .then(products => {
            console.log('products', products);
            if(!products.error) {
                var data = [];
                products.data.forEach(product => {
                    data.push(
                        {
                            'barcode': product.barcode,
                            'name': product.name,
                            'subcategory_id': product.subcategory_id,
                            'brand_id': product.brand_id,
                            'cost': product.inventory.cost,
                            'stock_qtt': product.inventory.stock_qtt,
                            'description': product.description,
                            'price': calculatePrice(product.inventory.cost, product.inventory.vat, product.inventory.profit_margin),
                        }
                    );
                });
                populateData(data);
            } else {
                UIModal.showErrorAlert("Fetch Failed", products.error_message);
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
            //populateDummyData();
            getAll();
        }
    };
})(api, selfUIController, UIModal);

window.addEventListener('DOMContentLoaded', () => {
    selfController.init();
});