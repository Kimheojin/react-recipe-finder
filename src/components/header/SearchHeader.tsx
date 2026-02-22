import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import SearchBox from "./SearchBox";
import SearchSettingsModal from "../modal/SearchSettingsModal";
import ViewAllbutton from "../modal/ViewAllButton";

export default function SearchHeader() {
  return (
    <section className="surface-card relative flex flex-col items-center gap-8 px-10 pb-10 pt-14 text-center shadow-sm sm:px-14">
      {/* 우측 상단 개인화 페이지 링크 */}
      <div className="absolute right-6 top-6 sm:right-10 sm:top-10">
        <Link
          to="/guest"
          className="flex items-center gap-2 rounded-full border border-[#eef0f4] bg-white px-4 py-2 text-sm font-medium text-[#5d636f] transition hover:bg-[#f0f4ff] hover:text-[#2f5bda] shadow-sm"
          title="내 활동 확인하기"
        >
          <FaUserCircle className="text-lg" />
          <span className="hidden sm:inline">내 활동</span>
        </Link>
      </div>

      <div className="flex w-full flex-col items-center gap-4 border-b border-[#eef0f4] px-4 pb-6 sm:px-6">
        <p className="mt-2 inline-flex items-center rounded-full px-3 py-[0.35rem] text-[0.83rem] font-semibold text-[#2f5bda]">
          레시피 검색
        </p>
        <Link
          to="/"
          className="rounded-xl px-4 py-2 text-[48px] font-bold text-[#121417] transition hover:bg-[#f0f4ff] hover:text-[#2f5bda]"
        >
          레시피 파인더
        </Link>
        <p className="max-w-2xl text-base text-[#5d636f]">
          원하는 재료와 조건으로 바로 레시피를 찾고, 자동완성 추천과 검색어를 활용해 검색이 가능합니다.
        </p>
        <ViewAllbutton />
      </div>

      <div className="flex w-full flex-col gap-3 px-4 sm:px-6">
        <SearchBox />
        <div className="flex flex-col items-center gap-2 text-sm text-[#5d636f] sm:flex-row sm:justify-between">
          <span>자동 완성, 검색 조건을 조정할 수 있습니다.</span>
          <SearchSettingsModal />
        </div>
      </div>
    </section>
  );
}
