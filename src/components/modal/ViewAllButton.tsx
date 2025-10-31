import { useNavigate } from "react-router-dom";

export default function ViewAllbutton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/recipes");
    };

    return (
        <>
            <a onClick={handleClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                전체 레시피 보기
            </a>
        </>
    );
}
