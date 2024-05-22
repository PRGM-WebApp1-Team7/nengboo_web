import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/utils/supabase";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import arrowDown from "@/public/arrowDown.svg";

const SortBar = ({ onSortChange }) => {
  const [productsCount, setProductsCount] = useState(0);
  const [sortBy, setSortBy] = useState("유통기한 임박 순");
  const [sortedProducts, setSortedProducts] = useState([]);

  const fetchProductsCount = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (user && user.identities && user.identities[0].identity_data) {
        const { data: ref_id } = await supabase
          .from("refrigerators")
          .select("refrige_id")
          .eq("user_id", user.identities[0].identity_data.provider_id)
          .single();
        if (ref_id) {
          const { count } = await supabase
            .from("products")
            .select("product_id", { count: "exact" })
            .eq("refrige_id", ref_id.refrige_id);
          if (count !== null) {
            setProductsCount(count);
          }
        } else {
          console.error("냉장고 ID를 찾을 수 없습니다.");
        }
      } else {
        console.error("사용자 정보를 찾을 수 없습니다.");
      }
    } catch (error) {
      console.error("상품 개수 가져오기 에러:", error.message);
    }
  };
  useEffect(() => {
    fetchProductsCount();
  }, []);

  const handleSortChange = async (sortOption) => {
    setSortBy(sortOption);
    onSortChange(sortOption);
    const sortedProducts = await sortProducts(sortOption);
    setSortedProducts(sortedProducts);
  };

  const sortProducts = async (sortOption: string) => {
    try {
      let sortedProducts = [];

      if (sortOption === "등록 순") {
        sortedProducts = await supabase
          .from("products")
          .select("*")
          .order("product_id");
      } else if (sortOption === "이름 순") {
        sortedProducts = await supabase
          .from("products")
          .select("*")
          .order("product_name");
      } else if (sortOption === "유통기한 임박 순") {
        sortedProducts = await supabase
          .from("products")
          .select("*")
          .order("product_expiration_date");
      }

      return sortedProducts;
    } catch (error) {
      console.error("상품 정렬 에러:", error.message);
    }
  };

  return (
    <section className="flex flex-row justify-between mt-4 text-sm">
      <div>
        <p>
          상품{" "}
          <span className="font-medium text-personal-blue ">
            {productsCount}
          </span>
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center focus:outline-none">
          <div className="personal-blue ">{sortBy}</div>
          <Image src={arrowDown} alt="Arrow Down" width={24} height={24} />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => handleSortChange("유통기한 임박 순")}
            selected={sortBy === "유통기한 임박 순"}
          >
            유통기한 임박 순
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleSortChange("등록 순")}
            selected={sortBy === "등록 순"}
          >
            등록 순
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleSortChange("이름 순")}
            selected={sortBy === "이름 순"}
          >
            이름 순
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
};

export default SortBar;
