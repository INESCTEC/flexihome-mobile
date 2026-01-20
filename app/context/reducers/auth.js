const auth = (state, { type, payload }) => {
  switch (type) {
    case "RESTORE_TOKEN":
      return {
        ...state,
        userToken: payload,
        loading: false,
      };

    case "UPDATE_REGISTER":
      return {
        ...state,
        data: payload,
      };

    case "LOGIN_LOADING":
    case "REGISTER_LOADING":
      return {
        ...state,
        loading: true,
      };

    case "REGISTER_SUCCESS":
      return {
        ...state,
        loading: false,
        data: payload,
        error: {},
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        loading: false,
        data: payload,
        isLoggedIn: true,
        userToken: payload.user.api,
        error: {},
      };

    case "UPDATE_LANGUAGE":
      return {
        ...state,
        lang: payload.lang,
      };

    case "LOGOUT_USER":
      return {
        ...state,
        loading: false,
        // data: null,
        isLoggedIn: false,
        userToken: null,
      };

    case "REGISTER_FAIL":
    case "LOGIN_FAIL":
      return {
        ...state,
        loading: false,
        error: payload,
      };

    case "CLEAR_AUTH_STATE":
      return {
        ...state,
        loading: false,
        data: null,
        error: null,
      };

    default:
      return state;
  }
};

export default auth;
