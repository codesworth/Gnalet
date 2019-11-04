"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
async function sendNotification(store, uid, after, messaging, sup) {
    const tokensnap = await store
        .collection(Constants_1.REF_TOKENS)
        .doc(uid)
        .get();
    //console.log("This is the token", tokensnap.data());
    if (!tokensnap.exists) {
        //console.log("The token dont exist oo");
        return Promise.resolve("Nothing");
    }
    const token = tokensnap.data().token;
    //console.log("Token is: ", token);
    const status = after.get("status");
    if (status === 1) {
        const message = {
            notification: {
                title: "REPORT UPDATE",
                body: `Your reported issue has been updated to Pending by the ${sup}`
            },
            token: token
        };
        return messaging.send(message);
    }
    else if (status === 2) {
        const message = {
            notification: {
                title: "REPORT UPDATE",
                body: `Your reported issue has been Resolved`
            },
            token: token
        };
        return messaging.send(message);
    }
    else if (status === 4) {
        const payload = {
            notification: {
                title: "REPORT UPDATE",
                body: `Your reported issue has been already filed and pending`
            }
        };
        return messaging.sendToDevice(token, payload);
    }
    else {
        return Promise.resolve("Nothing");
    }
}
exports.sendNotification = sendNotification;
//# sourceMappingURL=Notifications.js.map