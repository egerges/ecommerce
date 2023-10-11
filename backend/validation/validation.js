//Importing libraries
const Joi = require('joi');

//Add Employee validation
const addEmployeeValidation = (data) => {
    const schema = Joi.object({
        firstname: Joi.string().min(1).required(),
        lastname: Joi.string().min(1).required(),
        username: Joi.string().min(5).required(),
        password: Joi.string().min(5).required(),
        email: Joi.string().min(5).required(),
        mobile: Joi.string().min(5).required(),
        status: Joi.boolean(),
        roleId: Joi.string()
    });

    //Lets validate the data before we create an employee
    return schema.validate(data);
}

//Update Employee validation
const updateEmployeeValidation = (data) => {
    const schema = Joi.object({
        firstname: Joi.string().min(1),
        lastname: Joi.string().min(1),
        username: Joi.string().min(5),
        password: Joi.string().min(5),
        email: Joi.string().min(5),
        mobile: Joi.string().min(5),
        status: Joi.boolean(),
        roleId: Joi.string()
    });

    //Lets validate the data before we create an employee
    return schema.validate(data);
}

//Login Employee validation
const loginEmployeeValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(5).required(),
        password: Joi.string().min(5).required(),
    });

    //Lets validate the data before we create an employee
    return schema.validate(data);
}

//Add Catalog, Brand, Category validation
const nameDescriptionValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().min(5).required(),
    });

    //Lets validate the data before we create an employee
    return schema.validate(data);
}

//Add Subcategory validation
const addSubcategoryValidation = (data) => {
    const schema = Joi.object({
        category_id: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().min(5).required(),
    });

    //Lets validate the data before we create an employee
    return schema.validate(data);
}

//Add Attribute validation
const addAttributeValidation = (data) => {
    const schema = Joi.object({
        subcategory_id: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().min(5).required(),
    });

    //Lets validate the data before we create an employee
    return schema.validate(data);
}

//Add Product validation
const addProductValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        subcategory_id: Joi.string().required(),
        brand_id: Joi.string().required(),
        attributes_ids: Joi.array().required(),
        description: Joi.string().min(5).required(),
        image: Joi.string().required(),
        nutritionfacts: {
            servings_per_container: Joi.number().required(),
            serving_size: Joi.number().required(),
            calories: Joi.number().required(),
            total_fat: Joi.number().required(),
            total_fat_percentage: Joi.number().required(),
            saturated_fat: Joi.number().required(),
            saturated_fat_percentage: Joi.number().required(),
            trans_fat: Joi.number().required(),
            cholesterol: Joi.number().required(),
            cholesterol_percentage: Joi.number().required(),
            soduim: Joi.number().required(),
            soduim_percentage: Joi.number().required(),
            carbohydrates: Joi.number().required(),
            carbohydrates_percentage: Joi.number().required(),
            fibers: Joi.number().required(),
            fibers_percentage: Joi.number().required(),
            total_sugar: Joi.number().required(),
            added_sugar: Joi.number().required(),
            added_sugar_percentage: Joi.number().required(),
            protein: Joi.number().required(),
            vitamin_d: Joi.number().required(),
            vitamin_d_percentage: Joi.number().required(),
            calcium: Joi.number().required(),
            calcium_percentage: Joi.number().required(),
            iron: Joi.number().required(),
            iron_percentage: Joi.number().required(),
            potassium: Joi.number().required(),
            potassium_percentage: Joi.number().required(),
        },
        barcode: Joi.string().required(),
        volume: {
            width: Joi.number().required(),
            height: Joi.number().required(),
            depth: Joi.number().required(),
        },
        inventory: {
            stock_qtt: Joi.number().required(),
            cost: Joi.number().required(),
            vat: Joi.number().required(),
            profit_margin: Joi.number().required(),
            min_stock_level: Joi.number().required(),
        },
    });

    //Lets validate the data before we create a product
    return schema.validate(data);
}

//Update Product validation
const updateProductValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string(),
        subcategory_id: Joi.string(),
        brand_id: Joi.string(),
        attributes_ids: Joi.array(),
        description: Joi.string().min(5),
        image: Joi.string(),
        nutritionfacts: {
            servings_per_container: Joi.number(),
            serving_size: Joi.number(),
            calories: Joi.number(),
            total_fat: Joi.number(),
            total_fat_percentage: Joi.number(),
            saturated_fat: Joi.number(),
            saturated_fat_percentage: Joi.number(),
            trans_fat: Joi.number(),
            cholesterol: Joi.number(),
            cholesterol_percentage: Joi.number(),
            soduim: Joi.number(),
            soduim_percentage: Joi.number(),
            carbohydrates: Joi.number(),
            carbohydrates_percentage: Joi.number(),
            fibers: Joi.number(),
            fibers_percentage: Joi.number(),
            total_sugar: Joi.number(),
            added_sugar: Joi.number(),
            added_sugar_percentage: Joi.number(),
            protein: Joi.number(),
            vitamin_d: Joi.number(),
            vitamin_d_percentage: Joi.number(),
            calcium: Joi.number(),
            calcium_percentage: Joi.number(),
            iron: Joi.number(),
            iron_percentage: Joi.number(),
            potassium: Joi.number(),
            potassium_percentage: Joi.number(),
        },
        barcode: Joi.string(),
        volume: {
            width: Joi.number(),
            height: Joi.number(),
            depth: Joi.number(),
        },
        inventory: {
            stock_qtt: Joi.number(),
            cost: Joi.number(),
            vat: Joi.number(),
            profit_margin: Joi.number(),
            min_stock_level: Joi.number(),
        },
    });

    //Lets validate the data before we create a product
    return schema.validate(data);
}

//Exporting the modules
module.exports.addEmployeeValidation = addEmployeeValidation;
module.exports.updateEmployeeValidation = updateEmployeeValidation;
module.exports.loginEmployeeValidation = loginEmployeeValidation;
module.exports.nameDescriptionValidation = nameDescriptionValidation;
module.exports.addSubcategoryValidation = addSubcategoryValidation;
module.exports.addAttributeValidation = addAttributeValidation;
module.exports.addProductValidation = addProductValidation;
module.exports.updateProductValidation = updateProductValidation;