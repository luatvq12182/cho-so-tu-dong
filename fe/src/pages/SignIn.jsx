import { useState } from "react";
import { signIn } from "../services";

const SignIn = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (field) => (value) => {
        setFormData({
            ...formData,
            [field]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.username?.trim() || !formData.password?.trim()) {
            window.alert("Vui lòng nhập username và password");

            return;
        }

        try {
            const res = await signIn(formData);

            const jwtToken = res.data.token;

            window.localStorage.setItem("jwt_token", jwtToken);

            window.location.href = "/loai-soi-cau";
        } catch (error) {
            window.alert(error.response?.data?.message);
        }
    };

    return (
        <div
            className="text-center"
            style={{
                height: "100vh",
                display: "flex",
                alignItems: "center",
                paddingTop: "40px",
                paddingBottom: "40px",
                backgroundColor: "#f5f5f5",
            }}
        >
            <form onSubmit={handleSubmit} className="form-signin">
                <h1 className="h3 mb-3 font-weight-normal">Sign in</h1>

                <label htmlFor="username" className="sr-only">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    className="form-control"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => {
                        handleChange("username")(e.target.value);
                    }}
                />

                <label htmlFor="inputPassword" className="sr-only">
                    Password
                </label>
                <input
                    type="password"
                    id="inputPassword"
                    className="form-control"
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => {
                        handleChange("password")(e.target.value);
                    }}
                />

                <button
                    className="btn btn-lg btn-primary btn-block mt-4"
                    type="submit"
                >
                    Sign in
                </button>
                <p className="mt-5 mb-3 text-muted">© 2024</p>
            </form>
        </div>
    );
};

export default SignIn;
