import { Link } from "react-router-dom";
import SearchBox from "./SearchBox";
import SearchSettingsModal from "../modal/SearchSettingsModal";
import ViewAllbutton from "../modal/ViewAllButton";

export default function SearchHeader() {
  return (
    <section className="surface-card flex flex-col items-center gap-8 px-10 pb-10 pt-14 text-center shadow-sm sm:px-14">
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
          원하는 재료와 조건으로 바로 레시피를 찾고, 자동완성 추천과 최신 검색어를 활용해
          더 빠르게 요리 아이디어를 얻어보세요.
        </p>
        <ViewAllbutton />
      </div>

      <div className="flex w-full flex-col gap-3 px-4 sm:px-6">
        <SearchBox />
        <div className="flex flex-col items-center gap-2 text-sm text-[#5d636f] sm:flex-row sm:justify-between">
          <span>검색 조건을 조정하면 필요한 결과만 선별해서 볼 수 있어요.</span>
          <SearchSettingsModal />
        </div>
      </div>
    </section>
  );
}
