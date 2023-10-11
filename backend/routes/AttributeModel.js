//Imported libraries
const router = require('express').Router();

//Import token validation
const verify = require('../validation/verifytoken');

//Import models
const Attribute = require('../models/Attribute');

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

//Add Attribute API
router.post('/addAttribute', verify, async (req, res) => {
    try {
        //Validate the Attribute inputed data
        const validate = nameDescriptionValidation(req.body);
        if(validate.error) {
            res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
            return ;
        }

        //Check if the Attribute is in the database
        const attribute = await Attribute.findOne(
            {
                name: req.body.name
            }
        );

        //Operate based on Attribute
        if(!attribute) {
            //Create a new Attribute
            const attribute = new Attribute({
                name: req.body.name,
                description: req.body.description,
                status: 1,
                created: new Date()
            });

            //Save the Attribute to the db
            const saveAttribute = await attribute.save()
                .then(() => {
                    res.send(new itemAdded().getMessage('Attribute added Successfully.'));
                    var employeeId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(employeeId, 'Added a Attribute.', ip);
                })
                .catch((err) => {
                    res.send(new addItemError().getErrorMessage(err.message));
                });
        } else {
            //Attribute found
            res.send(new addItemError().getErrorMessage('Attribute with same name already exist.'));
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
        console.error("Error @ Add Attribute: " + error);
    }
});

module.exports = router;