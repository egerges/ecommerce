function authenticationError() {
    this.getErrorMessage = (msg) => {
        return {
            error: true,
            error_code: 101,
            error_message: msg
        }
    }
}

function validationError() {
    this.getErrorMessage = (msg) => {
        return {
            error: true,
            error_code: 102,
            error_message: msg
        }
    }
}

function addEmployeeError() {
    this.getErrorMessage = (msg) => {
        return {
            error: true,
            error_code: 103,
            error_message: msg
        }
    }
}

function getEmployeeError() {
    this.getErrorMessage = (msg) => {
        return {
            error: true,
            error_code: 105,
            error_message: msg
        }
    }
}

function tokenVerificationError() {
    this.getErrorMessage = (msg) => {
        return {
            error: true,
            error_code: 104,
            error_message: msg
        }
    }
}

function generalError() {
    this.getErrorMessage = (msg) => {
        return {
            error: true,
            error_code: 100,
            error_message: msg
        }
    }
}

module.exports.authenticationError = authenticationError;
module.exports.validationError = validationError;
module.exports.addEmployeeError = addEmployeeError;
module.exports.getEmployeeError = getEmployeeError;
module.exports.tokenVerificationError = tokenVerificationError;
module.exports.generalError = generalError;