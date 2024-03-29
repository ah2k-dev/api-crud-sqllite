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
      return true;
    }
  } catch (err) {
    console.log(err);
    swal("Error", err.response.message || "Error creating database", "error");
  }
};

export const fetchTableList = (payload) => async (dispatch) => {
  console.log(payload);
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
      return true;
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
      return true;
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
      dispatch(
        getAttributes({
          database: payload.db,
          table: payload.table,
        })
      );
      dispatch(
        fetchTableList({
          database: payload.db,
        })
      );
      return true;
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
      return true;
    }
  } catch (err) {
    console.log(err);
    swal("Error", err.response.message || "Error fetching data", "error");
  }
};

export const uploadDatabase = (file) => async (dispatch) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    const res = await axios.post("/database/upload", formData, config);
    if (res) {
      swal("Success", "Database uploaded successfully", "success");
      dispatch(fetchDatabaseList());
      return true;
    }
  } catch (err) {
    console.log(err);
    swal("Error", err.response.message || "Error uploading database", "error");
  }
};

export const runQuery = (payload) => async (dispatch) => {
  try {
    const res = await axios.post("/database/runQuery", payload);
    if (res) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
    swal("Error", err.response.message || "Error running query", "error");
  }
};

export const setRedTables = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: databaseConstants.SET_RED_TABLES,
      payload: payload,
    });
  } catch (err) {
    console.log(err);
    swal("Error", err.response.message || "Error setting red tables", "error");
  }
};

export const setGreenTables = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: databaseConstants.SET_GREEN_TABLES,
      payload: payload,
    });
  } catch (err) {
    console.log(err);
    swal("Error", err.response.message || "Error setting red tables", "error");
  }
};
