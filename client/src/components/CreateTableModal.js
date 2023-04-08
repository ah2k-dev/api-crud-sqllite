import { Input, Modal } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTable } from "../redux/actions/databaseActions";

const CreateTableModal = ({ open, setOpen, database }) => {
  const [tableName, setTableName] = useState("");
  const dispatch = useDispatch();
  const save = async() => {
    const res = await dispatch(createTable({ database, name: tableName }));
    if(res){
      setOpen(false)
    }
  };
  return (
    <Modal open={open} onCancel={() => setOpen(false)} onOk={save} title="Create Table">
      <Input
        placeholder="Table Name"
        value={tableName}
        onChange={(e) => setTableName(e.target.value)}
      />
    </Modal>
  );
};

export default CreateTableModal;
