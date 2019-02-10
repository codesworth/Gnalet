import { REF_AUTHORITIES } from "./Constants";

export async function createAuthority(
  store: any,
  corsHandler,
  request,
  response,
  admin
) {
  corsHandler(request, response, () => {
    const { data } = request.body;
    const { email, password } = data;
    admin
      .auth()
      .createUser({ email: email, password: password })
      .then(res => {
        return admin
          .firestore()
          .doc(`${REF_AUTHORITIES}/${res.uid}`)
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
}
