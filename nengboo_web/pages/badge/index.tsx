import React, { useEffect, useState } from "react";
import { BadgeData } from "@/utils/badgeData";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchUserInfo } from "@/utils/actions";
import { BadgeIcon } from "@/components/badge/badgeIcon";
import { useRouter } from "next/router";

const Badge = () => {
  const [isAcheived, setIsacheived] = useState({});
  const router = useRouter();
  useEffect(() => {
    if (!router.query) return;
    const getAcheiveData = async () => {
      const data = await fetchUserInfo(router.query.user_id);

      if (data && Array.isArray(data) && data.length > 0) {
        setIsacheived({
          attend: data[0].badge_attendance,
          expday: data[0].badge_expiration_day,
          meat: data[0].badge_meat,
          vege: data[0].badge_vegetable,
          fish: data[0].badge_fish,
          milk: data[0].badge_milk,
          refri: data[0].badge_refrigerator,
          recipe: data[0].badge_recipe,
        });
      }
    };
    getAcheiveData();
  }, [router]);

  const achieveArray = Object.values(isAcheived);

  return (
    <main className="relative mx-auto h-[100dvh] w-full max-w-[430px] overflow-y-hidden bg-[#ffffff]">
      <article className="w-[100%] h-[600px] bg-white grid grid-cols-3 justify-items-center mt-10">
        {BadgeData.map((data, index) => (
          <BadgeIcon
            key={index}
            id={data.id}
            name={data.name}
            content={data.content}
            fail_content={data.fail_content}
            img={data.image}
            achieved={achieveArray[index]}
          />
        ))}
      </article>
      <section className="w-[100%] h-[50px] grid place-items-center">
        <Link href={"/badge/forest"} className="w-[70%]">
          <Button className="w-[100%] bg-sky-500 hover:bg-sky-600">
            나무 보러가기
          </Button>
        </Link>
      </section>
    </main>
  );
};

export default Badge;
