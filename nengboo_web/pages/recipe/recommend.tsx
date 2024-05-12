import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import arrowLeft from "@/public/arrowLeft.svg";
import { Checkbox } from "@/components/ui/checkbox";
import { getGPTRecipe } from "@/utils/actions";

const recommend = () => {
  const [recipeName, setRecipeName] = useState<string>();
  const [ingredient, setIngredient] = useState<string[]>();
  const [cook, setCook] = useState<string[]>();

  const parseData = (recipe: string) => {
    const target = recipe.split("\n").filter((e) => e.length > 0);
    console.log("target >>>", target);
    const recipeName = target[0];

    const ingredientStart = 3;
    const ingredientEnd = target.indexOf("조리방법:") - 1;
    const ingredients = target
      .slice(ingredientStart, ingredientEnd + 1)
      .map((item) => item.replace(/^- /, ""));

    const instructionsStart = target.indexOf("조리방법:") + 1;
    const instructionsEnd = target.length - 1;
    const instructions = target.slice(instructionsStart, instructionsEnd + 1);

    console.log("레시피 이름:", recipeName);
    console.log("재료:", ingredients);
    console.log("조리방법:", instructions);

    setRecipeName(recipeName);
    setIngredient(ingredients);
    setCook(instructions);
  };

  useEffect(() => {
    const init = async () => {
      const data = await getGPTRecipe();
      parseData(data);
    };
    init();
  }, []);
  return (
    <main className="mx-6">
      <Header />

      <p className="mt-6 text-neutral-900 text-2xl font-bold">{recipeName}</p>

      <SubHeader title={"재료"} />
      {ingredient?.map((e) => (
        <div className="flex items-center space-x-2">
          <Checkbox id="e" key={e} />
          <label
            htmlFor="terms1"
            className="text-neutral-500 text-base font-medium "
          >
            {e}
          </label>
        </div>
      ))}

      <SubHeader title={"조리법"} />
      {cook?.map((e) => (
        <p className="mt-3 text-zinc-800 text-base font-medium">{e}</p>
      ))}
    </main>
  );
};

const Header = () => {
  const router = useRouter();

  return (
    <div className="flex mt-16 mb-14">
      <Image
        src={arrowLeft}
        alt="BackButton"
        className="mr-2"
        width={9}
        height={18}
        onClick={() => router.back()}
      />
      <div className="relative grow justify-center">
        <div className="text-neutral-900 text-2xl font-bold text-center">
          AI 추천 레시피
        </div>
      </div>
    </div>
  );
};

const SubHeader = (title: { title: string }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="w-[140px] h-9 p-2 bg-neutral-100 rounded-[100px] justify-center items-center gap-2.5 inline-flex mt-32">
        <div className="w-[113px] h-[22px] justify-center items-center flex">
          <p className="w-[113px] h-[22px] text-center text-neutral-800 text-xl font-medium ">
            {title.title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default recommend;
