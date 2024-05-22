import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";
import React, { useEffect, useRef } from "react";

export function BadgeIcon({ id, name, content, fail_content, img, achieved }) {
  const ref = useRef(null);
  useEffect(() => {
    import("@lottiefiles/lottie-player");
  });

  return (
    <AlertDialog>
      {/* 클릭 전 보이는 아이콘 영역 */}
      <AlertDialogTrigger asChild>
        <section className="transition ease-in-out w-[100px] h-[137px] flex-col justify-center items-center inline-flex active:scale-110">
          <figure className="w-[100px] h-[100px] p-[5px] justify-center items-center inline-flex">
            <Image
              src={img}
              alt={`Reward Picture ${id}`}
              className={`${achieved ? "" : "opacity-50 grayscale"}`}
              priority
            />
          </figure>
          <figcaption
            className={`self-stretch py-1  ${
              achieved ? "bg-indigo-50" : "bg-zinc-100"
            } rounded justify-center items-center gap-2.5 inline-flex`}
          >
            <p
              className={`text-center  ${
                achieved ? "text-sky-500" : "text-neutral-600"
              } text-xs font-bold leading-[21px]`}
            >
              {name}
            </p>
          </figcaption>
        </section>
      </AlertDialogTrigger>

      {/* 팝업 창 화면 */}
      <AlertDialogContent className="rounded-lg w-[90%] h-[90%]">
        <AlertDialogHeader>
          <AlertDialogTitle
            className={`${
              achieved ? "text-sky-500" : "text-neutral-600"
            } text-[32px] font-bold font-['Pretendard'] my-[20px]`}
          >
            {name}
          </AlertDialogTitle>
          <AlertDialogDescription>
            <Image
              src={img}
              alt="non"
              className={`w-[280] h-[280] ${
                achieved ? "animate-badge-bounce" : "opacity-50 grayscale"
              }`}
              priority
            />
            {achieved ? (
              <figure className="absolute top-10 -left-10">
                <lottie-player
                  id="firstLottie"
                  ref={ref}
                  autoplay
                  mode="normal"
                  src="https://lottie.host/a7ed2b2d-31ba-4865-9724-469a6df8ef08/lLmQca0xIf.json"
                  style={{ width: "500px", height: "500px" }}
                ></lottie-player>
              </figure>
            ) : (
              <></>
            )}
            <figcaption className="mt-[30px] text-center text-neutral-500 text-2xl text-wrap font-medium ">
              {achieved ? content : fail_content}
            </figcaption>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* 나가는 액션을 위한 나가기 버튼 */}
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-sky-500 hover:bg-sky-600">
            <p className="text-white font-semibold ">닫기</p>
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
