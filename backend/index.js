//Clearing console
console.clear();

// Importing the required libraries
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Importing Error Message
const { generalError } = require('./Messages/Errors');

//Importing the routes
const employeeModelRoute = require('./routes/EmployeeModel');
const catalogModelRoute = require('./routes/CatalogModel');
const categoryModelRoute = require('./routes/CategoryModel');
const subcategoryModelRoute = require('./routes/SubcategoryModel');
const brandModelRoute = require('./routes/BrandModel');
const attributeModelRoute = require('./routes/AttributeModel');
const productModelRoute = require('./routes/ProductModel');
const { verify } = require('jsonwebtoken');

// Initiate an instance of the express application
try {
    //Configurating .env constants
    dotenv.config();

    // Creating an instance of the app to be used.
    const app = express();

    //Getting connection string from the environment variables.
    const conString = process.env.DB_CONNECT;

    if(conString) {
        // Connect to Database
        mongoose.connect(conString, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }).then(() => {
            console.log('Database Connected Successfully');
        }).catch(err => {
            console.log('Error @ Connect: Failed connection to database:\n' + err);
            process.exit();
        });
    } else {
        throw new Error("Connection String is undefined");
    }

    //Expressing the type of data to be sent from the API call
    app.use(express.json());

    //To allow API calls from only our application
    app.use((req, res, next) => {
        res.append('Acces-Controll-Allow-Origin', '*/*');
        res.append('Acces-Controll-Allow-Methods', '*/*');
        res.append('Acces-Controll-Allow-Headers', '*/*');
        next();
    });

    //Redirecting route as a middlewares
    app.use('/backoffice', employeeModelRoute);
    app.use('/backoffice', catalogModelRoute);
    app.use('/backoffice', categoryModelRoute);
    app.use('/backoffice', subcategoryModelRoute);
    app.use('/backoffice', brandModelRoute);
    app.use('/backoffice', attributeModelRoute);
    app.use('/backoffice', productModelRoute);

    //Returning error message for unauthorized API
    app.get('*', (req, res) => {
        res.status(401).send(new generalError().getErrorMessage({
            'type': 'Unauthorized Access',
            'info': 'No API Key supplied',
            'more': 'Kindly note that you are trying to access a secured website. Any attempt of hacking will be prosecuted by law.'
        }));
    });

    //Exposing our API on a certain port
    app.listen(2003, 'localhost', () => {
        console.log('APIs exposed on port 2003');
    });
} catch (error) {
    console.error("Error @ IndexJS: " + error);
}