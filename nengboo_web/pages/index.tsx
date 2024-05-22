import Image from "next/image";
import { kakaoLogin } from "@/utils/actions";

export default function Home() {
  return (
    <main className="relative mx-auto h-[100dvh] w-full max-w-[430px] overflow-y-hidden bg-[#ffffff] ">
      <section className=" mt-96 items-center justify-center ">
        <figure className="flex items-center justify-center">
          <div>
            <Image
              src="/logoTop.svg"
              width={47}
              height={26}
              className="mb-1"
              alt="logo Image"
            />
            <Image
              src="/logoBottom.svg"
              width={47}
              height={35}
              alt="logo Image"
            />
          </div>
        </figure>

        <header className="flex items-center justify-center mb-16">
          <p className="w-[90px] h-10 text-blue-500 text-[32px] font-medium  text-center">
            냉부해
          </p>
        </header>

        <section>
          <div className="flex items-center justify-center mb-10">
            <p className="w-[120px] h-4 text-neutral-400 text-base font-normal font-['Apple Braille']">
              SNS 간편 로그인
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Image
              src="/kakaoLoginImage.svg"
              width={190}
              height={40}
              onClick={kakaoLogin}
              alt="kakao Image"
            />
          </div>
        </section>
      </section>
    </main>
  );
}
