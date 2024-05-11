import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import arrowLeft from "@/public/arrowLeft.svg";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const detail = () => {
  return (
    <main className="mx-6">
      <Header />
      <div className="flex items-center justify-center">
        <img
          className="w-[334px] h-[334px]"
          src="https://via.placeholder.com/334x334"
        />
      </div>

      <p className="mt-6 text-neutral-900 text-2xl font-bold">레시피 이름</p>
      <p className="mt-14 text-zinc-800 text-base font-medium">레시피 설명</p>

      <SubHeader title={"재료"} />
      <div className="flex items-center space-x-2">
        <Checkbox id="terms1" />
        <label
          htmlFor="terms1"
          className="text-neutral-500 text-base font-medium "
        >
          재료 이름
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms2" />
        <label
          htmlFor="terms2"
          className="text-neutral-500 text-base font-medium "
        >
          재료 이름 2
        </label>
      </div>

      <SubHeader title={"영양소"} />
      <div className="flex items-center justify-center">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>열량</TableHead>
              <TableHead>탄수화물</TableHead>
              <TableHead>단백질</TableHead>
              <TableHead>지방</TableHead>
              <TableHead>나트륨</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>123</TableCell>
              <TableCell>45.6</TableCell>

              <TableCell>78</TableCell>
              <TableCell>9</TableCell>
              <TableCell>10.1</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <SubHeader title={"조리법"} />
      <div className="flex items-center space-x-2">
        <Checkbox id="terms1" />
        <label
          htmlFor="terms1"
          className="text-neutral-500 text-base font-medium "
        >
          조리법 1
        </label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms2" />
        <label
          htmlFor="terms2"
          className="text-neutral-500 text-base font-medium "
        >
          조리법 2
        </label>
      </div>
    </main>
  );
};

const Header = () => {
  const router = useRouter();

  return (
    <div className="flex mt-16 mb-14">
      <Image
        src={arrowLeft}
        alt="BackButton"
        className="mr-2"
        width={9}
        height={18}
        onClick={() => router.back()}
      />
      <div className="relative grow justify-center">
        <div className="text-neutral-900 text-2xl font-bold text-center">
          레시피
        </div>
      </div>
    </div>
  );
};

const SubHeader = (title: { title: string }) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="w-[140px] h-9 p-2 bg-neutral-100 rounded-[100px] justify-center items-center gap-2.5 inline-flex mt-32">
        <div className="w-[113px] h-[22px] justify-center items-center flex">
          <p className="w-[113px] h-[22px] text-center text-neutral-800 text-xl font-medium ">
            {title.title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default detail;
