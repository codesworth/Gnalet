const LS_KEY_AUTH = "ls_auth";
export const retrieveState = () => {
  try {
    const serializedAuth = localStorage.getItem(LS_KEY_AUTH);
    if (serializedAuth == null) {
      return null;
    }
    const obj = JSON.parse(serializedAuth);
    console.log(`The obj is ${obj}`);

    return obj;
  } catch (error) {
    return null;
  }
};

export const saveAuthState = state => {
  try {
    const serializable = JSON.stringify(state);
    localStorage.setItem(LS_KEY_AUTH, serializable);
    console.log("State weas succefully saved to");
  } catch (err) {
    console.log("Error Occurred saving");
  }
};

export const invalidateAuthState = () => {
  try {
    localStorage.removeItem(LS_KEY_AUTH);
  } catch (err) {
    console.log("Error Deleting Keys");
  }
};
