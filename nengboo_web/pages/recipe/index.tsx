import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import arrowLeft from "@/public/arrowLeft.svg";
import { Checkbox } from "@/components/ui/checkbox";
import { getGPTRecipe, getRecipeImage } from "@/utils/actions";

const recipe = () => {
  const [recipeName, setRecipeName] = useState<string>();
  const [ingredient, setIngredient] = useState<string[]>();
  const [cook, setCook] = useState<string[]>();
  const [keyword, setKeyword] = useState<string>("");
  const [recipeImage, setRecipeImage] = useState<string>();

  const parseData = (recipeString: string) => {
    const recipeNameRegex = /레시피 이름: (.*)\n/;
    const recipeName = recipeString.match(recipeNameRegex)![1];

    const ingredientsRegex = /재료: (.*)\n조리방법:/;
    const ingredients = recipeString.match(ingredientsRegex)![1].split(", ");

    const instructionsRegex = /조리방법: ((?:\d+\. .*?\n))/;
    const instructions = recipeString
      .match(instructionsRegex)![1]
      .split(". ")
      .filter((e) => e.length > 1);

    const englishNameRegex = /레시피 영어이름: (.*)/;
    const englishName = recipeString.match(englishNameRegex)![1];

    setRecipeName(recipeName);
    setKeyword(englishName);
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

  useEffect(() => {
    if (!keyword) return;

    const getImage = async () => {
      const recipeImg = await getRecipeImage(keyword);
      setRecipeImage(recipeImg);
    };
    getImage();
  }, [keyword]);
  return (
    <main className="mx-6">
      <Header />
      <div className="flex items-center justify-center">
        <img className="w-[334px] h-[334px]" src={recipeImage} />
      </div>

      <p className="mt-6 text-neutral-900 text-2xl font-bold">{recipeName}</p>

      <SubHeader title={"재료"} />
      <ul>
        {ingredient?.map((e) => (
          <li className="flex items-center space-x-2" key={e}>
            <Checkbox id="e" key={e} />
            <label
              htmlFor="terms1"
              className="text-neutral-500 text-base font-medium "
            >
              {e}
            </label>
          </li>
        ))}
      </ul>

      <SubHeader title={"조리법"} />
      <ul>
        {cook?.map((e) => (
          <li className="flex items-center space-x-2" key={e}>
            <Checkbox id="e" key={e} />
            <label
              htmlFor="terms1"
              className="text-neutral-500 text-base font-medium "
            >
              {e}
            </label>
          </li>
        ))}
      </ul>
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

export default recipe;
