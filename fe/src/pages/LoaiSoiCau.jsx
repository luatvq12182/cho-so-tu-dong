import { useEffect, useState } from "react";
import { Button, Card, CardBody, Table } from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalLoaiSoiCau from "../components/ModalLoaiSoiCau";
import {
    createLoaiSoiCau,
    getLoaiSoiCau,
    updateLoaiSoiCau,
    deleteLoaiSoiCau,
} from "../services";
import {
    NUMBER_TYPE,
    NUMBER_TYPE_LABELS,
    PRIZE,
    PRIZE_LABELS,
} from "../constants";

const LoaiSoiCau = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dataEdit, setDataEdit] = useState({
        name: "",
        prize: PRIZE.LO,
        numberType: NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99,
        quantity: 1,
        numberOfDays: 1,
    });
    const [loaiSoiCau, setLoaiSoiCau] = useState([]);

    useEffect(() => {
        handleGetLoaiSoiCau();
    }, []);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const handleEdit = (data) => {
        setDataEdit(data);
        toggle();
    };

    const handleGetLoaiSoiCau = async () => {
        try {
            const res = await getLoaiSoiCau();

            setLoaiSoiCau(res.data);
        } catch (error) {
            if (error.response.status === 403) {
                window.alert("Phiên đăng nhập đã hết hạn");

                window.location.href = "/sign-in";
            }

            console.log("Error getLoaiSoiCau: ", error);
        }
    };

    const handleCreateLoaiSoiCau = async (payload) => {
        try {
            await createLoaiSoiCau(payload);

            handleGetLoaiSoiCau();

            toggle();
        } catch (error) {
            if (error.response.status === 403) {
                window.alert("Phiên đăng nhập đã hết hạn");

                window.location.href = "/sign-in";
            }

            console.log("Error createLoaiSoiCau: ", error);
        }
    };

    const handleUpdateLoaiSoiCau = async (payload) => {
        try {
            await updateLoaiSoiCau(payload);

            handleGetLoaiSoiCau();

            toggle();
        } catch (error) {
            if (error.response.status === 403) {
                window.alert("Phiên đăng nhập đã hết hạn");

                window.location.href = "/sign-in";
            }

            console.log("Error updateLoaiSoiCau: ", error);
        }
    };

    const handleDeleteLoaiSoiCau = async (id) => {
        try {
            const ifConfirm = window.confirm("Xác nhận xoá bản ghi này");

            if (ifConfirm) {
                await deleteLoaiSoiCau(id);

                handleGetLoaiSoiCau();
            }
        } catch (error) {
            if (error.response.status === 403) {
                window.alert("Phiên đăng nhập đã hết hạn");

                window.location.href = "/sign-in";
            }

            console.log("Error deleteLoaiSoiCau: ", error);
        }
    };

    const notify = (msg, err) => {
        if (err) {
            toast.error(msg);
        } else {
            toast.info(msg);
        }
    };

    return (
        <div>
            <ToastContainer />

            <ModalLoaiSoiCau
                open={isOpen}
                toggle={toggle}
                data={dataEdit}
                onSubmit={(payload) => {
                    if (payload._id) {
                        handleUpdateLoaiSoiCau(payload);
                    } else {
                        handleCreateLoaiSoiCau(payload);
                    }
                }}
            />

            <Card>
                <CardBody>
                    <div className="mb-2">
                        <Button
                            onClick={() => {
                                setDataEdit({
                                    name: "",
                                    prize: PRIZE.LO,
                                    numberType:
                                        NUMBER_TYPE.SO_NGAU_NHIEN_0_TO_99,
                                    quantity: 1,
                                    numberOfDays: 1,
                                });
                                toggle();
                            }}
                            color="primary"
                        >
                            Thêm mới
                        </Button>
                    </div>

                    <div
                        style={{
                            maxHeight: "calc(100vh - 200px)",
                            overflow: "auto",
                        }}
                    >
                        <Table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tên</th>
                                    <th>Loại</th>
                                    <th>Kiểu tạo số</th>
                                    <th>Số lượng số (cặp) tạo ra</th>
                                    <th>Số ngày soi cầu</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {loaiSoiCau.map((e, i) => {
                                    return (
                                        <tr key={e.value}>
                                            <td>{i + 1}</td>
                                            <td>{e.name}</td>
                                            <td>{PRIZE_LABELS[e.prize]}</td>
                                            <td>
                                                {
                                                    NUMBER_TYPE_LABELS[
                                                        e.numberType
                                                    ]
                                                }
                                            </td>
                                            <td className="text-center">
                                                {e.quantity}
                                            </td>
                                            <td className="text-center">
                                                {e.numberOfDays}
                                            </td>
                                            <td>
                                                <Button
                                                    onClick={() => {
                                                        const textToCopy = `[cho_so_tu_dong loai_soi_cau="${e.name}"]`;

                                                        navigator.clipboard
                                                            .writeText(
                                                                textToCopy
                                                            )
                                                            .then(
                                                                function () {
                                                                    notify(`Copy thành công: ${textToCopy}`);
                                                                },
                                                                function (err) {
                                                                    console.log(err);
                                                                    notify(`Copy thất bại`, true);
                                                                }
                                                            );
                                                    }}
                                                    color="primary me-2"
                                                >
                                                    Shortcode
                                                </Button>
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
                                                        handleDeleteLoaiSoiCau(
                                                            e._id
                                                        );
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
                    </div>
                </CardBody>
            </Card>
        </div>
    );
};

export default LoaiSoiCau;
