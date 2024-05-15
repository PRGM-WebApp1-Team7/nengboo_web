import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { supabase } from "@/utils/supabase";
import calculateDday from "@/utils/calcDday";
import SearchBar from "@/components/ui/SearchBar";
import SortBar from "@/components/ui/sortBar";
import useDebounce from "@/hooks/useDebouce";

const ItemSearch = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("유통기한 임박 순");
  const debouncedSearchTerm = useDebounce(searchTerm, 100);
  const router = useRouter();

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleSearchSubmit(debouncedSearchTerm);
    } else {
      setFilteredData([]);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    setSearchTerm(router.query.searchTerm);
  }, [router.query]);
  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = async (searchTerm: string) => {
    try {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .filter("product_name", "ilike", `%${searchTerm}%`);

      if (error) {
        throw error;
      } else {
        setFilteredData(products || []);
      }
    } catch (error) {
      console.error("검색어 불러오는 중 에러: ", error.message);
    }
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    setFilteredData(sortProducts(filteredData, sortOption));
  };

  const sortProducts = (data, sortBy) => {
    let sortedData = [...data];
    if (sortBy === "등록 순") {
      sortedData.sort((a, b) => a.product_id - b.product_id);
    } else if (sortBy === "이름 순") {
      sortedData.sort((a, b) => a.product_name.localeCompare(b.product_name));
    } else if (sortBy === "유통기한 임박 순") {
      sortedData.sort((a, b) => {
        const dDayA = calculateDday(a.product_expiration_date);
        const dDayB = calculateDday(b.product_expiration_date);
        return dDayA.localeCompare(dDayB);
      });
    }
    return sortedData;
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen overflow-y-auto scrollbar-hidden">
      <SearchBar
        value={searchTerm}
        onChange={handleSearch}
        onSubmit={() => handleSearchSubmit(searchTerm)}
      />
      <SortBar onSortChange={handleSortChange} />
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 mt-8 ">
          {filteredData.map((product) => (
            <div
              key={product.product_id}
              className="rounded-lg p-6 flex flex-row  justify-between items-center border border-gray-300"
              onClick={() => router.push(`/itemDetail?${product.product_id}`)}
            >
              <div className="relative items-center w-20 h-20 mr-4">
                <Image
                  src={product.image_url}
                  layout="fill"
                  alt={product.product_name}
                  className="rounded-t-lg"
                  width={75}
                  height={75}
                />
              </div>
              <div className="flex flex-row justify-between w-full">
                <div className="flex flex-col justify-between">
                  <p className="text-ml font-semibold mb-2">{product.product_name}</p>
                  {product.product_expiration_date && (
                    <p className="text-gray-500">{product.product_expiration_date} 까지</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">{product.product_memo}</p>
                </div>

                <div className="text-ml flex flex-col justify-between items-end">
                  <button className="flex mb-10">
                    <Image src="/refIcon/delete.svg" alt="Delete Icon" width={25} height={25} />
                  </button>
                  {calculateDday(product.product_expiration_date) && (
                    <p
                      className={`${
                        (calculateDday(product.product_expiration_date).includes("D-") &&
                          parseInt(calculateDday(product.product_expiration_date).substring(2)) <=
                            7) ||
                        calculateDday(product.product_expiration_date).includes("D+")
                          ? "text-red-500"
                          : ""
                      }`}
                    >
                      {product.product_expiration_date ? (
                        calculateDday(product.product_expiration_date)
                      ) : (
                        <span className="text-black">N/A</span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col text-center text-black">
          <p className="mb-4 text-gray-400 text-left">검색 결과</p>
          <p className="text-left">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default ItemSearch;
