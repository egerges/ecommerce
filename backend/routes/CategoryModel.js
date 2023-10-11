//Imported libraries
const router = require('express').Router();

//Import token validation
const verify = require('../validation/verifytoken');

//Import models
const Category = require('../models/Category');

//Import validation control
const  { 
    nameDescriptionValidation, 
    addSubcategoryValidation, 
    addAttributeValidation
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

//Add Category API
router.post('/addCategory', verify, async (req, res) => {
    try {
        //Validate the Category inputed data
        const validate = nameDescriptionValidation(req.body);
        if(validate.error) {
            res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
            return ;
        }

        //Check if the Category is in the database
        const category = await Category.findOne(
            {
                name: req.body.name
            }
        );

        //Operate based on Category
        if(!category) {
            //Create a new Category
            const category = new Category({
                name: req.body.name,
                description: req.body.description,
                status: 1,
                created: new Date()
            });

            //Save the Category to the db
            const savecategory = await category.save()
                .then(() => {
                    res.send(new itemAdded().getMessage('Category added Successfully.'));
                    var employeeId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(employeeId, 'Added a Category.', ip);
                })
                .catch((err) => {
                    res.send(new addItemError().getErrorMessage(err.message));
                });
        } else {
            //Category found
            res.send(new addItemError().getErrorMessage('Category with same name already exist.'));
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
        console.error("Error @ Add Category: " + error);
    }
});

module.exports = router;