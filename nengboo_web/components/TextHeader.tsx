import { useRouter } from "next/router";

export const TextHeader = () => {
  const router = useRouter();
  return (
    <div className="flex mt-16 mb-14 justify-center">
      <p className="text-neutral-900 text-2xl font-bold text-center">
        AI 추천 레시피
      </p>
    </div>
  );
};
