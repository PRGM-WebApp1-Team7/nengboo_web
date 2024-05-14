import React, { useEffect, useState } from "react";
import { BadgeData } from "@/utils/badgeData";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUserInfo } from "@/utils/actions";
import { BadgeIcon } from "@/components/badge/badgeIcon";

const Badge = () => {
  const [isAcheived, setIsacheived] = useState({});

  useEffect(() => {
    const getAcheiveData = async () => {
      const data = await getUserInfo();
      if (data) {
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
  }, []);

  const achieveArray = Object.values(isAcheived);

  return (
    <div>
      <div className="w-[428px] h-[600px] bg-white grid grid-cols-3 justify-items-center">
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
      </div>
      <div className="w-[100%] h-[50px] grid place-items-center">
        <Link href={"/badge/forest"} className="w-[70%]">
          <Button className="w-[100%] bg-sky-500 hover:bg-sky-600">
            나무 보러가기
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Badge;
