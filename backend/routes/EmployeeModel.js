//Imported libraries
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//Import token validation
const verify = require('../validation/verifytoken');

//Import models
const Employee = require('../models/Employee');

//Import validation control
const { 
    addEmployeeValidation, 
    loginEmployeeValidation,
    updateEmployeeValidation
} = require('../validation/validation');

//Import messages
const {
    employeeAdded,
    employeeSuccessfulLogin,
    getEmployee,
    getEmployees
} = require('../Messages/message');

//Import Errors
const { 
    authenticationError, 
    validationError, 
    addEmployeeError, 
    getEmployeeError, 
    generalError
} = require('../Messages/Errors');

//Import Loggers
const Logger = require('../Logger/Logger');
const ErrorLogger = require('../Logger/ErrorLogger');

//Login API
router.post('/login', async (req, res) => {
    try {
        //Validate the employee inputed data
        const validate = loginEmployeeValidation(req.body);
        if(validate.error) {
            res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
            return ;
        }

        //Check if the employee is in the database
        const employeeExist = await Employee.findOne(
            {
                username: req.body.username
            }
        );

        if(employeeExist) {
            //Getting unhashed version of password
            const validPass = await bcrypt.compare(req.body.password, employeeExist.password);

            if(!validPass) {
                //Password is empty or undefined
                res.send(new authenticationError().getErrorMessage('Username or password not found.'));
                return ;
            } else {
                //Create and Assign a token
                const token = jwt.sign(
                    {
                        _id: employeeExist._id,
                    },
                    process.env.TOKEN_SECRET,
                    {
                        expiresIn: "1h" // it will be expired after 1 hours
                        //expiresIn: "360d" // it will be expired after 20 days
                        //expiresIn: 120 // it will be expired after 120ms
                        //expiresIn: "120s" // it will be expired after 120s
                    }
                );

                const id = employeeExist._id;

                res.header('auth-token', token).status(200).send(new employeeSuccessfulLogin().getMessage('Successful login.', token, id));
                var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                Logger(employeeExist._id, 'Successful login.', ip);
                return ;
            }
        } else {
            //Employee not found
            res.send(new authenticationError().getErrorMessage('Username or password not found.'));
            return;
        }
    } catch (error) {
        res.send(new generalError().getErrorMessage(error.message));
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        ErrorLogger('N/A',
         error.message + ' coming from ' + req.headers.location,
         ip);
         console.error("Error @ Login: " + error);
    }
});

//Add Employee API
router.post('/addEmployee', verify, async (req, res) => {
    try {
        //Validate the employee inputed data
        const validate = addEmployeeValidation(req.body);
        if(validate.error) {
            res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
            return ;
        }

        //Check if the employee is in the database
        const employee = await Employee.findOne(
            {
                username: req.body.username
            }
        );

        //Operate based on employee
        if(!employee) {
            //Encrypting the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            //Create a new Employee
            const employee = new Employee({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                username: req.body.username,
                password: hashedPassword,
                email: req.body.email,
                mobile: req.body.mobile,
                picture:  req.body.picture,
                status: req.body.status,
                roleId: req.body.roleId,
                date_created: req.body.date_created,
                date_last_modified: req.body.date_last_modified,
            });

            //Save the employee to the db
            const saveEmployee = await employee.save()
                .then(() => {
                    res.send(new employeeAdded().getMessage('Employee added Successfully.'));
                    var employeeId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(employeeId, 'Added an employee.', ip);
                })
                .catch((err) => {
                    res.send(new addEmployeeError().getErrorMessage(err.message));
                });
        } else {
            //Employee found
            res.send(new addEmployeeError().getErrorMessage('Employee with same information already exist.'));
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
        console.error("Error @ Add Employee: " + error);
    }
});

//Get all Employees API
router.get('/employees', verify, async (req, res) => {
    try {
        //Check if the employee is in the database
        const employee = await Employee.find({}).select(["-password", "-__v"]);

        //Operate based on employee
        if(employee) {
            res.send(new getEmployees().getMessage('All Employees found.', employee));
            var employeeId = 
                jwt.decode(
                    req.headers['auth-token'],
                    process.env.TOKEN_SECRET,
                );
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            Logger(employeeId, 'Requested all employees.', ip);
        } else {
            //Employee not found
            res.send(new getEmployeeError().getErrorMessage('No Employees found.'));
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
        console.error("Error @ Get Employees: " + error);
    }
});

//Get Employee API
router.get('/employee/:id', verify, async (req, res) => {
    try {
        //Getting the id from the URL
        var id = req.params.id;

        //Check if the employee is in the database
        const employee = await Employee.findOne(
            {
                _id: id
            }
        );

        //Operate based on employee
        if(employee) {
            res.send(new getEmployee().getMessage('Employee found Successfully.', employee));
            var employeeId = 
                jwt.decode(
                    req.headers['auth-token'],
                    process.env.TOKEN_SECRET,
                );
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            Logger(employeeId, 'Requested an employee.', ip);
        } else {
            //Employee not found
            res.send(new getEmployeeError().getErrorMessage('Employee does not exist.'));
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
        console.error("Error @ Get Employee: " + error);
    }
});

//Delete Employee API
router.delete('/employee', verify, async (req, res) => {
    try {
        //Check if the employee is in the database
        const employee = await Employee
            .findOne(
                {
                    _id: req.body.id
                }
            )
            .deleteOne();
        //Operate based on employee
        if(employee) {
            res.send(new getEmployee().getMessage('Employee deleted Successfully.', employee));
            var employeeId = 
                jwt.decode(
                    req.headers['auth-token'],
                    process.env.TOKEN_SECRET,
                );
            var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            Logger(employeeId, 'Deleted an employee.', ip);
        } else {
            //Employee not found
            res.send(new getEmployeeError().getErrorMessage('Employee does not exist.'));
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
        console.error("Error @ Delete Employee: " + error);
    }
});

//Update Employee API
router.put('/employee/:id', verify, async (req, res) => {
    try {
        //Getting the id from the URL
        var id = req.params.id;

        //Check if the employee is in the database
        const employee = await Employee.findOne(
            {
                _id: id
            }
        );

        //Operate based on employee
        if(employee) {
            //Validate the employee inputed data
            const validate = updateEmployeeValidation(req.body);
            if(validate.error) {
                res.send(new validationError().getErrorMessage(validate.error.details[0].message.replace('\"', "").replace('\"', "")));
            } else {
                //Update the employee
                const updatedEmployee = await Employee.findByIdAndUpdate(id, req.body, { useFindAndModify: false });
                
                //Getting the updated employee
                const employee = await Employee.findOne(
                    {
                        _id: id
                    }
                )
                .select(["-password", "-__v"]);
                if(updatedEmployee) {
                    res.send(new getEmployee().getMessage('Employee updated Successfully.', employee));
                    var employeeId = 
                        jwt.decode(
                            req.headers['auth-token'],
                            process.env.TOKEN_SECRET,
                        );
                    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                    Logger(employeeId, 'Modified an employee.', ip);
                } else {
                    res.send(new addEmployeeError().getErrorMessage('Employee update failed.'));
                }
            }
        } else {
            //Employee not found
            res.send(new getEmployeeError().getErrorMessage('Employee does not exist.'));
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
        console.error("Error @ Update Employee: " + error);
    }
});

module.exports = router;