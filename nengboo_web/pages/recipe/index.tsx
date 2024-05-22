import React, { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { getEnglishName, getGPTRecipe, getRecipeImage } from "@/utils/actions";
import { parseData } from "@/utils/recipe";
import { TextHeader } from "@/components/TextHeader";
import { SubHeader } from "@/components/SubHeader";
import { useRouter } from "next/router";
import Loading from "@/components/loading";

const Recipe = () => {
  const router = useRouter();
  const [recipeName, setRecipeName] = useState<string>("");
  const [ingredient, setIngredient] = useState<string[]>([]);
  const [cook, setCook] = useState<string[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [recipeImage, setRecipeImage] = useState<string>();

  useEffect(() => {
    if (!router.query) return;

    const init = async () => {
      const data = await getGPTRecipe(router.query.refrige_id);
      parseData(data, setRecipeName, setIngredient, setCook);
    };
    init();
  }, [router]);

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
    <main className="relative mx-auto h-[250dvh] w-full max-w-[430px] overflow-y-hidden bg-[#ffffff] ">
      <section className="mx-6">
        <TextHeader title={"AI 추천 레시피"} />
        <figure className="flex items-center justify-center">
          {recipeImage ? (
            <img className="w-[334px] h-[334px]" src={recipeImage} />
          ) : (
            <Loading />
          )}
        </figure>

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
            <li className="flex items-center space-x-2 mt-2" key={e}>
              <p className="mt-4 text-neutral-900 text-base font-bold">{e}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Recipe;
