function employeeAdded() {
    this.getMessage = (msg) => {
        return {
            message: msg
        }
    }
}

function employeeSuccessfulLogin() {
    this.getMessage = (msg, token, id) => {
        return {
            "auth_token": token,
            "emp_id": id,
            message: msg
        }
    }
}

function getEmployee() {
    this.getMessage = (msg, employee) => {
        return {
            message: msg,
            data: employee
        }
    }
}

function getEmployees() {
    this.getMessage = (msg, employees) => {
        return {
            message: msg,
            count: employees.length,
            data: employees
        }
    }
}

module.exports.employeeAdded = employeeAdded;
module.exports.getEmployee = getEmployee;
module.exports.getEmployees = getEmployees;
module.exports.employeeSuccessfulLogin = employeeSuccessfulLogin;