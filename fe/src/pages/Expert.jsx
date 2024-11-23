import { useEffect, useState } from "react";
import { Button, Card, CardBody, Table } from "reactstrap";
import ModalExpert from "../components/ModalExpert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    createExpert,
    deleteExpert,
    getExperts,
    updateExpert,
} from "../services";
import useDomains from "../hooks/useDomains";
import { CHECK_TYPE_LABELS, NUMBER_TYPE_LABELS } from "../constants";

const Expert = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [experts, setExperts] = useState([]);
    const { domains } = useDomains();
    const [viewDetailWinningRate, setViewDetailWinningRate] = useState({});
    const [dataEdit, setDataEdit] = useState(null);

    useEffect(() => {
        handleGetExperts();
    }, []);

    const toggle = () => {
        setIsOpen(!isOpen);
    };

    const handleEdit = (data) => {
        setDataEdit(data);
        toggle();
    };

    const handleSubmit = async (data) => {
        try {
            setIsOpen(false);

            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("avatar", data.avatar);
            formData.append("sites", JSON.stringify(data.sites));
            formData.append("soicau", JSON.stringify(data.rowSoiCaus));

            if (data._id) {
                formData.append("_id", data._id);
                await updateExpert(formData);
            } else {
                await createExpert(formData);
            }
            handleGetExperts();
        } catch (error) {
            console.log("Error: ", error);

            toast.error("Có lỗi xảy ra!");
        }
    };

    const handleGetExperts = async () => {
        try {
            const res = await getExperts();

            setExperts(res.data);
        } catch (error) {
            if (error.response.status === 403) {
                window.alert("Phiên đăng nhập đã hết hạn");

                window.location.href = "/sign-in";
            }

            console.log("Error getExperts: ", error);

            toast.info("Có lỗi xảy ra!");
        }
    };

    const handleDeleteExpert = async (id) => {
        try {
            const ifConfirm = window.confirm("Xác nhận xoá bản ghi này");

            if (ifConfirm) {
                await deleteExpert(id);

                handleGetExperts();
            }
        } catch (error) {
            if (error.response.status === 403) {
                window.alert("Phiên đăng nhập đã hết hạn");

                window.location.href = "/sign-in";
            }

            console.log("Error deleteExpert: ", error);
        }
    };

    const toggleViewWinningRate = (expertId) => {
        if (!viewDetailWinningRate[expertId]) {
            setViewDetailWinningRate({
                ...viewDetailWinningRate,
                [expertId]: expertId,
            });
        } else {
            const cloneObj = { ...viewDetailWinningRate };
            delete cloneObj[expertId];

            setViewDetailWinningRate(cloneObj);
        }
    };

    return (
        <div>
            <ModalExpert
                key={dataEdit?._id || ""}
                open={isOpen}
                toggle={toggle}
                data={dataEdit}
                onSubmit={handleSubmit}
            />

            <ToastContainer />

            <Card>
                <CardBody>
                    <div className="mb-2">
                        <Button
                            onClick={() => {
                                toggle();
                                setDataEdit(null);
                            }}
                            color="primary"
                        >
                            Thêm chuyên gia
                        </Button>
                    </div>

                    <div
                        style={{
                            maxHeight: "calc(100vh - 200px)",
                            overflow: "auto",
                        }}
                    >
                        <Table bordered>
                            <colgroup>
                                <col width="5%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="15%" />
                                <col width="20%" />
                                <col width="30%" />
                                <col width="10%" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Avatar</th>
                                    <th>Tên</th>
                                    <th>Soi cầu</th>
                                    <th>Tỉ lệ thắng</th>
                                    <th>Site soi cầu</th>
                                    <th className="text-center">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                {experts.map((expert, i) => {
                                    let winRateAvg;

                                    if (expert.metadata?.winRate) {
                                        const winRate = Object.values(
                                            expert.metadata?.winRate
                                        );

                                        winRateAvg = (
                                            winRate.reduce((pre, cr) => {
                                                return pre + cr;
                                            }, 0) / winRate.length
                                        ).toFixed(2);
                                    }

                                    return (
                                        <tr key={expert._id}>
                                            <td>{i + 1}</td>
                                            <td>
                                                <img
                                                    style={{
                                                        width: 80,
                                                    }}
                                                    src={
                                                        import.meta.env
                                                            .VITE_SERVICE +
                                                        `/${expert.avatar}`
                                                    }
                                                />
                                            </td>
                                            <td>
                                                <b>{expert.name}</b>
                                            </td>
                                            <td>
                                                {expert.soicau.map((e) => {
                                                    return (
                                                        <div
                                                            style={{
                                                                border: "1px solid rgba(0, 0, 0, 0.176)",
                                                            }}
                                                            className="p-2"
                                                            key={e.id}
                                                        >
                                                            <b>
                                                                (
                                                                {
                                                                    CHECK_TYPE_LABELS[
                                                                        e
                                                                            .checkType
                                                                    ]
                                                                }
                                                                ) {e.name}
                                                            </b>
                                                            <div>
                                                                {
                                                                    NUMBER_TYPE_LABELS[
                                                                        e
                                                                            .numberType
                                                                    ]
                                                                }
                                                            </div>
                                                            <div>
                                                                Số lượng:{" "}
                                                                {e.quantity}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </td>
                                            <td>
                                                <div>
                                                    <b>{winRateAvg || 0}%</b>{" "}
                                                    (Trung bình)
                                                </div>
                                                {!viewDetailWinningRate[
                                                    expert._id
                                                ] && (
                                                    <a
                                                        onClick={() => {
                                                            toggleViewWinningRate(
                                                                expert._id
                                                            );
                                                        }}
                                                        href={
                                                            "#/winning_rate/" +
                                                            expert._id
                                                        }
                                                    >
                                                        Xem chi tiết
                                                    </a>
                                                )}

                                                {viewDetailWinningRate[
                                                    expert._id
                                                ] && (
                                                    <Table
                                                        className="mb-0"
                                                        bordered
                                                    >
                                                        <thead>
                                                            <tr>
                                                                <th>Site</th>
                                                                <th className="text-center">
                                                                    Tỉ lệ thắng
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Object.keys(
                                                                expert.metadata
                                                                    ?.winRate ||
                                                                    {}
                                                            ).map((e) => {
                                                                const winRate =
                                                                    expert.metadata?.winRate[
                                                                        e
                                                                    ].toFixed(
                                                                        2
                                                                    );

                                                                return (
                                                                    <tr key={e}>
                                                                        <td>
                                                                            {e}
                                                                        </td>
                                                                        <td className="text-center">
                                                                            {
                                                                                winRate
                                                                            }
                                                                            %
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </Table>
                                                )}

                                                {viewDetailWinningRate[
                                                    expert._id
                                                ] && (
                                                    <a
                                                        className="d-inline-block"
                                                        onClick={() => {
                                                            toggleViewWinningRate(
                                                                expert._id
                                                            );
                                                        }}
                                                        href={
                                                            "#/winning_rate/" +
                                                            expert._id
                                                        }
                                                    >
                                                        Ẩn bớt
                                                    </a>
                                                )}
                                            </td>
                                            <td>
                                                {expert.sites
                                                    .map((site) => {
                                                        const find =
                                                            domains.find(
                                                                (d) =>
                                                                    d._id ===
                                                                    site
                                                            );
                                                        if (!find) return "";

                                                        return (
                                                            <a
                                                                key={find?._id}
                                                                className="me-2"
                                                                target="_blank"
                                                                href={
                                                                    "https://" +
                                                                    find?.name
                                                                }
                                                            >
                                                                {find?.name}
                                                            </a>
                                                        );
                                                    })
                                                    .filter(Boolean)}
                                            </td>
                                            <td className="text-center">
                                                <Button
                                                    className="me-2"
                                                    color="primary"
                                                    onClick={() => {
                                                        handleEdit(expert);
                                                    }}
                                                >
                                                    Sửa
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        handleDeleteExpert(
                                                            expert._id
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

export default Expert;
