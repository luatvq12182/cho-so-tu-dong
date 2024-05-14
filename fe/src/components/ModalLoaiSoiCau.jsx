/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
    Button,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "reactstrap";
import { randomNumber } from "../utils";
import { NUMBER_TYPE, PRIZE } from "../constants";

const ModalLoaiSoiCau = ({ open, toggle, data, onSubmit }) => {
    const [testRandomNums, setTestRandomNums] = useState([]);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (data) {
            setFormData(data);
        } else {
            setFormData({
                name: "",
                prize: PRIZE.LO,
                numberType: NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99,
                quantity: 1,
                numberOfDays: 1,
            });
        }
    }, [data]);

    const prizeOptions = [
        {
            value: PRIZE.LO,
            label: "Lô",
        },
        {
            value: PRIZE.DE,
            label: "Đề",
        },
    ];

    const numberTypeOptions = [
        {
            value: NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9,
            label: "Số ngẫu nhiên (0 -> 9)",
        },
        {
            value: NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99,
            label: "Số ngẫu nhiên (0 -> 99)",
        },
        {
            value: NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_999,
            label: "Số ngẫu nhiên (0 -> 999)",
        },
        {
            value: NUMBER_TYPE.SO_KEP,
            label: "Số kép",
        },
        {
            value: NUMBER_TYPE.CAP_SO_DAO,
            label: "Cặp số đảo",
        },
    ];

    const validQuantity = () => {
        const { quantity, numberType } = formData;

        if (quantity < 1) {
            window.alert("Số lượng phải >= 1");

            return false;
        }

        if (numberType === NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_9) {
            if (quantity > 10) {
                window.alert("Số lượng phải <= 10");

                return false;
            }
        }

        if (numberType === NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99) {
            if (quantity > 100) {
                window.alert("Số lượng phải <= 100");

                return false;
            }
        }

        if (numberType === NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_999) {
            if (quantity > 1000) {
                window.alert("Số lượng phải <= 1000");

                return false;
            }
        }

        if (numberType === NUMBER_TYPE.SO_KEP) {
            if (quantity > 10) {
                window.alert("Số lượng phải <= 10");

                return false;
            }
        }

        if (numberType === NUMBER_TYPE.CAP_SO_DAO) {
            if (quantity > 45) {
                window.alert("Số lượng phải <= 45");

                return false;
            }
        }

        return true;
    };

    const handleTestRandomNum = () => {
        if (!validQuantity()) {
            return;
        }

        setTestRandomNums(
            randomNumber(+formData.numberType, +formData.quantity)
        );
    };

    const handleChange = (field) => (value) => {
        setTestRandomNums([]);

        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSubmit = () => {
        const fields = [
            "name",
            "prize",
            "numberType",
            "quantity",
            "numberOfDays",
        ];

        for (let i = 0; i < fields.length; i++) {
            if (!formData[fields[i]]) {
                window.alert("Vui lòng nhập đủ các trường thông tin");
                return;
            }
        }

        onSubmit(formData);
    };

    return (
        <Modal size="lg" isOpen={open} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                {data ? "Sửa" : "Thêm mới"}
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="name">Tên loại soi cầu</Label>
                    <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                            handleChange("name")(e.target.value);
                        }}
                    />
                </FormGroup>

                <FormGroup tag="fieldset">
                    {prizeOptions.map((e) => {
                        return (
                            <FormGroup key={e.value} check>
                                <Input
                                    id={e.label}
                                    name="prize"
                                    value={e.value}
                                    type="radio"
                                    checked={formData.prize === e.value}
                                    onChange={(e) => {
                                        handleChange("prize")(+e.target.value);
                                    }}
                                />
                                <Label htmlFor={e.label} check>
                                    {e.label}
                                </Label>
                            </FormGroup>
                        );
                    })}
                </FormGroup>

                <FormGroup tag="fieldset">
                    {numberTypeOptions.map((e) => {
                        return (
                            <FormGroup key={e.value} check>
                                <Input
                                    id={e.label}
                                    name="numberType"
                                    value={e.value}
                                    type="radio"
                                    checked={formData.numberType === e.value}
                                    onChange={(e) => {
                                        handleChange("numberType")(
                                            +e.target.value
                                        );
                                    }}
                                />
                                <Label htmlFor={e.label} check>
                                    {e.label}
                                </Label>
                            </FormGroup>
                        );
                    })}
                </FormGroup>

                <FormGroup>
                    <Label for="quantity">Số lượng</Label>
                    <Input
                        id="quantity"
                        name="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => {
                            handleChange("quantity")(e.target.value);
                        }}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="numberOfDays">Số ngày soi cầu</Label>
                    <Input
                        id="numberOfDays"
                        name="numberOfDays"
                        type="number"
                        value={formData.numberOfDays}
                        onChange={(e) => {
                            handleChange("numberOfDays")(e.target.value);
                        }}
                    />
                </FormGroup>

                <div>
                    <Button onClick={handleTestRandomNum} color="primary">
                        Tạo thử
                    </Button>

                    <div
                        style={{
                            fontSize: 20,
                            fontWeight: "bolder",
                        }}
                        className="mt-2"
                    >
                        {formData.numberType === NUMBER_TYPE.CAP_SO_DAO
                            ? testRandomNums.map((e) => {
                                  return `(${e.join(" - ")})`;
                              })
                            : testRandomNums.join(" - ")}
                    </div>
                </div>
            </ModalBody>
            <ModalFooter>
                <Button color="primary" onClick={handleSubmit}>
                    Xác nhận
                </Button>{" "}
                <Button color="secondary" onClick={toggle}>
                    Đóng
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ModalLoaiSoiCau;
