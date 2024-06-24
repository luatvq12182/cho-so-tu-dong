import React, { useState } from "react";
import { Button, Input } from "reactstrap";

const EditingModeRow = (props) => {
    const [rowData, setRowData] = useState(props.data);

    const handleChange = (field) => (value) => {
        setRowData({
            ...rowData,
            [field]: value,
        });
    };

    return (
        <tr>
            <td>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={rowData.name}
                    onChange={(e) => {
                        handleChange("name")(e.target.value);
                    }}
                />
            </td>
            <td>
                <Input
                    type="select"
                    value={rowData.checkType}
                    onChange={(e) => {
                        handleChange("checkType")(e.target.value);
                    }}
                >
                    <option value="1">Lô</option>
                    <option value="2">Lô Đầu</option>
                    <option value="3">Lô Đuôi</option>
                    <option value="4">3 Càng Lô</option>
                    <option value="5">Đề</option>
                    <option value="6">Đề Đầu</option>
                    <option value="7">Đề Đuôi</option>
                    <option value="8">3 Càng Đề</option>
                </Input>
            </td>
            <td>
                <Input
                    type="select"
                    value={rowData.numberType}
                    onChange={(e) => {
                        handleChange("numberType")(e.target.value);
                    }}
                >
                    <option value="1">{"0 -> 9"}</option>
                    <option value="2">{"0 -> 99"}</option>
                    <option value="3">{"0 -> 999"}</option>
                    <option value="4">Số kép</option>
                    <option value="5">Cặp số đảo</option>
                </Input>
            </td>
            <td>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={rowData.quantity}
                    onChange={(e) => {
                        handleChange("quantity")(e.target.value);
                    }}
                />
            </td>
            <td className="text-center">
                <Button
                    className="me-2"
                    onClick={() => {
                        if (props.onSubmit) {
                            props.onSubmit(rowData);
                        }
                    }}
                    color="primary"
                >
                    Xác nhận
                </Button>
                <Button
                    onClick={() => {
                        if (props.onCancel) {
                            props.onCancel();
                        }
                    }}
                    color="warning"
                >
                    Huỷ
                </Button>
            </td>
        </tr>
    );
};

export default EditingModeRow;
