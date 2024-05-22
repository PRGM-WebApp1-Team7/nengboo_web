import Image from "next/image";
import forest_1 from "@/public/badge/forest_11.png";
import forest_2 from "@/public/badge/forest_22.png";
import forest_3 from "@/public/badge/forest_33.png";
import forest_4 from "@/public/badge/forest_44.png";
import forest_5 from "@/public/badge/forest_55.png";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";

const Forest = () => {
  const [exp, setExp] = useState(0);

  useEffect(() => {
    const getTotalExp = async () => {
      const { data: user, error } = await supabase
        .from("users")
        .select("user_xp");

      let totalExp = 0;
      const countExp = user?.map((xp) => {
        totalExp += xp.user_xp;
        setExp(totalExp);
      });
    };
    getTotalExp();
  }, []);

  return (
    <main className="relative mx-auto h-[130dvh] w-full max-w-[430px] overflow-y-hidden bg-[#ffffff]">
      <section className="grid place-items-center">
        <header className="w-[350px] h-70px] mt-10">
          <p className="font-bold text-[28px] text-sky-500 text-center">
            여러분의 XP를 모아
          </p>
          <p className="font-bold text-sky-500 text-center">
            숲을 완성시켜 주세요!
          </p>
        </header>
        <article className="bg-sky-100 w-[350px] h-[250px] my-[20px] relative rounded-lg">
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
        </article>
        <article className="w-[350px] h-[130px] mb-[20px] rounded-lg shadow-xl p-[10px]">
          <header className="bg-sky-500 rounded-lg w-[120px] grid justify-items-center">
            <p className="text-white text-[16px] p-[5px]">숲을 만드려면?</p>
          </header>
          <p className="text-[14px] ml-[5px] mt-4">
            {exp >= 1000000
              ? "여러분의 노력으로 울창한 숲을 만들었어요!"
              : `숲을 만들기 위해 ${
                  1000000 - exp
                }만큼의 XP가 더 필요합니다. 열심히 활동해 XP를 모아보세요!`}
          </p>
        </article>
        <section className="bg-sky-50 w-[350px] p-[15px] rounded-lg shadow-xl">
          <header className="font-bold text-[28px] mb-[15px] text-center">
            무엇을 할 수 있냐면요....
          </header>
          <article className="m-[5px]">
            <p className="text-[12px] mb-[30px] text-center">{`현재 모여있는 XP: ${exp}`}</p>
            <ul>
              <li className={`mt-4 ${exp < 100 ? "" : "hidden"}`}>
                경험치를 쌓아 우리가 무엇을 할 수 있는지 확인해보세요
              </li>
              <li className={`mt-4 ${exp >= 100 ? "" : "hidden"}`}>
                식목일 심을 묘목을 구할 수 있어요!
              </li>
              <li className={`mt-4 ${exp >= 1000 ? "" : "hidden"}`}>
                해변의 쓰레기를 치울 도구도 구할 수 있구요.
              </li>
              <li className={`mt-4 ${exp >= 10000 ? "" : "hidden"}`}>
                태양광 압축 쓰레기통도 만들었네요.
              </li>
              <li className={`mt-4 ${exp >= 100000 ? "" : "hidden"}`}>
                생태 보호를 위한 프로젝트도 할 수 있군요?
              </li>
              <li className={`mt-4 ${exp >= 1000000 ? "" : "hidden"}`}>
                철새도래지의 쉼터까지 만들었어요!
              </li>
            </ul>
          </article>
        </section>
      </section>
    </main>
  );
};

export default Forest;
