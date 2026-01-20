import * as AuthSession from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";

import React, { useCallback, useEffect, useState } from "react";
import { Image } from "react-native";
import {
  Button,
  Caption,
  TextInput,
  Title,
  TouchableRipple,
  HelperText,
  Snackbar,
} from "react-native-paper";
import * as WebBrowser from "expo-web-browser";
// var base64 = require("base-64");
import jwt_decode from "jwt-decode";

WebBrowser.maybeCompleteAuthSession();

export const GoogleLogin = ({ onGgl, loading }) => {
  //dev in expo go app and published to expo go
  const redirectUri = AuthSession.makeRedirectUri({ useProxy: false });
  // const redirectUri = AuthSession.makeRedirectUriAsync({ useProxy: false });

  const authorizationEndpoint =
    "https://auth.expo.io/@inesctecdev/hemsConnect/";

  const redirectUriOptions = {};
  const [userInfo, setUserInfo] = useState(null);
  const [stateToken, setStateToken] = useState(null);
  //   const [request, result, promptAsync] = AuthSession.useAuthRequest(
  //     {
  //       redirectUri,
  //       expoClientId:
  //         "179922702341-p9vn822tulpnf6htqkooa4tmga63qplt.apps.googleusercontent.com",
  //       // id_token will return a JWT token
  //       responseType: "id_token",
  //       scopes: ["email"],
  //     },
  //     { authorizationEndpoint }
  //   );
  const [request, result, promptAsync] = Google.useAuthRequest(
    {
      //   redirectUri,
      //   scopes: ["email"],
      responseType: "id_token",
      expoClientId:
        "179922702341-p9vn822tulpnf6htqkooa4tmga63qplt.apps.googleusercontent.com",
      iosClientId:
        "179922702341-i99tk1vanbeujqvtjo4ja54fkn4465t3.apps.googleusercontent.com",
      androidClientId:
        "179922702341-610t7jq6qq94tp40ohsjil3lvllqh01g.apps.googleusercontent.com",

      // shouldAutoExchangeCode: false,
    },
    { authorizationEndpoint }
  );

  //Development or production projects in Expo Go, or in a standalone build
  //   const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
  //   promptAsync({useProxy: true,  redirectUri });

  // Standalone builds in the App or Play Store:
  //   expo build:ios or expo build:android
  //ver patterns aqui https://docs.expo.dev/guides/authentication/#redirect-uri-patterns
  //   AuthSession.makeRedirectUri({ native: "<your_uri>" });

  useEffect(() => {
    async function evaluate() {
      //   WebBrowser.warmUpAsync();//move to APP.js
      if (result) {
        if (result.error) {
          console.log(
            "Authentication error: ",
            result.error || " login error!"
          );

          //   return WebBrowser.coolDownAsync();
          return;
        }

        if (result.type === "success") {
          // const { authentication } = result;
          const { params } = result;
          // console.log(params.id_token);

          //Retrive JWT token
          const jwtToken = params.id_token;
          setStateToken(jwtToken);

          if (jwtToken) {
            //decode jwt_token
            let user = getUserData(jwtToken);
            // console.log(user);

            setUserInfo(user);

            // user.json().then((data) => {
            //   setUserInfo(data);
            // });
          }
          return;
          //   return WebBrowser.coolDownAsync();
        }
      }
    }
    evaluate();
  }, [result]);

  const logout = async () => {
    // WebBrowser.openAuthSessionAsync("https://oauth2.googleapis.com/revoke");
    // let info = await fetch("https://oauth2.googleapis.com/revoke", {
    //   headers: { Authorization: `Bearer ${stateToken}` },
    // });

    // return info;

    try {
      await AuthSession.revokeAsync(
        { token: stateToken },
        { revocationEndpoint: "https://oauth2.googleapis.com/revoke" }
      );
      return null;
    } catch (err) {
      console.log("Logout error: ", err);
    }
  };

  const getUserData = (token) => {
    let info = "";

    try {
      info = jwt_decode(token);
      // console.log(info);
    } catch (err) {
      console.log("No valid jwt :", err);
    }
    //No need of a second round to get user data
    // const url = "https://www.googleapis.com/userinfo/v2/me";
    // info = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    //   headers: { Authorization: `Bearer ${token}` },
    // });

    return info;
  };

  return (
    <>
      {userInfo && userInfo.picture ? (
        <>
          <Button
            mode={"contained"}
            color="#66cdaa"
            disabled={loading}
            icon={() => (
              <Image
                style={{ width: 30, height: 30 }}
                source={{ uri: userInfo.picture }}
              ></Image>
            )}
            // onPress={() => logout()}
            onPress={() =>
              onGgl({
                ggl_token: stateToken,
                email: userInfo.email,
                first_name: userInfo.given_name,
                last_name: userInfo.family_name,
              })
            }
          >
            {`Continue as ${userInfo.name}`}
          </Button>
        </>
      ) : (
        <Button
          mode={"contained"}
          color="#fff"
          icon={"google"}
          onPress={() => promptAsync({ useProxy: true })}
          // onPress={() =>
          //   onGgl({
          //     email: "maria_sabado@gmail.fr",
          //     firstName: "maria",
          //     lastName: "sabado",
          //   })
          // }
        >
          {"SIGN IN WITH GOOGLE"}
        </Button>
      )}
    </>
  );
};
