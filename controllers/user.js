const encryptPassword = require("../utils/encryptPassword");
const decryptPassword = require("../utils/decryptPassword");


async function userGet(req, res) {
    try{
        const User = req.app.get("models").User;
        const MyUsers = await User.find();
        res.json(MyUsers);
    }catch (error){
        return error.message;
    }
}

async function userCreate(req, res) {
    try {
        if (!req.body.password) {
            return res.json("No password");
        }

        if (req.role !== "manager") {
            return res.json("Unauthorized");
        }
        const {token, salt, hash} = encryptPassword(req.body.password);
        const User = req.app.get("models").User;
        const NewUser = await new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            dateOfBirth: req.body.dateOfBirth,
            token,
            salt,
            hash,
        }).save();
        const newUser = await new models.User({ user: NewUser._id }).save();
        return res.json(newUser);
} catch (error) {
        res.json(error.message);
    }
}

async function userUpdate(req, res) {
    try{
        if(!req.body._id || !req.body.ToModify) {
            return res.json("_id ou champs manquant(s)");
        }
        if (req.role !== "manager") {
            return res.json("Unauthorized");
        }
        const User = req.app.get("models").User;
        const ToModifyUser = await User.findById(req.body._id);
        const ToModifyKeys = Object.keys(req.body.ToModify);
        for (const key of ToModifyKeys) {
            ToModifyUser[key] = req.body.ToModify[key];
        }
        await ToModifyUser.save();
        res.json(ToModifyUser);
    }catch (error){
        res.json(error.message);
    }
}

async function userDelete(req, res) {
    try{
        if(!req.body._id) {
            return res.json("_id manquant");
        }
        if (req.role !== "manager") {
            return res.json("Unauthorized");
        }
        const User = req.app.get("models").User;
        const ToDeleteUser = await User.findById(req.body._id);
        await ToDeleteUser.remove();
        res.json("Successfully Deleted");
    }catch (error){
        res.json(error.message);
    }
}

async function userLogin(req, res) {
    try{
        if(!req.body._id || !req.body.password) {
            return res.json("_id or password missing");
        }
        const User = req.app.get("models").User;
        const toVerifyUser = await User.findById(req.body._id);
        if (!toVerifyUser) {
            return "No user found";
        }
        res.json(decryptPassword(toVerifyUser, req.body.password));
    } catch (error) {
        res.json(error.message);
    }
}


 module.exports = { userGet, userCreate, userDelete, userUpdate, userLogin };