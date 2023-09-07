const encryptPassword = require("../utils/encryptPassword");

async function subscriptions(req, res) {
    console.log("successfully");
    const Subscription = req.app.get("models").Subscription;
    const SubscriptionsList = await Subscription.find();
    res.json(SubscriptionsList);
}

async function subscriptionCreate(req, res) {
    if (req.role !== "manager") {
        return res.json("Unauthorized");
    }

    const models = req.app.get("models");

    const newsubscription = await new models.Subscription({
        beginningDate: req.body.beginningDate,
        endDate: req.body.endDate,
        paymentMethod: req.body.paymentMethod,
        amountPaid: req.body.amountPaid,
        customer: req.body.customer,
    }).save();
    let theCustomer = await models.Customer.findById(req.body.customer);
    theCustomer.subscriptions.push(newsubscription._id);
    await theCustomer.save();

    return res.json(newsubscription);
}

async function subscriptionUpdate(req, res) {
    if (req.role !== "manager") {
        return res.json("Unauthorized");
    }
    try {
        if (!req.body._id) {
            return res.json("No _id provided");
        }
        const Subscription = req.app.get("models").Subscription;

        let toModifySubscription = await Subscription.findById(req.body._id);
        if (!toModifySubscription) {
            return res.json("Subscription not found");
        }
        const ToModifyKeys = Object.keys(req.body.toModify);
        for (const Key of toModifyKeys) {
            toModifySubscription[key] = req.body.toModify[key];
        }
        await toModifySubscription.save();
        res.json(toModifySubscription);
    } catch (error) {
        return res.json(error.message);
    }
}

async function subscriptionDelete(req, res) {
    if (req.role !== "manager") {
        return res.json("Unauthorized");
    }
    if (!req.body._id) {
        return res.json("No _id provided");
    }
    const Subscription = req.app.get("models").Subscription;

    let toDeleteSubscription = await Subscription.findById(req.body._id);
    if (!toDeleteSubscription) {
        return res.json("Subscription no found");
    }
    let theCustomer = await models.Customer.findById(toDeleteSubscription.customer);
    let toDeleteIndex = theCustomer.subscriptions.indexOf(toDeleteSubscription._id);
    theCustomer.subscriptions.splice(toDeleteIndex, 1);
    await theCustomer.save();

    await toDeleteSubscription.remove();
    res.json("Successfully deleted");
}

module.exports = { subscriptions, subscriptionCreate, subscriptionUpdate, subscriptionDelete };