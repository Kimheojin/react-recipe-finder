import { useNavigate } from "react-router-dom";
import { Link } from "@chakra-ui/react";
import "./LeftTopHeader.css";

export default function LeftTopHeader() {
    const navigate = useNavigate();
    const handelClck = () => {
        navigate("/");
    };
    return (
        <div className="left-top-header">
            <Link variant="underline" onClick={handelClck}>
                Recipe Finder
            </Link>
        </div>
    );
}
