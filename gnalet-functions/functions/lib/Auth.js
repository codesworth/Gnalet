"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
async function createAuthority(store, corsHandler, request, response, admin) {
    corsHandler(request, response, () => {
        const { data } = request.body;
        const { email, password } = data;
        admin
            .auth()
            .createUser({ email: email, password: password })
            .then((res) => {
            return admin
                .firestore()
                .doc(`${Constants_1.REF_AUTHORITIES}/${res.uid}`)
                .set(data, { merge: true });
        })
            .then((final) => {
            response
                .status(200)
                .send("Succesfully Added Authority User Account: " + final);
        })
            .catch((e) => {
            console.log("Error Occurred with sig: ", e);
            response.status(504).send(e);
        });
    });
}
exports.createAuthority = createAuthority;
//# sourceMappingURL=Auth.js.map