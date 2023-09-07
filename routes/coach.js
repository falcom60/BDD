const { coaches, coachCreate, coachUpdate, coachDelete } = require("../controllers/coach");

function coachRoute(app) {
    app.post("/coachCreate", coachCreate);
    app.get("/coaches", coaches);
    app.post("/coachUpdate", coachUpdate);
    app.post("/coachDelete", coachDelete);
}

module.exports = coachRoute;