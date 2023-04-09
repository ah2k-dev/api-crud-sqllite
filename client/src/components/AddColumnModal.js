import { Button, Col, Input, Modal, Row } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { addColumn, getAttributes } from "../redux/actions/databaseActions";
import swal from "sweetalert";

const AddColumnModal = ({ open, setOpen, database, table }) => {
  const dispatch = useDispatch();
  const { attributes } = useSelector((state) => state.database);
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState("");

  const handleAdd = async () => {
    let sameNameAttribute = attributes?.columns.find(val => val.name === name);
    if (sameNameAttribute) {
      swal("Error", "Attribute with same name already exists", "error");
      return;
    }
    setLoading(true);
    const res = await dispatch(
      addColumn({
        db: database,
        table: table.name,
        column_name: name,
        column_type: type,
      })
    );
    if (res) {
      setLoading(false);
      setName("");
      setType("");
      // setOpen(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      title={
        // <span>
        <span style={{ fontSize: "20px", fontWeight: "700" }}>Add Column</span>
        // </span>
      }
      onOk={() => setOpen(false)}
    >
      <div className="add-column-modal">
        <span>Previous Attributes</span>
        <div className="previous-attributes">
          <Row
            style={{
              paddingBottom: "10px",
              borderBottom: "1px solid #e8e8e8",
            }}
          >
            <Col span={12}>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                Name
              </span>
            </Col>
            <Col span={12}>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                }}
              >
                Type
              </span>
            </Col>
          </Row>
          {attributes?.columns?.map((attr) => (
            <Row>
              <Col span={12}>{attr.name}</Col>
              <Col span={12}>{attr.type}</Col>
            </Row>
          ))}
        </div>
        {/* <span>Add New</span> */}
        <div className="new-attributes">
          <Row>
            <Col span={12}>
              <Input
                placeholder="Name"
                style={{
                  width: "90%",
                }}
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </Col>
            <Col span={12}>
              <Input
                placeholder="Type"
                style={{
                  width: "90%",
                }}
                onChange={(e) => setType(e.target.value)}
                value={type}
              />
            </Col>
            <Col span={24}>
              <Button
                type="primary"
                style={{
                  // width: "90%",
                  marginTop: "10px",
                }}
                onClick={handleAdd}
                loading={loading}
              >
                Add New
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    </Modal>
  );
};

export default AddColumnModal;
