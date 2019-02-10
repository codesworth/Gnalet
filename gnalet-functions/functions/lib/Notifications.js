"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
function sendNotification(store, uid, after, messaging, sup) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokensnap = yield store
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
    });
}
exports.sendNotification = sendNotification;
//# sourceMappingURL=Notifications.js.map