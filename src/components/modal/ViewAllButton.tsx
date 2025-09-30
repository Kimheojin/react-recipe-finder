import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import "./ViewAllButton.css";

export default function ViewAllbutton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/recipes");
    };

    return (
        <>
            <Button className="view-all-button" onClick={handleClick}>
                전체 레시피 보기
            </Button>
        </>
    );
}
