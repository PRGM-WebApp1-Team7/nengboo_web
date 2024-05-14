import React, { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { debounce } from "lodash"
import { useRouter } from "next/router"

import { supabase } from "@/utils/supabase"
import SearchBar from "@/components/ui/SearchBar"
import calculateDday from "@/utils/calcDday"

const ItemSearch = () => {
  const [filteredData, setFilteredData] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  const fetchFilteredData = useCallback(
    debounce(async (term) => {
      try {
        let query = supabase.from("products").select("*").eq("product_name", term)
        const { data: filteredProducts, error } = await query
        if (error) {
          throw error
        } else {
          setFilteredData(filteredProducts)
        }
      } catch (error) {
        console.error("물품 검색 에러: ", error.message)
      }
    }, 200),
    []
  )

  useEffect(() => {
    if (searchTerm) {
      fetchFilteredData(searchTerm)
    } else {
      setFilteredData([])
    }
  }, [searchTerm, fetchFilteredData])

  const handleSearch = (event) => {
    const value = event.target.value
    setSearchTerm(value)
  }

  const handleSearchSubmit = async (searchTerm) => {
    try {
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .ilike("product_name", `%${searchTerm}%`)
        .single()

      if (error) {
        throw error
      } else {
        setFilteredData([products])
        router.push(`/itemSearch?${product_id}`)
      }
    } catch (error) {
      console.error("검색어 불러오는 중 에러: ", error.message)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
      <SearchBar onChange={handleSearch} onSearch={handleSearchSubmit} value={searchTerm} />
      {filteredData.length > 0 ? (
        <div className="grid grid-co1s-1 gap-4 mt-8">
          {filteredData.map((product) => (
            <div
              key={product.product_id}
              className="rounded-lg p-6 flex flex-row w-full justify-between items-center border border-gray-300"
              onClick={() => router.push(`/itemDetail?${product.product_id}`)}
            >
              <div className="flex items-center mb-4">
                <div className="relative h-40 w-40 mr-4">
                  <Image
                    src={product.image_url}
                    layout="fill"
                    alt={product.product_name}
                    className="rounded-t-lg"
                  />
                </div>
              </div>

              <div className="flex flex-row justify-between">
                <div>
                  <p className="text-m font-semibold mb-2">{product.product_name}</p>
                  <p className="text-gray-500 mb-2">{product.product_expiration_date}</p>
                  <p className="text-sm text-gray-500 mb-2">{product.product_memo}</p>
                </div>
                <div className="text-lg flex flex-col justify-between items-end">
                  <button>
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
                      {calculateDday(product.product_expiration_date)}
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
  )
}

export default ItemSearch
