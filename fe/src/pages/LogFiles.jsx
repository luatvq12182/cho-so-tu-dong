import { useEffect, useState } from "react";
import { getLogFiles } from "../services";
import { ListGroup, ListGroupItem } from "reactstrap";
import { Link } from "react-router-dom";

const LogFiles = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        handleGetLogFiles();
    }, []);

    const handleGetLogFiles = async () => {
        try {
            const res = await getLogFiles();

            setFiles(res.data);
        } catch (error) {
            console.log("Error: ", error);
        }
    };

    return (
        <div>
            <ListGroup>
                {files.map((file, i) => {
                    return (
                        <ListGroupItem key={i}>
                            <Link to={"/logs/" + file}>{file}</Link>
                        </ListGroupItem>
                    );
                })}
            </ListGroup>
        </div>
    );
};

export default LogFiles;
