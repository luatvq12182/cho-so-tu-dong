import { useEffect, useState } from "react";
import { getDomains } from "../services";

const useDomains = () => {
    const [domains, setDomains] = useState([]);

    useEffect(() => {
        handleGetDomains();
    }, []);

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

    return { domains };
};

export default useDomains;
