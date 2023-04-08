import { Button, Col, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTableList } from "../redux/actions/databaseActions";
import { useParams, useNavigate } from "react-router-dom";
import CreateTableModal from "../components/CreateTableModal";

const DatabaseInfo = () => {
  const [open, setOpen] = React.useState(false);
  const dispatch = useDispatch();
  const { database } = useParams();
  const { tables } = useSelector((state) => state.database);
  useEffect(() => {
    dispatch(fetchTableList(database));
  }, [database]);
  return (
    <div className="table-list-cont">
      <div className="top">
        <span>Tables</span>
        <div>
          <Button type="primary">Filters</Button>
          <Button type="primary" onClick={() => setOpen(true)}>
            + New
          </Button>
        </div>
      </div>
      <div className="table-list">
        {tables.length > 0 ? (
          tables.map((table) => <TableComp table={table} database={database} />)
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span>No tables found</span>
          </div>
        )}
      </div>
      <CreateTableModal open={open} setOpen={setOpen} database={database}/>
    </div>
  );
};

const TableComp = ({ table, database }) => {
  const navigate = useNavigate();
  const nav = () => {
    navigate(`/database/${table.name}`);
  };
  return (
    <div className="table-comp">
      <div className="comp-top">
        <span>{table.name}</span>
        <div>
          <Button
            onClick={() => navigate(`/database/${database}/${table.name}`)}
          >
            View
          </Button>
          <Button type="primary">Edit</Button>
        </div>
      </div>
      <div className="comp-bottom">
        <span>Rows : 20</span>
        <span>Attributes : id,name,erc</span>
      </div>
    </div>
  );
};

export default DatabaseInfo;
