const encryptPassword = require("../utils/encryptPassword");

async function coaches(req, res) {
    const Coach = req.app.get("models").Coach;
    let CoachsList;
    if (req.query.discipline) {
        CoachsList = await Coach.find({
            discipline: req.query.discipline,
        }).populate("user");
    } else {
        CoachsList = await Coach.find().populate("user");
    }
    res.json(CoachsList);
}

async function coachCreate(req, res) {
    if (!req.body.password) {
        return res.json("No password");
    }
    if (req.role !== "manager") {
        return res.json("Unauthorized");
    }

    const models = req.app.get("models");
    const { token, salt, hash } = encryptPassword(req.body.password);

    const NewUser = await new models.User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        token,
        salt,
        hash,
        role: "coach",
    }).save();
    const newCoach = await new models.Coach({ user: NewUser._id }).save();
    return res.json(newCoach);
}

async function coachUpdate(req, res) {
    try {
    if (req.role !== "manager") {
        return res.json("Unauthorized");
    }
        if (!req.body._id) {
            return res.json("No _id provided");
        }
        const Coach = req.app.get("models").Coach;

        let toModifyCoach = await Coach.findById(req.body._id);
        if (!toModifyCoach) {
            return res.json("Coach no found");
        }
        const ToModifyKeys = Object.keys(req.body.toModify);
        for (const key of toModifyKeys) {
            toModifyCoach[key] = req.body.toModify[key];
        }
        await toModifyCoach.save();
        res.json(toModifyCoach);
    } catch (error) {
        return res.json(error.message);
    }
}

async function coachDelete(req, res) {
    if (req.role !== "manager") {
        return res.json("Unauthorized");
    }
    if (!req.body._id) {
        return res.json("No _id provided");
    }
    const Coach = req.app.get("models").Coach;

    let toDeleteCoach = await Coach.findById(req.body._id);
    if (!toDeleteCoach) {
        return res.json("Coach no found");
    }
    let toDeleteUser = await models.User.findById(toDeleteCoach.user);

    await toDeleteUser.remove();
    await toDeleteCoach.remove();
    res.json("Successfully deleted");

}

module.exports = { coaches, coachCreate, coachUpdate, coachDelete };