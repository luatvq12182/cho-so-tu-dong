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

const ModalDomain = ({ open, toggle, data, onSubmit }) => {
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (data) {
            setFormData(data);
        } else {
            setFormData({
                name: "",
            });
        }
    }, [data]);

    const handleChange = (field) => (value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSubmit = () => {
        const fields = ["name"];

        for (let i = 0; i < fields.length; i++) {
            if (!formData[fields[i]]?.trim()) {
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
                    <Label for="name">Domain</Label>
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

export default ModalDomain;
