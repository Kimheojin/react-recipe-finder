import { LuArrowUpRight } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export default function ViewAllbutton() {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/recipes");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-full border border-[#d7dbe2] px-4 py-2 text-sm font-semibold text-[#1f2329] transition hover:border-[#2f5bda] hover:text-[#2f5bda]"
    >
      전체 레시피 보기
      <LuArrowUpRight />
    </button>
  );
}
