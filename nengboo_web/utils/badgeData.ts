import meat from "@/public/badge/meat.png"
import refre from "@/public/badge/refre.png";
import diamond from "@/public/badge/diamond.png";
import recipe from "@/public/badge/recipe.png";
import fish from "@/public/badge/fish.png";
import wandoo from "@/public/badge/wandoo.png";
import milk from "@/public/badge/milk.png";
import trophy from "@/public/badge/trophy.png";

export const BadgeData = [
  {
    id: "1",
    name: "열일 가즈아",
    content: "꾸준한 노력만이 성공의 비결이죠.",
    fail_content: "7일 이상 만나서 이 업적을 달성해보세요.",
    image: trophy,
  },
  {
    id: "2",
    name: "유통기한 마스터",
    content: "시간은 금이니까, 유통기한은 다이아몬드?",
    fail_content: "유통기한을 잘 지켜 이 업적을 달성해보세요.",
    image: diamond,
  },
  {
    id: "3",
    name: "고기의 달인",
    content:
      "고기의 맛있는 비밀, 그것은 등록의 귀재! 육류의 선구자, 언제나 고기에 충실한 당신에게",
      fail_content: "고기를 \"등록\"해 이 업적을 달성해보세요.",
    image: meat,
  },
  {
    id: "4",
    name: "레알 파머",
    content:
      "푸릇푸릇한 채소들이 날 찾아왔어요! 농부의 마음으로 명예를 빛내보세요.",
      fail_content: "채소를 \"등록\"해 이 업적을 달성해보세요.",
    image: wandoo,
  },
  {
    id: "5",
    name: "제이크 더 다이버",
    content:
      "물 속의 비밀, 어류 등록의 달인! 바다의 신비를 품은 당신, 물고기의 친구!",
      fail_content: "생선을 \"등록\"해 이 업적을 달성해보세요.",
    image: fish,
  },
  {
    id: "6",
    name: "아이 러브 밀크",
    content:
      "우유를 사랑하는 마음으로, 우유 마니아로 선정되셨습니다! 신선하고 달콤한 우유의 세계를 만나보세요!",
      fail_content: "유제품을 \"등록\"해 이 업적을 달성해보세요.",
    image: milk,
  },
  {
    id: "7",
    name: "냉장고 탐험가",
    content:
      "냉장고 속으로 모험을 떠나보세요! 냉장고 탐험가로서 식품들 사이에서 벌어지는 진정한 이야기를 만나보세요.",
      fail_content: "냉장고에 처음 \"등록\"해 보세요.",
    image: refre,
  },
  {
    id: "8",
    name: "힐링스 키친",
    content:
      "요리의 비밀, 레시피의 보물을 찾아보세요! 새로운 레시피를 통해 당신의 요리 실력을 한층 업그레이드하세요.",
      fail_content: "레시피를 처음 \"검색\"해 보세요.",
    image: recipe,
  },
];
