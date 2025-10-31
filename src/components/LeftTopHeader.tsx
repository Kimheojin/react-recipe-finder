import { useNavigate } from "react-router-dom";
import "./LeftTopHeader.css";

export default function LeftTopHeader() {
    const navigate = useNavigate();
    const handelClck = () => {
        navigate("/");
    };
    return (
        <div className="left-top-header">
            <a onClick={handelClck} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                Recipe Finder
            </a>
        </div>
    );
}
