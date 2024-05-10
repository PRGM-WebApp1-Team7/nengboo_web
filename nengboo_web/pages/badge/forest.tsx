import Image from "next/image";
import { useState } from "react";
import forest_1 from "@/public/badge/forest_11.png";
import forest_2 from "@/public/badge/forest_22.png";
import forest_3 from "@/public/badge/forest_33.png";
import forest_4 from "@/public/badge/forest_44.png";
import forest_5 from "@/public/badge/forest_55.png";

const Forest = () => {
  const [exp, setExp] = useState(1000000);

  return (
    <div className="grid place-items-center">
      <div className="w-[350px] h-70px] mt-[20px]">
        <p className="font-bold text-[28px] text-sky-500">여러분의 XP를 모아</p>
        <p className="font-bold text-sky-500">숲을 완성시켜 주세요!</p>
      </div>
      <div className="bg-sky-100 w-[350px] h-[250px] my-[20px] relative rounded-lg">
        <Image
          src={forest_1}
          alt="Image_1"
          className={`absolute top-0 left-0 w-[350px] h-[250px] ${
            exp < 100 ? "grayscale" : ""
          }`}
        />
        <Image
          src={forest_2}
          alt="Image_2"
          className={`absolute top-0 left-0 w-[350px] h-[250px] ${
            exp < 1000 ? "grayscale" : ""
          }`}
        />
        <Image
          src={forest_3}
          alt="Image_3"
          className={`absolute top-0 left-0 w-[350px] h-[250px] ${
            exp < 10000 ? "grayscale" : ""
          }`}
        />
        <Image
          src={forest_4}
          alt="Image_3"
          className={`absolute top-0 left-0 w-[350px] h-[250px] ${
            exp < 100000 ? "grayscale" : ""
          }`}
        />
        <Image
          src={forest_5}
          alt="Image_3"
          className={`absolute top-0 left-0 w-[350px] h-[250px] ${
            exp < 1000000 ? "grayscale" : ""
          }`}
        />
      </div>
      <div className="w-[350px] h-[100px] mb-[20px] rounded-lg shadow-xl p-[10px]">
        <div className="bg-sky-500 rounded-lg w-[120px] grid justify-items-center">
          <p className="text-white text-[16px] p-[5px]">숲을 만드려면?</p>
        </div>
        <p className="text-[14px] m-[5px]">
          {exp >= 1000000
            ? "여러분의 노력으로 울창한 숲을 만들었어요!"
            : `숲을 만들기 위해 ${
                1000000 - exp
              }만큼의 XP가 더 필요합니다. 열심히 활동해 XP를 모아보세요!`}
        </p>
      </div>
      <div className="bg-sky-50 w-[350px] p-[15px] rounded-lg shadow-xl">
        <p className="font-bold text-[28px] mb-[5px]">얼마나 아꼈나면요....</p>
        <div className="m-[5px]">
          <p className="text-[12px] mb-[5px]">{`현재 모여있는 XP: ${exp}`}</p>
          <ul>
            <li className={`${exp < 10 ? "" : "hidden"}`}>
              경험치를 쌓아 우리가 무엇을 이루었는지 확인해보세요
            </li>
            <li>할 수 있는 목록</li>
            <li className={`${exp >= 100 ? "" : "hidden"}`}>할 수 있는 목록</li>
            <li className={`${exp >= 1000 ? "" : "hidden"}`}>
              할 수 있는 목록
            </li>
            <li className={`${exp >= 10000 ? "" : "hidden"}`}>
              할 수 있는 목록
            </li>
            <li className={`${exp >= 100000 ? "" : "hidden"}`}>
              할 수 있는 목록
            </li>
            <li className={`${exp >= 1000000 ? "" : "hidden"}`}>
              할 수 있는 목록
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Forest;
