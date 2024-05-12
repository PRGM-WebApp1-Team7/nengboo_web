import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import arrowLeft from "@/public/arrowLeft.svg";
import search from "@/public/search.svg";
import { getGPTRecipe } from "@/utils/actions";

const index = () => {
  const [recipe, setRecipe] = useState<string>();

  useEffect(() => {
    const init = async () => {
      const data = await getGPTRecipe();
      setRecipe(data);
    };
    init();
  }, []);

  const check = () => {
    const init = async () => {
      const data = await getGPTRecipe();
      setRecipe(data);
    };
    init();
    console.log(recipe);
  };
  const check1 = () => {
    console.log(recipe);
  };
  return (
    <main>
      <SearchBar />
      <div className="flex justify-around ">
        <div className="w-[181px] h-[166px] relative bg-white rounded-[15px] shadow border border-black ">
          <div className="left-0 top-0 absolute bg-stone-300 rounded-[15px] justify-end items-center inline-flex">
            <img
              className="w-[180px] h-[107px] rounded-[15px]"
              src="https://via.placeholder.com/180x107"
            />
          </div>
          <div className="w-[122px] h-[13px] left-[6px] top-[112px] absolute text-black text-sm font-medium">
            레시피 이름
          </div>
          <div className="w-[169px] h-[13px] left-[6px] top-[130px] absolute text-zinc-800 text-xs font-extralight">
            레시피 재료
          </div>
          <div className="w-[73px] h-[13px] left-[104px] top-[148px] absolute text-neutral-400 text-xs font-light">
            200kcal/svg
          </div>
        </div>

        <div className="w-[181px] h-[166px] relative bg-white rounded-[15px] shadow border border-black">
          <div className="left-0 top-0 absolute bg-stone-300 rounded-[15px] justify-end items-center inline-flex">
            <img
              className="w-[180px] h-[107px] rounded-[15px]"
              src="https://via.placeholder.com/180x107"
            />
          </div>
          <div className="w-[122px] h-[13px] left-[6px] top-[112px] absolute text-black text-sm font-medium">
            레시피 이름
          </div>
          <div className="w-[169px] h-[13px] left-[6px] top-[130px] absolute text-zinc-800 text-xs font-extralight">
            레시피 재료
          </div>
          <div className="w-[73px] h-[13px] left-[104px] top-[148px] absolute text-neutral-400 text-xs font-light">
            200kcal/svg
          </div>
        </div>
      </div>
      <div>
        <button onClick={check}>console</button>
      </div>
      <div>
        <button onClick={check1}>console1</button>
      </div>
    </main>
  );
};

const SearchBar = () => {
  const router = useRouter();
  return (
    <div className="flex items-center mt-14 mb-8">
      <Image
        src={arrowLeft}
        alt="BackButton"
        className="mr-2"
        width={9}
        height={18}
        onClick={() => router.back()}
      />
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="레시피를 입력해주세요"
          className="flex px-4 py-3 w-full justify-center items-center rounded-lg border border-1 border-gray-400 input-no-focus"
          style={{
            outline: "none",
          }}
          // value={value}
          // onChange={onChange}
        />
        <Image
          // onClick={onSearch}
          src={search}
          alt="Search"
          width={24}
          height={24}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        />
      </div>
    </div>
  );
};
export default index;
