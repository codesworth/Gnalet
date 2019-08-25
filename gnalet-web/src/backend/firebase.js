import ProjectConfig from "../config/config";
import * as firebase from "firebase";

const backends = {};

export const initialize = () => {
  const defaultconfig = ProjectConfig.default;
  const citifm = ProjectConfig.citifm;
  firebase.initializeApp(defaultconfig);
  const citifm = firebase.initializeApp(citifm, "citifm");
  backends.citifm = citifm;
};

export default backends;
