//Imported libraries
const router = require('express').Router();
const jwt = require('jsonwebtoken');

//Import token validation
const verify = require('../validation/verifytoken');

//Import models
const Product = require('../models/Product');

//Import validation control
const  { 
    addProductValidation,
    updateProductValidation
} = require('../validation/validation');

//Import messages
const {
    employeeAdded : itemAdded,
    employeeSuccessfulLogin : itemSuccessfulLogin,
    getEmployee : getItem,
    getEmployees : getItems
} = require('../Messages/message');

//Import Errors
const { 
    authenticationError, 
    validationError, 
    addEmployeeError : addItemError, 
    getEmployeeError : getItemError, 
    generalError
} = require('../Messages/Errors');

//Import Loggers
const Logger = require('../Logger/Logger');
const ErrorLogger = require('../Logger/ErrorLogger');

//Add Product API
router.post('/addProduct', verify, async (req, res) => {
    try {
        //Validate the Product inputed data
        const validate = addProductValidation(req.body);
        if(validate.error) {
            res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
            return ;
        }

        const error = null;

        //Check if the Product is in the database
        const _product = await Product
            .findOne( { barcode: req.body.barcode } )
            .then(data => data)
            .catch((err) => {
                error = err;
            });

        if(error) {
            res.send(new addItemError().getErrorMessage(error.message));
            return;
        }

        //Operate based on Product
        if(!_product || (_product.length == 0)) {
            //Create Product from schema
            const product = new Product({
                name: req.body.name,
                subcategory_id: req.body.subcategory_id,
                brand_id: req.body.brand_id,
                attributes_ids: req.body.attributes_ids,
                description: req.body.description,
                image: req.body.image,
                barcode: req.body.barcode,
                nutritionfacts: req.body.nutritionfacts,
                volume: req.body.volume,
                inventory: req.body.inventory,
                status: 1
            });

            //Save the Product to the db
            const saveProduct = await product.save()
                .then(() => {
                    res.send(new itemAdded().getMessage('Product added Successfully.'));
                    var employeeId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(employeeId, 'Added a Product.', ip);
                    console.log('saveProduct', saveProduct);
                })
                .catch((err) => {
                    res.send(new addItemError().getErrorMessage(err.message));
                });
        } else {
            //Product found
            res.send(new addItemError().getErrorMessage('Product with same { name, barcode } already exist.'));
        }
    }catch(err){
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ErrorLogger(
            jwt.decode(
                req.headers['auth-token'],
                process.env.TOKEN_SECRET,
                )
                ,
                err.message + ' coming from ' + req.headers.location,
            ip
        );
        res.send(new generalError().getErrorMessage(err.message));
        console.error("Error @ Add Product: " + err);
    }
});

//Get all Products API
router.get('/products', verify, async (req, res) => {
    try {
        //Check if the Product is in the database
        const product = await Product.find({});

        //Operate based on product
        if(product) {
            res.send(new getItems().getMessage('All Products found.', product));
            var employeeId = 
                jwt.decode(
                    req.headers['auth-token'],
                    process.env.TOKEN_SECRET,
                );
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            Logger(employeeId, 'Requested all products.', ip);
        } else {
            //Employee not found
            res.send(new getItemError().getErrorMessage('No Products found.'));
            return;
        }
    } catch (error) {
        res.send(new generalError().getErrorMessage(error.message));
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ErrorLogger(
            jwt.decode(
                req.headers['auth-token'],
                process.env.TOKEN_SECRET,
                )
                ,
            error.message + ' coming from ' + req.headers.location,
            ip
        );
        console.error("Error @ Get Products: " + error);
    }
});

//Get Product API
router.post('/product', verify, async (req, res) => {
    try {
        //Check if the product is in the database
        let product = null;

        if( req.body.name && req.body.barcode ) {
            product = await Product.find({
                $and: [
                    { name: req.body.name },
                    { barcode: req.body.barcode }
                ]
            });
        } else if( req.body.name ) {
            product = await Product.find({ name: req.body.name });
        } else if( req.body.barcode ) {
            product = await Product.findOne({ barcode: req.body.barcode });
        } else if( req.body.subcategory_id ) {
            product = await Product.find({ subcategory_id: req.body.subcategory_id });
        } else if( req.body.brand_id ) {
            product = await Product.find({ brand_id: req.body.brand_id });
        }

        //Operate based on product
        if(product.length != 0) {
            res.send(new getItems().getMessage('Product found Successfully.', product, 'product'));
            var employeeId = 
                jwt.decode(
                    req.headers['auth-token'],
                    process.env.TOKEN_SECRET,
                );
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            Logger(employeeId, 'Requested an product.', ip);
        } else {
            //Product not found
            res.send(new getItemError().getErrorMessage('Product does not exist.'));
            return;
        }
    } catch (error) {
        res.send(new generalError().getErrorMessage(error.message));
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ErrorLogger(
            jwt.decode(
                req.headers['auth-token'],
                process.env.TOKEN_SECRET,
                )
                ,
            error.message + ' coming from ' + req.headers.location,
            ip
        );
        console.error("Error @ Get Product: " + error);
    }
});

//Delete Product API
router.delete('/product', verify, async (req, res) => {
    try {
        //Check if the Product is in the database
        const product = await Product
            .findOne(
                {
                    _id: req.body.id
                }
            )
            .deleteOne();
        //Operate based on product
        if(product) {
            res.send(new getItem().getMessage('Product deleted Successfully.', product));
            var employeeId = 
                jwt.decode(
                    req.headers['auth-token'],
                    process.env.TOKEN_SECRET,
                );
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            Logger(employeeId, 'Deleted an product.', ip);
        } else {
            //Product not found
            res.send(new getItemError().getErrorMessage('Product does not exist.'));
            return;
        }
    } catch (error) {
        res.send(new generalError().getErrorMessage(error.message));
        ErrorLogger(
            jwt.decode(
                req.headers['auth-token'],
                process.env.TOKEN_SECRET,
                )
                ,
            error.message + ' coming from ' + req.headers.location,
            req.headers.host
        );
        console.error("Error @ Delete Product: " + error);
    }
});

//Update Product API
router.put('/product/:id', verify, async (req, res) => {
    try {
        //Getting the id from the URL
        var id = req.params.id;

        //Check if the Product is in the database
        const product = await Product.findOne(
            {
                _id: id
            }
        );

        //Operate based on product
        if(product) {
            //Validate the product inputed data
            const validate = updateProductValidation(req.body);
            if(validate.error) {
                res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
            } else {
                //Update the product
                const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
                
                //Getting the updated product
                const product = await Product.findOne(
                    {
                        _id: id
                    }
                );
                if(updatedProduct) {
                    res.send(new getItem().getMessage('Product updated Successfully.', product));
                    var employeeId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(employeeId, 'Modified a product.', ip);
                } else {
                    res.send(new addEmployeeError().getErrorMessage('Product update failed.'));
                }
            }
        } else {
            //Product not found
            res.send(new getEmployeeError().getErrorMessage('Product does not exist.'));
            return;
        }
    } catch (error) {
        res.send(new generalError().getErrorMessage(error.message));
        ErrorLogger(
            jwt.decode(
                req.headers['auth-token'],
                process.env.TOKEN_SECRET,
                )
                ,
            error.message + ' coming from ' + req.headers.location,
            req.headers.host
        );
        console.error("Error @ Update Product: " + error);
    }
});

module.exports = router;