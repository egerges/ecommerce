//Imported libraries
const router = require('express').Router();

//Import token validation
const verify = require('../validation/verifytoken');

//Import models
const Catalog = require('../models/Catalog');

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

//Add Catalog API
router.post('/addCatalog', verify, async (req, res) => {
    try {
        //Validate the Catalog inputed data
        const validate = nameDescriptionValidation(req.body);
        if(validate.error) {
            res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
            return ;
        }

        //Check if the Catalog is in the database
        const catalog = await Catalog.findOne(
            {
                name: req.body.name
            }
        );

        //Operate based on Catalog
        if(!catalog) {
            //Create a new Catalog
            const catalog = new Catalog({
                name: req.body.name,
                description: req.body.description,
                status: 1,
                created: new Date()
            });

            //Save the catalog to the db
            const savecatalog = await catalog.save()
                .then(() => {
                    res.send(new itemAdded().getMessage('Catalog added Successfully.'));
                    var employeeId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(employeeId, 'Added a Catalog.', ip);
                })
                .catch((err) => {
                    res.send(new addItemError().getErrorMessage(err.message));
                });
        } else {
            //Catalog found
            res.send(new addItemError().getErrorMessage('Catalog with same name already exist.'));
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
        console.error("Error @ Add Catalog: " + error);
    }
});

module.exports = router;