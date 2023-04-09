import { Button, Col, Input, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTableList,
  getAttributes,
} from "../redux/actions/databaseActions";
import { useParams, useNavigate } from "react-router-dom";
import CreateTableModal from "../components/CreateTableModal";
import AddColumnModal from "../components/AddColumnModal";

const DatabaseInfo = () => {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const dispatch = useDispatch();
  const { database } = useParams();
  const { tables } = useSelector((state) => state.database);
  useEffect(() => {
    dispatch(fetchTableList({database, search}));
  }, [database]);
  return (
    <div className="table-list-cont">
      <div className="top">
        <span>Tables</span>
        <Input.Search
          placeholder="Search"
          style={{ width: 200 }}
          onChange={(e) => {
            if(e.target.value.length === 0){
              dispatch(fetchTableList({database, search: search}));
            }
          }}
          onSearch={(value) => dispatch(fetchTableList({database, search: value}))}
          allowClear={true}

        />
        <div>
          {/* <Button type="primary">Filters</Button> */}
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
      <CreateTableModal open={open} setOpen={setOpen} database={database} />
    </div>
  );
};

const TableComp = ({ table, database }) => {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const fetch = async () => {
    setLoading(true);
    const res = await dispatch(getAttributes({ database, table: table.name }));
    if (res) {
      setLoading(false);
      setShow(true);
    }
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
          <Button
            type="primary"
            onClick={() => {
              fetch();
            }}
          >
            Edit
          </Button>
        </div>
      </div>
      <div className="comp-bottom">
        {/* <span>Rows : 20</span> */}
        <span>Attributes : {table.attributes.join(", ")}</span>
      </div>
      <AddColumnModal
        open={show}
        setOpen={setShow}
        database={database}
        table={table}
      />
    </div>
  );
};

export default DatabaseInfo;
