import { useEffect, useState } from "react";
import { Button, Card, CardBody, Table } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModalDomain from "../components/ModalDomain";
import {
    createDomain,
    getDomains,
    updateDomain,
    deleteDomain,
    autoGenNumbers,
} from "../services";

const Domain = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dataEdit, setDataEdit] = useState(null);
    const [domains, setDomains] = useState([]);

    useEffect(() => {
        handleGetDomains();
    }, []);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const handleEdit = (data) => {
        setDataEdit(data);
        toggle();
    };

    const handleGetDomains = async () => {
        try {
            const res = await getDomains();

            setDomains(res.data);
        } catch (error) {
            if (error.response.status === 403) {
                window.alert("Phiên đăng nhập đã hết hạn");

                window.location.href = "/sign-in";
            }

            console.log("Error getDomains: ", error);
        }
    };

    const handleCreateDomain = async (payload) => {
        try {
            await createDomain(payload);

            handleGetDomains();

            toggle();
        } catch (error) {
            if (error.response.status === 403) {
                window.alert("Phiên đăng nhập đã hết hạn");

                window.location.href = "/sign-in";
            }

            console.log("Error createDomain: ", error);
        }
    };

    const handleUpdateDomain = async (payload) => {
        try {
            await updateDomain(payload);

            handleGetDomains();

            toggle();
        } catch (error) {
            if (error.response.status === 403) {
                window.alert("Phiên đăng nhập đã hết hạn");

                window.location.href = "/sign-in";
            }

            console.log("Error updateDomain: ", error);
        }
    };

    const handleDeleteDomain = async (id) => {
        try {
            const ifConfirm = window.confirm("Xác nhận xoá bản ghi này");

            if (ifConfirm) {
                await deleteDomain(id);

                handleGetDomains();
            }
        } catch (error) {
            if (error.response.status === 403) {
                window.alert("Phiên đăng nhập đã hết hạn");

                window.location.href = "/sign-in";
            }

            console.log("Error deleteDomain: ", error);
        }
    };

    const handleAutoGenNumbers = async () => {
        try {
            await autoGenNumbers();

            toast.info(`Done!`);
        } catch (error) {
            console.log("Error");
            toast.error('Thất bại');
        }
    };

    return (
        <div>
            <ModalDomain
                open={isOpen}
                toggle={toggle}
                data={dataEdit}
                onSubmit={(payload) => {
                    if (payload._id) {
                        handleUpdateDomain(payload);
                    } else {
                        handleCreateDomain(payload);
                    }
                }}
            />

            <ToastContainer />

            <Card>
                <CardBody>
                    <div className="mb-2">
                        <Button
                            onClick={() => {
                                setDataEdit(null);
                                toggle();
                            }}
                            color="primary me-2"
                        >
                            Thêm mới
                        </Button>

                        <Button
                            onClick={handleAutoGenNumbers}
                            color="success primary"
                        >
                            Tạo số
                        </Button>
                    </div>

                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Tên</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {domains.map((e, i) => {
                                return (
                                    <tr key={e.value}>
                                        <td>{i + 1}</td>
                                        <td>{e.name}</td>
                                        <td>
                                            <Button
                                                onClick={() => {
                                                    handleEdit(e);
                                                }}
                                                color="success me-2"
                                            >
                                                Sửa
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    handleDeleteDomain(e._id);
                                                }}
                                                color="danger"
                                            >
                                                Xoá
                                            </Button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
};

export default Domain;
