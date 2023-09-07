const { customers, customerCreate, customerUpdate, customerDelete } = require("../controllers/customer");

function customerRoute(app) {
    app.post("/customerCreate", customerCreate);
    app.get("/customers", customers);
    app.post("/customerUpdate", customerUpdate);
    app.post("/customerDelete", customerDelete);
}

module.exports = customerRoute;