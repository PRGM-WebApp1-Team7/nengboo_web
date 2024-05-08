import React, { useState, ChangeEvent, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { json } from "stream/consumers";
import { useUserStore } from "@/store/user";
import { useToast } from "@/components/ui/use-toast";

import { getUserInfo, updateUser } from "@/utils/actions";
import { useRouter } from "next/router";
export default function ItemPost() {
  const [barcode, setBarcode] = useState("");
  const [itemNameValue, setItemNameValue] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [hashtag, setHashTag] = useState("");
  const [hashtagsArr, setHashtagsArr] = useState<string[]>([]);
  const [keeping, setKeeping] = useState("light");
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState<any>({});
  const { toast } = useToast();
  const router = useRouter();
  // const [date, setDate] = React.useState<Date | undefined>(new Date());

  const handleCancel = () => {
    setItemNameValue("");
  };

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    const RegNotNum = /[^0-9]/g;
    const onlyNum = value.replace(RegNotNum, ""); // 숫자가 아닌 경우 ''

    let DataFormat: any;
    let RegDateFmt: any;

    if (onlyNum.length <= 6) {
      // 000000 -> 0000-00
      DataFormat = "$1-$2";
      RegDateFmt = /([0-9]{4})([0-9]+)/;
    } else if (onlyNum.length <= 8) {
      // 00000000 -> 0000-00-00
      DataFormat = "$1-$2-$3";
      RegDateFmt = /([0-9]{4})([0-9]{2})([0-9]+)/;
    }

    const newDate = onlyNum.replace(RegDateFmt, DataFormat);

    setDateValue(newDate); // YYYY-MM-DD
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

    //서버에 데이터 전송
    await updateUser();
    const userData = await getUserInfo();

    const data = {
      barcode: barcode, // 공백 o
      product_name: itemNameValue, // x
      product_expiration_date: dateValue, // x
      product_quantity: quantity, // x
      product_type: hashtagsArr, // x
      product_frozen_storage: keeping, // x
      product_memo: memo, // o
      user_id: userData[0].user_id,
    };

    console.log(JSON.stringify(data));

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
        router.push("/itemPost");
      }

      // Handle success, e.g., show a success message or redirect to another page
    } catch (error) {
      console.error("Error:", error);
      // Handle error, e.g., show an error message to the user
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between px-6 mt-1">
        <Image
          src="/back.svg"
          width={9}
          height={18}
          alt="backImg"
          className="w-[9px] h-[18px] relative"
        />
        <h2 className="text-neutral-900 text-2xl font-bold">상품 등록</h2>
        <div></div>
      </div>
      <div className="px-6 pt-5">
        <div className="py-9 px-5 gap-4 flex items-center border-solid border border-border-color rounded-lg">
          <div>
            <Image
              src="/dummyImg.svg"
              width={100}
              height={100}
              alt="dummyImg"
            />
          </div>
          <div>
            <div className="flex items-center w-[228px] h-[30.12px] bg-white rounded-lg border border-zinc-300 mb-1.5 text-sm">
              <p className="pl-1">{barcode}</p>
            </div>

            <div className="flex w-[228px] h-[40.16px] bg-white rounded-lg border border-zinc-300 mb-2.5 text-sm">
              <Input
                className="w-[150px] h-auto shrink-0 pl-2.5 border-white focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
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
                  src="/cancel.svg"
                  width={24}
                  height={24}
                  alt="cancelImg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-4">
        <h2 className="text-neutral-700 text-sm font-normaltext-sm">
          상품 정보
        </h2>
      </div>
      <div className="px-6">
        <div className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300 px-2.5 py-2.5 mb-2.5">
          <Image src="/date.svg" width={24} height={24} alt="dateImg" />
          <Input
            className="w-auto shrink-0 border-none text-base pl-[15px] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            placeholder="2024"
            type="date"
            value={dateValue}
            onChange={handleDateChange}
          />
        </div>
        <div className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300 px-2.5 py-2.5 mb-2.5">
          <div className="flex items-center">
            <Image
              src="/quantity.svg"
              width={24}
              height={24}
              alt="quantityImg"
            />
            <p className="pl-1 text-base pl-[15px]">수량</p>
          </div>
          <div className="flex items-center justify-end flex-grow gap-2">
            <Image
              src="/minus.svg"
              width={24}
              height={24}
              alt="minusImg"
              onClick={handleDecrement}
            />
            <p>{quantity}</p>
            <Image
              src="/plus.svg"
              width={24}
              height={24}
              alt="plusImg"
              onClick={handleIncrement}
            />
          </div>
        </div>

        <div className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300 px-2.5 py-2.5 mb-2.5">
          <div className="flex items-center w-full ">
            <Image src="/tag.svg" width={24} height={24} alt="tagImg" />
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
        </div>

        <div className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300 px-2.5 py-2.5 mb-2.5">
          <div className="flex items-center">
            <Image src="/keep.svg" width={24} height={24} alt="keepImg" />
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
        </div>
        <div className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300  px-2.5 py-2.5">
          <Image src="/memo.svg" width={24} height={24} alt="memoImg" />
          <Input
            className="w-[330px] shrink-0 border-none text-base pl-[15px] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            placeholder="메모를 입력해주세요."
            type="text"
            value={memo}
            onChange={handleMemoChange}
          />
        </div>
      </div>
      <div className="flex items-center justify-center px-6 gap-2 pt-[52px]">
        <Button className="flex-grow bg-personal-gray text-btn-cancel-text h-14 text-base">
          <Link href="/itemDetail">취소</Link>
        </Button>
        <Button
          className="flex-grow bg-personal-blue h-14 text-base"
          onClick={handleSubmit}
        >
          등록
        </Button>
      </div>
    </div>
  );
}
