import { Button, Col, Input, Modal, Row, Table } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTableList,
  getAttributes,
  runQuery,
} from "../redux/actions/databaseActions";
import { useParams, useNavigate } from "react-router-dom";
import CreateTableModal from "../components/CreateTableModal";
import AddColumnModal from "../components/AddColumnModal";

const DatabaseInfo = () => {
  const [open, setOpen] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const dispatch = useDispatch();
  const { database } = useParams();
  const { tables } = useSelector((state) => state.database);
  useEffect(() => {
    dispatch(fetchTableList({ database, search }));
  }, [database]);
  return (
    <div className="table-list-cont">
      <div className="top">
        <span>Tables</span>
        <Input.Search
          placeholder="Search"
          style={{ width: 300 }}
          onChange={(e) => {
            if (e.target.value.length === 0) {
              dispatch(fetchTableList({ database, search: search }));
            }
          }}
          onSearch={(value) =>
            dispatch(fetchTableList({ database, search: value }))
          }
          allowClear={true}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            // justifyContent: "space-between",
            width: 200,
          }}
        >
          {/* <Button type="primary" onClick={() => setOpenModal(true)}>
            Run Query
          </Button> */}
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
      <QueryModal open={openModal} setOpen={setOpenModal} database={database} />
    </div>
  );
};

const TableComp = ({ table, database }) => {
  const navigate = useNavigate();
  const [show, setShow] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const { redTables, greenTables } = useSelector((state) => state.database);

  const fetch = async () => {
    setLoading(true);
    const res = await dispatch(getAttributes({ database, table: table.name }));
    if (res) {
      setLoading(false);
      setShow(true);
    }
  };
  return (
    <div
      className="table-comp"
      style={{
        backgroundColor:
          table?.length > 0
            ? "rgba(0, 255, 0, 0.5)"
            : table?.length === 0
            ? "rgba(255, 0, 0, 0.5)"
            : "#efefef",
        // backgroundColor: redTables.includes(table.name)
        //   ? "rgba(255, 0, 0, 0.5)"
        //   : greenTables.includes(table.name)
        //   ? "rgba(0, 255, 0, 0.5)"
        //   : "#efefef",
        // opacity: 0.5,
      }}
    >
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

const QueryModal = ({ open, setOpen, database }) => {
  const [query, setQuery] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [output, setOutput] = React.useState();
  const dispatch = useDispatch();
  const run = () => {
    setLoading(true);
    dispatch(runQuery({ database, query }))
      .then((res) => {
        console.log(typeof res.output, "res");
        if (typeof res.output === "string") {
          setOutput(res.output);
        } else if (typeof res.output === "object") {
          setOutput(res.output);
        } else {
          setOutput("Something went wrong");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err, "err");
        setLoading(false);
      });
  };
  React.useEffect(() => {
    if (open) {
      setOutput();
      setQuery("");
    }
    return () => {
      setOutput();
      setQuery("");
    };
  }, [open]);

  return (
    <div>
      {console.log(output, "output")}
      <Modal
        title={`Run Query on ${database}`}
        visible={open}
        // onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
      >
        <Input.TextArea
          rows={5}
          placeholder="Write query"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
          }}
        />
        <Button
          type="primary"
          style={{ marginTop: 20 }}
          onClick={run}
          loading={loading}
        >
          Run
        </Button>
        <div
          className="output"
          style={{
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            height: "auto",
            minHeight: 100,
            // maxHeight: 150,
            width: "100%",
            // overflow: "auto",
            border: "1px solid #d9d9d9",
            borderRadius: 4,
            marginTop: 20,
            padding: 10,
          }}
        >
          {output &&
            (typeof output === "string" ? (
              <span style={{ color: "red" }}>{output}</span>
            ) : (
              <>
                <Table
                  dataSource={output}
                  columns={Object.keys(output[0]).map((key) => ({
                    title: key,
                    dataIndex: key,
                    width: 200,
                  }))}
                  loading={loading}
                  scroll={{ x: "max-content", y: "calc(100vh - 550px)" }}
                  style={{ position: "sticky", top: "0" }}
                />
              </>
            ))}
        </div>
      </Modal>
    </div>
  );
};

export default DatabaseInfo;
