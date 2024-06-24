import { useState } from "react";
import classNames from "classnames";
import { Button, Input } from "reactstrap";
import { generateRandomId } from "../utils";

const DEFAULT_FORM_DATA = {
    name: "",
    checkType: "1",
    numberType: "1",
    quantity: 1,
};

const AddNewRow = (props) => {
    const [rowData, setRowData] = useState(DEFAULT_FORM_DATA);
    const [errors, setErrors] = useState({});

    const handleChange = (field) => (value) => {
        if (field === "name" && !!value && errors.name) {
            setErrors({
                ...errors,
                name: false,
            });
        }

        if (field === "quantity" && !!value && errors.quantity) {
            setErrors({
                ...errors,
                quantity: false,
            });
        }

        setRowData({
            ...rowData,
            [field]: value,
        });
    };

    const handleSubmit = () => {
        let errorFields = {};

        if (!rowData.quantity) {
            errorFields.quantity = true;
        }

        if (Object.keys(errorFields).length > 0) {
            setErrors(errorFields);
            return;
        }

        if (props.onSubmit) {
            props.onSubmit({
                id: generateRandomId(),
                ...rowData,
            });
        }
    };

    return (
        <tr>
            <td>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    className={classNames({
                        "is-invalid": !!errors.name,
                    })}
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
                    className={classNames({
                        "is-invalid": !!errors.quantity,
                    })}
                    id="name"
                    name="name"
                    type="number"
                    value={rowData.quantity}
                    onChange={(e) => {
                        handleChange("quantity")(e.target.value);
                    }}
                />
            </td>
            <td className="text-center">
                <Button className="me-2" onClick={handleSubmit} color="primary">
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

export default AddNewRow;
