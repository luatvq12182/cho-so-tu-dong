import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Badge, Table } from "reactstrap";
import { getLogFileContent } from "../services";

const LogFileContent = () => {
    const [content, setContent] = useState([]);
    const { fileName } = useParams();

    useEffect(() => {
        handleGetLogFileContent();
    }, []);

    const handleGetLogFileContent = async () => {
        try {
            const res = await getLogFileContent(fileName);

            console.log(res.data);

            setContent(res.data);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <div>
            <Table>
                <colgroup>
                    <col width={"5%"} />
                    <col width={"10%"} />
                    <col width={"70%"} />
                    <col width={"15%"} />
                </colgroup>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Type</th>
                        <th>Message</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {content.map((e, i) => {
                        const date = new Date(e.timestamp);
                        const d = date.getDate();
                        const m = date.getMonth() + 1;
                        const y = date.getFullYear();
                        const h = date.getHours();
                        const mi = date.getMinutes();
                        const s = date.getSeconds();

                        const colors = {
                            info: "primary",
                            error: "danger",
                        };

                        return (
                            <tr key={e.timestamp}>
                                <th>{i + 1}</th>
                                <td>
                                    <Badge color={colors[e.level]}>
                                        {e.level}
                                    </Badge>
                                </td>
                                <td>{e.message}</td>
                                <td>{`${d.toString().padStart(2, "0")}-${m
                                    .toString()
                                    .padStart(
                                        2,
                                        "0"
                                    )}-${y} ${h}:${mi}:${s}`}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </Table>
        </div>
    );
};

export default LogFileContent;
