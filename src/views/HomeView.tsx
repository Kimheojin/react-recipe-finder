import { LuChefHat, LuLeaf, LuSparkles } from "react-icons/lu";
import SearchHeader from "../components/header/SearchHeader";

const highlights = [
  {
    title: "계절별 추천",
    description: "요즘 가장 맛있는 재료로 구성된 레시피를 모아 보여드려요.",
    icon: LuLeaf,
  },
  {
    title: "한 번에 검색",
    description: "레시피명 · 재료명 · 조리순서를 한 번에 비교합니다.",
    icon: LuSparkles,
  },
  {
    title: "믿을 수 있는 출처",
    description: "검증된 출처의 링크를 바로 확인하고 따라 해보세요.",
    icon: LuChefHat,
  },
];

export default function HomeView() {
  return (
    <div className="space-y-6">
      <SearchHeader />

      <section className="grid gap-4 md:grid-cols-3">
        {highlights.map(({ title, description, icon: Icon }) => (
          <article
            key={title}
            className="surface-card flex flex-col gap-3 p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-[#f0f4ff] p-3 text-xl text-[#2f5bda]">
                <Icon />
              </span>
              <h3 className="text-base font-semibold text-[#121417]">{title}</h3>
            </div>
            <p className="text-sm text-[#5d636f]">{description}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
