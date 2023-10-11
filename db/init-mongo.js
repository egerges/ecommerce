const { Db } = require("mongodb");
db.createUser(
    {
        user: "admin",
        pwd: "admin",
        roles: [
            {
                role: "readWrite",
                db: "shoppers"
            }
        ]
    }
);