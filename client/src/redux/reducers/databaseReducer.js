import { databaseConstants } from "../constants.js";
export const databaseReducer = (state = { databases: [] }, action) => {
  switch (action.type) {
    case databaseConstants.FETCH_DATABASE_LIST:
      return { ...state, loading: false, databases: action.payload };
    default:
      return state;
  }
};
