import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import arrowLeft from "@/public/arrowLeft.svg";
import search from "@/public/search.svg";

interface SearchBarProps {
  onChange: (value: string) => void;
  onSubmit: () => void;
  value: string;
}

const SearchBar = ({ onChange, onSubmit, value }: SearchBarProps) => {
  const router = useRouter();

  // const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   onChange(event);
  // };

  // const handleSearchSubmit = () => {
  //   onSearch(value);
  // };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      router.push("/refrigerator");
    }
  };

  return (
    <div className="flex items-center">
      <div onClick={handleGoBack}>
        <Image src={arrowLeft} alt="BackButton" className="mr-2" width={9} height={18} />
      </div>

      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="상품명을 입력해주세요."
          className="flex px-4 py-3 w-full justify-center items-center rounded-lg border border-1 border-gray-300 input-no-focus outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSubmit();
            }
          }}
        />
        <Image
          onClick={onSubmit}
          src={search}
          alt="Search"
          width={24}
          height={24}
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
        />
      </div>
    </div>
  );
};

export default SearchBar;
