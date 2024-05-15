import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { getProductList } from "@/utils/actions";
import { supabase } from "@/utils/supabase";
import calculateDday from "@/utils/calcDday";
import SearchBar from "@/components/ui/SearchBar";
import SortBar from "@/components/ui/sortBar";
import useDebounce from "@/hooks/useDebouce";
import coldImg from "@/public/cold.svg";

const Refrigerator = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortBy, setSortBy] = useState("유통기한 임박 순");
  const router = useRouter();

  const debouncedSearchTerm = useDebounce(searchTerm, 100);
  const memoizedProducts = useMemo(() => products, [products]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const refrigeId = await getProductList();
        if (refrigeId) {
          const { data: products, error } = await supabase
            .from("products")
            .select("*")
            .eq("refrige_id", refrigeId);
          if (error) throw error;
          setProducts(products);
        }
      } catch (error) {
        console.error("물품 검색 에러: ", error.message);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = memoizedProducts.filter((product) =>
      product.product_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const sortedProducts = sortProducts(filtered, sortBy);
    setFilteredProducts(sortedProducts);
  }, [debouncedSearchTerm, memoizedProducts, sortBy]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleSearchSubmit = async () => {
    router.push(`/itemSearch?searchTerm=${encodeURIComponent(searchTerm)}`);
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
  };

  const sortProducts = (products, sortBy) => {
    let sortedProducts = [...products];
    if (sortBy === "등록 순") {
      sortedProducts.sort((a, b) => a.product_id - b.product_id);
    } else if (sortBy === "이름 순") {
      sortedProducts.sort((a, b) => a.product_name.localeCompare(b.product_name));
    } else if (sortBy === "유통기한 임박 순") {
      sortedProducts.sort((a, b) => {
        const dDayA = calculateDday(a.product_expiration_date);
        const dDayB = calculateDday(b.product_expiration_date);
        return dDayA.localeCompare(dDayB);
      });
    }
    return sortedProducts;
  };

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen overflow-y-auto scrollbar-hidden">
      <SearchBar value={searchTerm} onChange={handleSearchChange} onSubmit={handleSearchSubmit} />
      <SortBar onSortChange={handleSortChange} />
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mt-8">
          {filteredProducts.map((product) => (
            <div
              key={product.product_id}
              className={`flex flex-col ${product.product_id !== 0 ? "mt-30" : ""}`}
              onClick={() => router.push(`/itemDetail?product_id=${product.product_id}`)}
            >
              <div>
                <Image
                  src={product.image}
                  width={150}
                  height={150}
                  alt={product.product_name}
                  className="mx-auto"
                />
                <div className="flex justify-between mt-2 text-center">
                  <p className="truncate w-32">{product.product_name}</p>
                  <p>
                    수량: {product.product_quantity !== null ? product.product_quantity : "N/A"}
                  </p>
                </div>
                <div className="flex justify-between mt-2 text-center">
                  {product.product_expiration_date && <p>{product.product_expiration_date} 까지</p>}
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
                    {calculateDday(product.product_expiration_date)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center my-auto">
          <Image src={coldImg} alt="ColdBgImg" width={290} height={290} className="mx-auto" />
          <div className="mt-12 text-xl text-center text-black">
            <p>냉장고가 비어있어요.</p>
            <p>상품을 등록해주세요.</p>
          </div>
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

export default Refrigerator;
