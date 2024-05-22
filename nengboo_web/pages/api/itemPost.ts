import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/utils/supabase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const data = req.body;
    // 여기서는 받은 데이터를 콘솔에 출력하고 성공 응답을 보냅니다.
    console.log("Received data:", data);
    data.product_type = data.product_type.join(",");

    // todo user_id값 select
    const userId = data.user_id;
    delete data.user_id;

    const refId = await supabase
      .from("refrigerators") // TODO 냉장고 테이블로 바꾼다 ( refrigerators )
      .select("refrige_id") // TODO 냉장고 테이블의 id값 ( refrige_id )
      .eq("user_id", userId)
      .single();

    data.refrige_id = refId.data?.refrige_id;
    try {
      // Supabase DB에 데이터를 저장합니다.
      const { data: insertedData, error } = await supabase
        .from("products")
        .insert(data);

      if (error) {
        throw error;
      }

      console.log("Inserted data:", insertedData);

      res.status(200).json({ message: "Data inserted successfully!" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }

    res.status(200).json({ message: "Data received successfully!" });
  } else {
    // POST 요청이 아닌 경우에는 에러 응답을 보냅니다.
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
