import React, { useState, ChangeEvent, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import Link from "next/link";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserStore } from "@/store/user";
import { supabase } from "@/utils/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ItemDetail() {
  const [product, setProduct] = useState(null);
  const [barcode, setBarcode] = useState("");
  const [createdDate, setCreatedDate] = useState("");
  const [itemNameValue, setItemNameValue] = useState("");
  const [dateValue, setDateValue] = React.useState<Date | undefined>(
    new Date()
  );
  const [quantity, setQuantity] = useState(1);
  const [hashtag, setHashTag] = useState("");
  const [hashtagsArr, setHashtagsArr] = useState<string[]>([]);
  const [keeping, setKeeping] = useState("");
  const [memo, setMemo] = useState("");
  const [errors, setErrors] = useState<any>({});
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const { product_id } = router.query;
  console.log(product_id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Supabase에서 데이터 조회
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("product_id", product_id)
          .single();
        // console.log("data.product_name : ", data.product_name);
        const findCreatedDate = new Date(data.product_created_date);
        const formattedDate = `${findCreatedDate.getFullYear()}-${(
          findCreatedDate.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${findCreatedDate
          .getDate()
          .toString()
          .padStart(2, "0")}`;

        setCreatedDate(formattedDate);
        setItemNameValue(data.product_name);
        setDateValue(data.product_expiration_date);
        setQuantity(data.product_quantity);
        // setHashTag(data.product_type);
        // 해시태그를 구분하여 배열로 저장
        if (data.product_type) {
          const hashtags = data.product_type.split(","); // '테스트1,테스트2' -> ["테스트1", "테스트2"]
          setHashtagsArr(hashtags);
        }
        setKeeping(data.product_frozen_storage);
        setMemo(data.product_memo);

        if (error) {
          throw error;
        }

        setProduct(data); // 조회된 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching product:", error.message);
      }
    };

    if (product_id) {
      fetchProduct(); // product_id가 있을 때만 데이터 조회
    }
  }, [product_id]);

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
  const handleSelectChange = (e) => {
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

    const data = {
      // barcode: barcode,
      product_name: itemNameValue,
      product_expiration_date: format(
        new Date(dateValue),
        "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"
      ),
      product_quantity: quantity,
      product_type: hashtagsArr.join(","),
      product_frozen_storage: keeping,
      product_memo: memo,
      product_updated_date: new Date().toISOString(),
    };
    console.log(JSON.stringify(data));

    try {
      const { error } = await supabase
        .from("products")
        .update(data)
        .eq("product_id", product_id);

      if (error) {
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

  const handleBackClick = () => {
    router.push("/itemPost");
  };

  const handleTrashClick = () => {
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("product_id", product_id);

      if (error) {
        throw new Error("Failed to send data to server");
      } else {
        setShowModal(false);
        router.push("/itemPost");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between px-6 mt-1">
        <div className=" cursor-pointer" onClick={handleBackClick}>
          <Image src="/back.svg" width={9} height={18} alt="backImg" />
        </div>
        <h2 className="text-neutral-900 text-2xl font-bold">상품 상세정보</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div onClick={handleTrashClick} className="cursor-pointer">
              <Image src="/delete.svg" width={34} height={34} alt="deleteImg" />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>상품을 삭제하시겠습니까?</AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={handleCancel}
                className="bg-personal-gray"
              >
                취소
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-personal-blue"
              >
                삭제
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="pt-[15px] pb-[10px] px-6">
        <p className="text-zinc-800 text-xs font-normal">{createdDate}</p>
      </div>
      <div className="flex items-center justify-center">
        <Image src="/dummyImg.svg" width={130} height={135} alt="dummyImg" />
      </div>
      <div className="px-6 pt-[39px]">
        <div className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300 px-2.5 py-2.5 mb-2.5">
          <Image src="/itemName.svg" width={24} height={24} alt="itemNameImg" />
          <Input
            className="w-auto shrink-0 border-none text-base pl-[15px] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            type="text"
            placeholder="햇감자"
            value={itemNameValue}
            onChange={(e) => setItemNameValue(e.target.value)}
          />
        </div>
        <div className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300 px-2.5 py-2.5 mb-2.5">
          <Image src="/date.svg" width={24} height={24} alt="dateImg" />
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
                  format(dateValue, "PPP")
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
              className="cursor-pointer"
            />
            <p>{quantity}</p>
            <Image
              src="/plus.svg"
              width={24}
              height={24}
              alt="plusImg"
              onClick={handleIncrement}
              className="cursor-pointer"
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
              className="w-[112px] h-[37px] border-none text-xs focus-visible:ring-0"
            >
              <option value="coldStorage">냉장 보관</option>
              <option value="frozenStorage">냉동 보관</option>
              <option value="roomTemperatureStorage">실온 보관</option>
            </select>
          </div>
        </div>
        <div className="flex w-full h-[52px] max-w-sm items-center rounded-lg border border-zinc-300 px-2.5 py-2.5 mb-2.5">
          <Image src="/memo.svg" width={24} height={24} alt="memoImg" />
          <Input
            className="w-auto shrink-0 border-none text-base pl-[15px] focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
            placeholder="메모를 입력해주세요."
            type="text"
            value={memo}
            onChange={handleMemoChange}
          />
        </div>
      </div>
      <div className="flex items-center justify-center px-6 gap-2 pt-[52px]">
        <Button className="flex-grow bg-personal-gray text-btn-cancel-text h-14 text-base">
          <Link href="/itemPost">취소</Link>
        </Button>
        <Button
          className="flex-grow bg-personal-blue h-14 text-base"
          onClick={handleSubmit}
        >
          저장
        </Button>
      </div>
    </div>
  );
}
