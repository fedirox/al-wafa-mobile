import { StackActions, NavigationActions } from "react-navigation";

export const goTo = (route) => {
  return StackActions.reset({
    index: 0,
    actions: [NavigationActions.navigate({ routeName: route })],
  });
};

export const goToWithParams = (route, myParams) => {
  return StackActions.reset({
    index: 0,
    actions: [
      NavigationActions.navigate({ routeName: route, params: myParams }),
    ],
  });
};
