import { Link } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function ViewAllbutton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/recipes");
    };

    return (
        <>
            <Link variant="underline" onClick={handleClick}>
                전체 레시피 보기
            </Link>
        </>
    );
}
