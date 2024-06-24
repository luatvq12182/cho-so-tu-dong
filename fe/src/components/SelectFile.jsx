import { useEffect, useState } from "react";
import classNames from "classnames";

const SelectFile = (props) => {
    const [previewSrc, setPreviewSrc] = useState(props.src || "");

    useEffect(() => {
        setPreviewSrc(props.src);
    }, [props.src]);

    const handleClick = async () => {
        const [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: "Images",
                    accept: {
                        "image/*": [".png", ".gif", ".jpeg", ".jpg", ".webp"],
                    },
                },
            ],
            excludeAcceptAllOption: true,
            multiple: false,
        });
        const file = await fileHandle.getFile();

        const imageUrl = URL.createObjectURL(file);
        setPreviewSrc(imageUrl);

        if (props.onSelectFile) {
            props.onSelectFile(file);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={classNames(
                "select-file-box d-flex flex-column align-items-center justify-content-center",
                {
                    "is-invalid": !!props.isError,
                }
            )}
            style={{
                width: 100,
                height: 100,
                border: "1px dashed #d9d9d9",
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                borderRadius: 8,
                cursor: "pointer",
                transition: ".3s",
                backgroundImage: `url(${previewSrc})`,
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
        >
            <span>
                <svg
                    viewBox="64 64 896 896"
                    focusable="false"
                    data-icon="plus"
                    width="1em"
                    height="1em"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path>
                    <path d="M192 474h672q8 0 8 8v60q0 8-8 8H160q-8 0-8-8v-60q0-8 8-8z"></path>
                </svg>
            </span>
            <div>Upload</div>
        </div>
    );
};

export default SelectFile;
