import { databaseConstants } from "../constants";
import axios from "axios";
import swal from "sweetalert";

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
    swal(
      "Error",
      err.response.message || "Error fetching database list",
      "error"
    );
  }
};

export const createDatabase = (payload) => async (dispatch) => {
  try {
    const res = await axios.post("/database/create", payload);
    console.log(res);
    if (res) {
      swal("Success", "Database created successfully", "success");
      dispatch(fetchDatabaseList());
      return true
    }
  } catch (err) {
    console.log(err);
    swal("Error", err.response.message || "Error creating database", "error");
  }
};

export const fetchTableList = (payload) => async (dispatch) => {
  try {
    const res = await axios.post(`/table/list/${payload.database}`, {
      search: payload.search,
    });
    if (res) {
      dispatch({
        type: databaseConstants.FETCH_TABLE_LIST,
        payload: res.data,
      });
    }
  } catch (err) {
    console.log(err);

    swal("Error", err.response.message || "Error fetching table list", "error");
  }
};

export const createTable = (payload) => async (dispatch) => {
  try {
    const res = await axios.post(`/table/create/${payload.database}`, payload);
    if (res) {
      swal("Success", "Table created successfully", "success");
      dispatch(fetchTableList(payload));
      dispatch(fetchDatabaseList());
      return true
    }
  } catch (err) {
    console.log(err);

    swal("Error", err.response.message || "Error creating table", "error");
  }
};

export const getAttributes = (payload) => async (dispatch) => {
  try {
    const res = await axios.get(
      `/table/get-attributes/${payload.database}/${payload.table}`
    );
    if (res) {
      dispatch({
        type: databaseConstants.FETCH_ATTRIBUTES,
        payload: res.data,
      });
      return true
    }
  } catch (err) {
    console.log(err);
    swal("Error", err.response.message || "Error fetching attributes", "error");
  }
};

export const addColumn = (payload) => async (dispatch) => {
  try {
    const res = await axios.post("/table/add-column", payload);
    if (res) {
      swal("Success", "Column added successfully", "success");
      dispatch(fetchTableList(payload.db));
      dispatch(getAttributes({
        database: payload.db,
        table: payload.table
      }));
      return true
    }
  } catch (err) {
    console.log(err);
    swal("Error", err.response.message || "Error adding column", "error");
  }
};

export const getData = (payload) => async (dispatch) => {
  try {
    const res = await axios.post("/table/get-data", payload);
    if (res) {
      dispatch({
        type: databaseConstants.FETCH_DATA,
        payload: res.data,
      });
      return true
    }
  } catch (err) {
    console.log(err);
    swal("Error", err.response.message || "Error fetching data", "error");
  }
};
