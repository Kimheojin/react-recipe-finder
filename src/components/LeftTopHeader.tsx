import { useNavigate } from "react-router-dom";

export default function LeftTopHeader() {
    const navigate = useNavigate();
    const handelClck = () => {
        navigate("/");
    };
    return (
        <div className="ml-2.5">
            <a onClick={handelClck} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                Recipe Finder
            </a>
        </div>
    );
}
