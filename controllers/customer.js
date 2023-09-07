const encryptPassword = require("../utils/encryptPassword");

async function customers(req, res) {
    const Customer = req.app.get("models").Customer;
    const CustomersList = await Customer.find()
        .populate("user")
        .populate("subscriptions");
    res.json(CustomersList);
}

async function customerCreate(req, res) {
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
    }).save();
    const newCustomer = await new models.Customer({ user: NewUser._id }).save();
    return res.json(newCustomer);
}

async function customerUpdate(req, res) {
    if (req.role !== "manager") {
        return res.json("Unauthorized");
    }
    try {
        if (!req.body._id) {
            return res.json("No _id provided");
        }
        const Customer = req.app.get("models").Customer;

        let toModifyCustomer = await Customer.findById(req.body._id);
        if (!toModifyCustomer) {
            return res.json("Customer not found");
        }
        const ToModifyKeys = Object.keys(req.body.toModify);
        for (const key of toModifyKeys) {
            toModifyCustomer[key] = req.body.toModify[key];
        }
        await toModifyCustomer.save();
        res.json(toModifyCustomer);
    } catch (error) {
        return res.json(error.message);
    }
}

async function customerDelete(req, res) {
    if (req.role !== "manager") {
        return res.json("Unauthorized");
    }
    if (!req.body._id) {
        return res.json("No _id provided");
    }
    const Customer = req.app.get("models").Customer;

    let toDeleteCustomer = await Customer.findById(req.body._id);
    if (!toDeleteCustomer) {
        return res.json("Customer no found");
    }
    let toDeleteUser = await models.User.findById(toDeleteCustomer.user);

    await toDeleteUser.remove();
    await toDeleteCustomer.remove();
    res.json("Successfully deleted");

}

module.exports = { customers, customerCreate, customerUpdate, customerDelete };