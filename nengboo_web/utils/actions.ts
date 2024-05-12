import { supabase } from "@/utils/supabase";
import { sendMessage } from "./message";
import OpenAI from "openai";

export const googleLogin = async () => {
  sendMessage({ message: "login" });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: `${
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://nengboo-web-prgm-webapp1.vercel.app"
      }/main`,
    },
  });
};

export const kakaoLogin = async () => {
  sendMessage({ message: "login" });

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
      redirectTo: `${
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://nengboo-web-prgm-webapp1.vercel.app"
      }/main`,
    },
  });
};

// 디버깅 용 로그아웃 함수
export const logout = async () => {
  const { error } = await supabase.auth.signOut();
  if (!!error) {
    alert("로그아웃 되었습니다.");
  } else console.log("logout >>>", error);
};

// 소셜 로그인 한 유저의 정보를 유저 table에 담는 함수
export const updateUser = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!!user && !!user.identities && !!user.identities[0].identity_data) {
    const { data, error } = await supabase
      .from("users")
      .upsert([
        {
          user_id: user.identities[0].identity_data.provider_id,
          user_email: user.identities[0].identity_data.email,
          user_name: user.identities[0].identity_data.name,
          user_create_day: user.identities[0].created_at,
        },
      ])
      .select();
    insertRefrige();
    if (!error) console.log(data);
    else console.log("updateUser >>>", error);
  }
};

// 유저 table에서 로그인한 유저의 db정보를 모두 가져오는 함수
export const getUserInfo = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!!user && !!user.identities && !!user.identities[0].identity_data) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user.identities[0].identity_data.provider_id);

    if (!error) {
      console.log(data);
      return data;
    } else console.log("getUserInfo >>>", error);
  }
};

// 냉장고 생성
export const insertRefrige = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!!user && !!user.identities && !!user.identities[0].identity_data) {
    const { data, error } = await supabase
      .from("refrigerators")
      .select("*")
      .eq("user_id", user.identities[0].identity_data.provider_id);
    if (!!data) console.log("유저가 이미 냉장고를 가지고 있습니다.");
    else {
      const { data: refrige, error } = await supabase
        .from("refrigerators")
        .insert([
          {
            user_id: user.identities[0].identity_data.provider_id,
            refrige_create_day: user.identities[0].created_at,
          },
        ])
        .select();

      if (!error) console.log(refrige);
      else console.log("insertRefrige >>>", error);
    }
  }
};

export const getProductList = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: ref_id, error } = await supabase
    .from("refrigerators")
    .select("refrige_id")
    .eq("user_id", user.identities[0].identity_data.provider_id);
  if (!!ref_id) {
    const { data, error } = await supabase
      .from("products")
      .select("product_name")
      .eq("refrige_id", ref_id[0].refrige_id);

    if (!error) {
      console.log(data);
      return data;
    } else console.log("getProdcutList >>>", error);
  } else console.log("getProdcutList (ref_id) >>>", error);
};

export const getGPTRecipe = async () => {
  let parse = "";
  const data = await getProductList();
  console.log("data >>>", data);
  if (!!data) {
    data.map((e) => {
      parse += e.product_name + " ";
    });
  }
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `${parse}들어간 레시피 1개를 '레시피 이름, 재료, 조리방법'만 추천하고 인사하지마`,
      },
    ],
    temperature: 0,
    max_tokens: 1000,
  });
  console.log(response);
  return response.choices[0].message.content;
};
