import { REF_AUTHORITIES } from "./Constants";

export async function createAuthority(
  store: any,
  corsHandler: any,
  request: any,
  response: any,
  admin: any
) {
  corsHandler(request, response, () => {
    const { data } = request.body;
    const { email, password } = data;
    admin
      .auth()
      .createUser({ email: email, password: password })
      .then((res: any) => {
        return admin
          .firestore()
          .doc(`${REF_AUTHORITIES}/${res.uid}`)
          .set(data, { merge: true });
      })
      .then((final: any) => {
        response
          .status(200)
          .send("Succesfully Added Authority User Account: " + final);
      })
      .catch((e: any) => {
        console.log("Error Occurred with sig: ", e);
        response.status(504).send(e);
      });
  });
}
