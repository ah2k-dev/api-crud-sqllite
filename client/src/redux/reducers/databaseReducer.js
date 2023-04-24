import { databaseConstants } from "../constants.js";
export const databaseReducer = (
  state = {
    databases: [],
    tables: [],
    attributes: [],
    data: {
      tableData: [],
      tableCol: [],
      page: 1,
      limit: 10,
      total: 0,
    },
  },
  action
) => {
  switch (action.type) {
    case databaseConstants.FETCH_DATABASE_LIST:
      return { ...state, loading: false, databases: action.payload };
    case databaseConstants.FETCH_TABLE_LIST:
      return { ...state, loading: false, tables: action.payload };
    case databaseConstants.FETCH_ATTRIBUTES:
      return { ...state, loading: false, attributes: action.payload };
    case databaseConstants.FETCH_DATA:
      const tableData =
        action.payload.data.length > 0
          ? action.payload.data.map((item) => {
              return action.payload.columns.reduce((obj, key, index) => {
                obj[key] = item[index];
                return obj;
              }, {});
            })
          : [];
      const tableCol =
        action.payload.columns.length > 0
          ? action.payload.columns.map((col) => ({
              title: col,
              dataIndex: col,
              width: 200,
              sorter: (a, b) => {
                const val1 = a[col];
                const val2 = b[col];
                if (typeof val1 === "number" && typeof val2 === "number") {
                  return val1 - val2; // number sorting
                } else {
                  return val1.localeCompare(val2); // string sorting
                }
              },
              sortDirections: ["ascend", "descend"],
            }))
          : [];
      return {
        ...state,
        loading: false,
        data: {
          tableData,
          tableCol,
          page: action.payload.page,
          limit: action.payload.pageSize,
          total: action.payload.totalCount,
        },
      };
    default:
      return state;
  }
};
