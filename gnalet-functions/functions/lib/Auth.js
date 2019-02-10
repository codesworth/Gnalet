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
function createAuthority(store, corsHandler, request, response, admin) {
    return __awaiter(this, void 0, void 0, function* () {
        corsHandler(request, response, () => {
            const { data } = request.body;
            const { email, password } = data;
            admin
                .auth()
                .createUser({ email: email, password: password })
                .then(res => {
                return admin
                    .firestore()
                    .doc(`${Constants_1.REF_AUTHORITIES}/${res.uid}`)
                    .set(data, { merge: true });
            })
                .then(final => {
                response
                    .status(200)
                    .send("Succesfully Added Authority User Account: " + final);
            })
                .catch(e => {
                console.log("Error Occurred with sig: ", e);
                response.status(504).send(e);
            });
        });
    });
}
exports.createAuthority = createAuthority;
//# sourceMappingURL=Auth.js.map