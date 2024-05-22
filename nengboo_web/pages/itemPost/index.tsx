import React, { useState, ChangeEvent, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { fetchUserInfo, updateUser } from "@/utils/actions";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabase";

export default function ItemPost() {
  const [barcode, setBarcode] = useState("");
  const [itemNameValue, setItemNameValue] = useState("");
  const [cookable, setCookable] = useState("ingredients");
  const [dateValue, setDateValue] = React.useState<Date | undefined>(
    new Date()
  );
  const [quantity, setQuantity] = useState(1);
  const [hashtag, setHashTag] = useState("");
  const [hashtagsArr, setHashtagsArr] = useState<string[]>([]);
  const [keeping, setKeeping] = useState("coldStorage");
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState<any>({});
  const { toast } = useToast();
  const router = useRouter();

  const handleCancel = () => {
    setItemNameValue("");
  };

  const handleCookableChange = (e) => {
    setCookable(e.target.value);
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const onChangeHashtag = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHashTag(e.target.value);
  };

  const onKeyUp = useCallback(
    (e: { keyCode: number }) => {
      if (e.keyCode === 13 && hashtag.trim() !== "") {
        setHashtagsArr((prevHashtags) => [...prevHashtags, hashtag]);
        setHashTag("");
      }
    },
    [hashtag]
  );

  const removeHashtag = (indexToRemove: number) => {
    setHashtagsArr((prevHashtags) =>
      prevHashtags.filter((_, index) => index !== indexToRemove)
    );
  };
  const handleSelectChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    // 선택된 값으로 keeping 상태를 업데이트합니다.
    setKeeping(e.target.value);
  };

  const handleMemoChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMemo(event.target.value);
  };

  const handleBackClick = () => {
    router.push("/refrigerator");
  };

  const handleSubmit = async () => {
    if (!itemNameValue || itemNameValue.trim() === "") {
      errors.product_name = "상품명을 입력하세요.";
      toast({
        className: "bg-zinc-100",
        description: "상품명을 입력하세요.",
      });
      return;
    }

    if (!dateValue) {
      errors.product_expiration_date = "날짜를 선택하세요.";
      toast({
        className: "bg-zinc-100",
        description: "날짜를 선택하세요.",
      });
      return;
    }

    if (!quantity) {
      errors.product_quantity = "수량을 입력하세요.";
      toast({
        className: "bg-zinc-100",
        description: "수량을 입력하세요.",
      });
      return;
    }

    if (hashtagsArr.length === 0) {
      errors.product_type = "태그를 입력하세요.";
      toast({
        className: "bg-zinc-100",
        description: "태그를 입력하세요.",
      });
      return;
    }

    if (!keeping) {
      errors.product_frozen_storage = "보관 방법을 선택하세요.";
      toast({
        className: "bg-zinc-100",
        description: "보관 방법을 선택하세요.",
      });
      return;
    }

    if (!cookable) {
      errors.product_frozen_storage = "상품 카테고리를 선택하세요.";
      toast({
        className: "bg-zinc-100",
        description: "상품 카테고리를 선택하세요.",
      });
      return;
    }

    //서버에 데이터 전송
    await updateUser();
    const userData = await fetchUserInfo(router.query.user_id);

    console.log("test : ", router.query.user_id);
    console.log("userData :", userData);
    const data = {
      barcode: barcode,
      product_name: itemNameValue,
      product_cookable: cookable,
      product_expiration_date: format(
        new Date(dateValue),
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
      product_quantity: quantity,
      product_type: hashtagsArr,
      product_frozen_storage: keeping,
      product_memo: memo,
      user_id: userData.user_id,
    };

    //배지 조건 업데이트
    if (userData.badge_vegetable === false && hashtagsArr.includes("채소")) {
      const { data, error } = await supabase
        .from("users")
        .update({ badge_vegetable: true })
        .eq("user_id", userData.user_id);
    } else {
      console.log("badge update fail");
    }

    console.log(JSON.stringify(data));
    if (userData.badge_meat === false && hashtagsArr.includes("고기")) {
      const { data, error } = await supabase
        .from("users")
        .update({ badge_meat: true })
        .eq("user_id", userData.user_id);
    } else {
      console.log("badge update fail");
    }

    if (userData.badge_fish === false && hashtagsArr.includes("생선")) {
      const { data, error } = await supabase
        .from("users")
        .update({ badge_fish: true })
        .eq("user_id", userData.user_id);
    } else {
      console.log("badge update fail");
    }

    if (userData.badge_milk === false && hashtagsArr.includes("유제품")) {
      const { data, error } = await supabase
        .from("users")
        .update({ badge_milk: true })
        .eq("user_id", userData.user_id);
    } else {
      console.log("badge update fail");
    }

    try {
      const response = await fetch("/api/itemPost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to send data to server");
      } else {
        router.push("/refrigerator");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <main className="relative mx-auto h-[100dvh] w-full max-w-[430px] overflow-y-hidden bg-[#ffffff]">
      <header className="flex mx-6 mt-16 mb-14 items-center">
        <div className="cursor-pointer" onClick={handleBackClick}>
          <Image
            src="/refIcon/back.svg"
            width={9}
            height={18}
            alt="backImg"
            className="w-[9px] h-[18px] relative"
          />
        </div>
        <div className="relative grow justify-center">
          <div className="text-neutral-900 text-2xl font-bold text-center">
            상품 등록
          </div>
        </div>
      </header>

      <section className="px-6 pt-5">
        <div className="py-9 px-5 gap-4 flex items-center border-solid border border-border-color rounded-lg">
          <figure>
            <Image
              src="https://whrmaertzkkanlgksexz.supabase.co/storage/v1/object/public/images/emotion2.png"
              width={100}
              height={100}
              alt="dummyImg"
            />
          </figure>
          <div>
            <div className="flex w-[228px] h-[40.16px] bg-white rounded-lg border border-zinc-300 mb-2.5 text-sm">
              <Input
                className="w-[190px] h-auto shrink-0 pl-2.5 border-white focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                placeholder="상품명을 입력해주세요."
                type="text"
                value={itemNameValue}
                onChange={(e) => setItemNameValue(e.target.value)}
                required
              />
              <div
                className="flex items-center justify-end flex-grow pr-2"
                onClick={handleCancel}
              >
                <Image
                  src="/refIcon/cancel.svg"
                  width={24}
                  height={24}
                  alt="cancelImg"
                  className="cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-6 py-4">
        <h2 className="text-neutral-700 text-sm font-normaltext-sm">
          상품 정보
        </h2>
      </div>

      <ul className="px-6">
        <li className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300 px-2.5 py-2.5 mb-2.5">
          <Image src="/refIcon/date.svg" width={24} height={24} alt="dateImg" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal border-none",
                  !dateValue && "text-muted-foreground"
                )}
              >
                {dateValue ? (
                  format(dateValue, "yyyy-MM-dd")
                ) : (
                  <span>날짜를 선택하세요.</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dateValue}
                onSelect={setDateValue}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </li>

        <li className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300 px-2.5 py-2.5 mb-2.5">
          <div className="flex items-center">
            <Image
              src="/refIcon/quantity.svg"
              width={24}
              height={24}
              alt="quantityImg"
            />
            <p className="pl-1 text-base pl-[15px]">수량</p>
          </div>
          <div className="flex items-center justify-end flex-grow gap-2">
            <Image
              src="/refIcon/minus.svg"
              width={24}
              height={24}
              alt="minusImg"
              onClick={handleDecrement}
              className="cursor-pointer"
            />
            <p>{quantity}</p>
            <Image
              src="/refIcon/plus.svg"
              width={24}
              height={24}
              alt="plusImg"
              onClick={handleIncrement}
              className="cursor-pointer"
            />
          </div>
        </li>

        <li className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300 px-2.5 py-2.5 mb-2.5">
          <div className="flex items-center w-full ">
            <Image src="/refIcon/tag.svg" width={24} height={24} alt="tagImg" />
            {hashtagsArr.map((tag, index) => (
              <div
                key={index}
                className=" flex items-center justify-center w-auto h-[30px] px-3 bg-personal-blue rounded-[15px] cursor-pointer text-white text-base font-normal whitespace-normal mr-2"
                onClick={() => removeHashtag(index)}
              >
                {tag}
              </div>
            ))}
            <Input
              className="flex-grow w-0 border-none text-base focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
              type="text"
              value={hashtag}
              onChange={onChangeHashtag}
              onKeyUp={onKeyUp}
              placeholder="해시태그 입력"
            />
          </div>
        </li>

        <li className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300 px-2.5 py-2.5 mb-2.5">
          <div className="flex items-center">
            <Image
              src="/refIcon/keep.svg"
              width={24}
              height={24}
              alt="keepImg"
            />
            <p className="text-base pl-[15px]">보관 방법</p>
          </div>
          <div className="flex items-center justify-end flex-grow">
            <select
              onChange={handleSelectChange}
              value={keeping}
              className="w-[112px] h-[37px] border-none text-xs"
            >
              <option value="coldStorage">냉장 보관</option>
              <option value="frozenStorage">냉동 보관</option>
              <option value="roomTemperatureStorage">실온 보관</option>
            </select>
          </div>
        </li>

        <li className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300  px-2.5 py-2.5 mb-2.5">
          <Image src="/refIcon/memo.svg" width={24} height={24} alt="memoImg" />
          <Input
            className="w-[330px] shrink-0 border-none text-base pl-[15px] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            placeholder="메모를 입력해주세요."
            type="text"
            value={memo}
            onChange={handleMemoChange}
          />
        </li>

        <li className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300 px-2.5 py-2.5 ">
          <div className="flex items-center">
            <Image
              src="/refIcon/category.svg"
              width={24}
              height={24}
              alt="keepImg"
            />
            <p className="text-base pl-[15px]">상품 카테고리</p>
          </div>
          <div className="flex items-center justify-end flex-grow">
            <select
              onChange={handleCookableChange}
              value={cookable}
              className="w-[112px] h-[37px] border-none text-xs focus-visible:ring-0"
            >
              <option value="ingredients">식재료</option>
              <option value="finished">완제품</option>
            </select>
          </div>
        </li>
      </ul>

      <section className="flex items-center justify-center px-6 gap-2 pt-[52px]">
        <Button className="flex-grow bg-personal-gray text-btn-cancel-text h-14 text-base">
          <Link href="/refrigerator">취소</Link>
        </Button>
        <Button
          className="flex-grow bg-personal-blue h-14 text-base"
          onClick={handleSubmit}
        >
          등록
        </Button>
      </section>
    </main>
  );
}
