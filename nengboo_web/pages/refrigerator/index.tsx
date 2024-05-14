import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"

import { supabase } from "@/utils/supabase"
import calculateDday from "@/utils/calcDday"
import SearchBar from "@/components/ui/SearchBar"
import useDebounce from "@/hooks/useDebouce"

import coldImg from "@/public/cold.svg"

const Refrigerator = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProducts, setFilteredProducts] = useState([])
  const router = useRouter()

  const debouncedSearchTerm = useDebounce(searchTerm, 200)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: products, error } = await supabase.from("products").select("*")
        if (error) {
          throw error
        } else {
          setProducts(products)
          console.log(products)
        }
      } catch (error) {
        console.error("물품 검색 에러: ", error.message)
      }
    }

    fetchProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter((product) =>
      product.product_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [debouncedSearchTerm, products])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = async (searchTerm) => {
    try {
      const { data: products, error } = await supabase
        .from("products")
        .select("product_id")
        .ilike("product_name", `%${searchTerm}%`)
        .single()

      if (error) {
        throw error
      } else {
        setFilteredProducts(filteredProducts)
        router.push(`/itemSearch?${product_id}`)
      }
    } catch (error) {
      console.error("검색어 불러오는 중 에러: ", error.message)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col min-h-screen">
      <SearchBar onChange={handleSearchChange} onSearch={handleSearchSubmit} value={searchTerm} />
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 mt-8">
          {filteredProducts.map((product) => (
            <div
              key={product.product_id}
              className={`flex flex-col ${product.product_id !== 0 ? "mt-30" : ""}`}
            >
              <Link href={`/itemDetail?${product.product_id}`}>
                <div>
                  <Image
                    src={product.image}
                    width={150}
                    height={150}
                    alt={product.product_name}
                    className="mx-auto"
                  />
                  <div className="flex justify-between mt-2 text-center">
                    <p>{product.product_name}</p>
                    <p>
                      수량: {product.product_quantity !== null ? product.product_quantity : "N/A"}
                    </p>
                  </div>
                  <div className="flex justify-between mt-2 text-center">
                    <p>{product.product_expiration_date}</p>
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
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center my-auto">
          <Image src={coldImg} alt="ColdBgImg" width={290} height={290} className="mx-auto" />
          <div className="mt-12 text-xl text-center text-black">
            <p>냉장고가 비어있어요.</p>
            <p>상품을 등록해주세요.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Refrigerator
