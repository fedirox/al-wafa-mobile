import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import Home from "../screens/Home";
import SendNumber from "../screens/SendNumber";
import CodeVerification from "../screens/CodeVerification";
import CreateProfile from "../screens/CreateProfile";
import MapGeolocation from "../screens/MapGeolocation";
import Confirmation from "../screens/Confirmation";
import Remerciment from "../screens/Remerciment";

const screens = {
  Home: {
    screen: Home,
  },
  SendNumber: {
    screen: SendNumber,
  },
  CodeVerification: {
    screen: CodeVerification,
  },
  CreateProfile: {
    screen: CreateProfile,
  },
  MapGeolocation: {
    screen: MapGeolocation,
  },
  Confirmation: {
    screen: Confirmation,
  },
  Remerciment: {
    screen: Remerciment,
  },
};

const MainStack = createStackNavigator(screens, {
  defaultNavigationOptions: { headerShown: false },
});

export default createAppContainer(MainStack);
