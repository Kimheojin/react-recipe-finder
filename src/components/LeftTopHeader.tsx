import { useNavigate } from "react-router-dom";
import { Button } from "@chakra-ui/react";
import "./LeftTopHeader.css";

export default function LeftTopHeader() {
    const navigate = useNavigate();
    const handelClck = () => {
        navigate("/");
    };
    return (
        <div className="left-top-header">
            <Button variant="outline" onClick={handelClck}>
                Recipe Finder
            </Button>
        </div>
    );
}
