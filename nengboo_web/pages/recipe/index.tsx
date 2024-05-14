import React, { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { getEnglishName, getGPTRecipe, getRecipeImage } from "@/utils/actions";
import { parseData } from "@/utils/recipe";
import { TextHeader } from "@/components/TextHeader";
import { SubHeader } from "@/components/SubHeader";

const recipe = () => {
  const [recipeName, setRecipeName] = useState<string>("");
  const [ingredient, setIngredient] = useState<string[]>([]);
  const [cook, setCook] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [recipeImage, setRecipeImage] = useState<string>();

  useEffect(() => {
    const init = async () => {
      const data = await getGPTRecipe();
      parseData(data, setRecipeName, setIngredient, setCook);
    };
    init();
  }, []);

  useEffect(() => {
    if (!recipeName) return;
    const initEnglish = async () => {
      await getEnglishName(recipeName, setKeyword);
    };
    initEnglish();
  }, [recipeName]);

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
      <TextHeader />
      <div className="flex items-center justify-center">
        <img className="w-[334px] h-[334px]" src={recipeImage} />
      </div>

      <p className="mt-4 text-neutral-900 text-2xl font-bold">{recipeName}</p>

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

      <SubHeader title={"조리방법"} />
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

export default recipe;
