import { databaseConstants } from "../constants";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api";

export const fetchDatabaseList = () => async (dispatch) => {
  try {
    const res = await axios.get("/database/list");
    if (res) {
      dispatch({
        type: databaseConstants.FETCH_DATABASE_LIST,
        payload: res.data,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

export const createDatabase = (payload) => async (dispatch) => {
  try {
    const res = await axios.post("/database/create", payload);
    if (res) {
      dispatch(fetchDatabaseList());
    }
  } catch (err) {
    console.log(err);
  }
};
