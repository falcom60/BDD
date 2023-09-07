const { subscriptions, subscriptionCreate, subscriptionUpdate, subscriptionDelete } = require("../controllers/subscriptions");

function subscriptionRoute(app) {
    app.post("/subscriptionCreate", subscriptionCreate);
    app.get("/subscriptions", subscriptions);
    app.post("/subscriptionUpdate", subscriptionUpdate);
    app.post("/subscriptionDelete", subscriptionDelete);
}

module.exports = subscriptionRoute;