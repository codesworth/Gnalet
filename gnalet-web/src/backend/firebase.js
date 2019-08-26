import ProjectConfig from "../config/config";
import * as firebase from "firebase";

const backends = {};

const citifmFirebase = () => {
  const citifmConfig = ProjectConfig.citifm;
  const citifm = firebase.initializeApp(citifmConfig, "citifm");
  return citifm;
};

const defaultFirebase = () => {
  const defaultconfig = ProjectConfig.default;
  return firebase.initializeApp(defaultconfig);
};

backends.default = defaultFirebase();
backends.citifm = citifmFirebase();

export default backends;
