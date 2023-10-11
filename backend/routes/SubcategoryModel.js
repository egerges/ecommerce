//Imported libraries
const router = require('express').Router();

//Import token validation
const verify = require('../validation/verifytoken');

//Import models
const Subcategory = require('../models/Subcategory');

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

//Add Subcategory API
router.post('/addSubcategory', verify, async (req, res) => {
    try {
        //Validate the Subcategory inputed data
        const validate = addSubcategoryValidation(req.body);
        if(validate.error) {
            res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
            return ;
        }

        //Check if the Subcategory is in the database
        const subcategory = await Subcategory.findOne(
            {
                name: req.body.name
            }
        );

        //Operate based on Subcategory
        if(!subcategory) {
            //Create a new Subcategory
            const subcategory = new Subcategory({
                category_id: req.body.category_id,
                name: req.body.name,
                description: req.body.description,
                status: 1,
                created: new Date()
            });

            //Save the Subcategory to the db
            const saveSubcategory = await subcategory.save()
                .then(() => {
                    res.send(new itemAdded().getMessage('Subcategory added Successfully.'));
                    var employeeId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(employeeId, 'Added a Subcategory.', ip);
                })
                .catch((err) => {
                    res.send(new addItemError().getErrorMessage(err.message));
                });
        } else {
            //Subcategory found
            res.send(new addItemError().getErrorMessage('Subcategory with same name already exist.'));
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
        console.error("Error @ Add Subcategory: " + error);
    }
});

module.exports = router;