import { useEffect, useState } from "react";
import classNames from "classnames";
import {
    Button,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Table,
} from "reactstrap";
import SelectFile from "./SelectFile";
import useDomains from "../hooks/useDomains";
import { CHECK_TYPE_LABELS, NUMBER_TYPE_LABELS } from "../constants";
import AddNewRow from "./AddNewRow";
import EditingModeRow from "./EditingModeRow";

const DEFAULT_FORM_DATA = {
    name: "",
    sites: [],
};

const ModalExpert = ({ open, toggle, data, onSubmit }) => {
    const [addNew, setAddNew] = useState(false);
    const [rowEdit, setRowEdit] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [rowSoiCaus, setRowSoiCaus] = useState([]);
    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
    const [errors, setErrors] = useState({});
    const { domains } = useDomains();

    useEffect(() => {
        if (data) {
            setFormData({
                _id: data._id,
                name: data.name,
                sites: data.sites,
                avatar: data.avatar,
            });
            setRowSoiCaus(data.soicau);
        } else {
            setFormData(DEFAULT_FORM_DATA);
        }
    }, [data]);

    const handleChange = (field) => (value) => {
        if (field === "name" && !!value && errors.name) {
            setErrors({
                ...errors,
                name: false,
            });
        }

        if (field === "sites" && value.length > 0 && errors.sites) {
            setErrors({
                ...errors,
                sites: false,
            });
        }

        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSubmit = () => {
        let errorFields = {};

        if (!formData.name?.trim()) {
            errorFields.name = true;
        }

        if (!selectedFile && !formData.avatar) {
            errorFields.avatar = true;
        }

        if (formData.sites.length === 0) {
            errorFields.sites = true;
        }

        if (Object.keys(errorFields).length > 0) {
            setErrors(errorFields);
            return;
        }

        onSubmit({
            ...formData,
            avatar: selectedFile || formData.avatar,
            rowSoiCaus,
        });
    };

    const handleAddNew = () => {
        setAddNew(true);
    };

    return (
        <Modal size="xl" isOpen={open} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                {data ? "Edit chuyên gia" : "Thêm mới chuyên gia"}
            </ModalHeader>
            <ModalBody>
                <FormGroup>
                    <Label for="name">
                        Tên<span className="text-danger">*</span>
                    </Label>
                    <Input
                        id="name"
                        className={classNames({
                            "is-invalid": errors.name,
                        })}
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                            handleChange("name")(e.target.value);
                        }}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="avatar">
                        Avatar<span className="text-danger">*</span>
                    </Label>

                    <SelectFile
                        src={(`${window.location.origin}:3838` + '/' + formData?.avatar) || ''}
                        isError={errors.avatar}
                        onSelectFile={(file) => {
                            setSelectedFile(file);

                            if (errors.avatar) {
                                setErrors({
                                    ...errors,
                                    avatar: false,
                                });
                            }
                        }}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="avatar">
                        Soi cầu<span className="text-danger">*</span>
                    </Label>

                    <Table bordered>
                        <colgroup>
                            <col width={"25%"} />
                            <col width={"15%"} />
                            <col width={"25%"} />
                            <col width={"15%"} />
                            <col width={"20%"} />
                        </colgroup>

                        <thead>
                            <tr>
                                <th>Tên</th>
                                <th>
                                    Kiểu check
                                    <span className="text-danger">*</span>
                                </th>
                                <th>
                                    Loại số
                                    <span className="text-danger">*</span>
                                </th>
                                <th className="text-center">
                                    Số lượng
                                    <span className="text-danger">*</span>
                                </th>
                                <th className="text-center">#</th>
                            </tr>
                        </thead>

                        <tbody>
                            {rowSoiCaus.map((row) => {
                                if (rowEdit && row.id === rowEdit) {
                                    return (
                                        <EditingModeRow
                                            key={row.id}
                                            data={row}
                                            onSubmit={(data) => {
                                                setRowSoiCaus(
                                                    rowSoiCaus.map((e) => {
                                                        if (e.id === data.id) {
                                                            return data;
                                                        } else {
                                                            return e;
                                                        }
                                                    })
                                                );
                                                setRowEdit(null);
                                            }}
                                            onCancel={() => {
                                                setRowEdit(null);
                                            }}
                                        />
                                    );
                                }

                                return (
                                    <tr key={row.id}>
                                        <td>{row.name}</td>
                                        <td>
                                            {CHECK_TYPE_LABELS[row.checkType]}
                                        </td>
                                        <td>
                                            {NUMBER_TYPE_LABELS[row.numberType]}
                                        </td>
                                        <td className="text-center">
                                            {row.quantity}
                                        </td>
                                        <td className="text-center">
                                            <Button
                                                disabled={!!addNew || !!rowEdit}
                                                className="me-2"
                                                onClick={() => {
                                                    setRowEdit(row.id);
                                                }}
                                                color="success"
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                disabled={!!addNew || !!rowEdit}
                                                onClick={() => {
                                                    setAddNew(false);
                                                    setRowSoiCaus(rowSoiCaus.filter((e) => {
                                                        return e.id !== row.id;
                                                    }))
                                                }}
                                                color="danger"
                                            >
                                                Xoá
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}

                            {addNew && (
                                <AddNewRow
                                    onSubmit={(data) => {
                                        setRowSoiCaus([...rowSoiCaus, data]);
                                        setAddNew(false);
                                    }}
                                    onCancel={() => {
                                        setAddNew(false);
                                    }}
                                />
                            )}
                            <tr>
                                <td colSpan={5}>
                                    <Button
                                        disabled={!!addNew || !!rowEdit}
                                        color="primary"
                                        onClick={handleAddNew}
                                    >
                                        Thêm loại soi cầu
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </FormGroup>

                <FormGroup>
                    <Label for="avatar">
                        Site cho số<span className="text-danger">*</span>
                    </Label>

                    <Input
                        className={classNames({
                            "is-invalid": errors.sites,
                        })}
                        type="select"
                        multiple
                        value={formData.sites}
                        style={{
                            height: 200
                        }}
                        onChange={(e) => {
                            const options = e.target.options;
                            let selected = [];

                            for (let i = 0; i < options.length; i++) {
                                if (options[i].selected) {
                                    selected.push(options[i].value);
                                }
                            }

                            handleChange("sites")(selected);
                        }}
                    >
                        {domains.map((domain) => {
                            return (
                                <option key={domain._id} value={domain._id}>
                                    {domain.name}
                                </option>
                            );
                        })}
                    </Input>
                </FormGroup>
            </ModalBody>
            <ModalFooter>
                <Button
                    disabled={!!addNew || !!rowEdit}
                    color="primary"
                    onClick={handleSubmit}
                >
                    Xác nhận
                </Button>{" "}
                <Button color="secondary" onClick={toggle}>
                    Đóng
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default ModalExpert;
