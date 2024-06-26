import { supabase } from "@/utils/supabase";
import OpenAI from "openai";

export const kakaoLogin = async () => {
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
      }/refrigerator`,
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

export const fetchUserInfo = async (user_id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user_id);
  if (!error) {
    return data;
  } else console.log("fetchUserInfo >>>", error);
};

export const getUserStoreInfo = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!!user && !!user.identities && !!user.identities[0].identity_data) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user.identities[0].identity_data.provider_id);
    const { data: ref_id, error: ref_error } = await supabase
      .from("refrigerators")
      .select("refrige_id")
      .eq("user_id", user.identities[0].identity_data.provider_id);
    if (!error) {
      const result = {
        ...data[0],
        ...ref_id[0],
      };
      console.log("result >>>", result);
      return result;
    } else console.log("getUserStoreInfo >>>", error);
  }
};

export const fetchUserStoreInfo = async (user_id: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", user_id);
  const { data: ref_id, error: ref_error } = await supabase
    .from("refrigerators")
    .select("refrige_id")
    .eq("user_id", user_id);
  if (!error) {
    const result = {
      ...data[0],
      ...ref_id[0],
    };
    return result;
  } else console.log("fetchUserStoreInfo >>>", error);
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

export const getProductList = async (refrige_id: string) => {
  const { data, error } = await supabase
    .from("products")
    .select("product_name")
    .eq("refrige_id", refrige_id)
    .eq("product_cookable", "ingredients");

  if (!error) {
    console.log(data);
    return data;
  } else console.log("getProdcutList >>>", error);
};

export const getGPTRecipe = async (refrige_id: string) => {
  let parse = "";
  const data = await getProductList(refrige_id);
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
  if (!parse) {
    return "";
  }
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `${parse} 들어간 레시피 1개를 '레시피 이름: \n, 재료: \n, 조리방법: \n'형식으로 추천하고, 인사하지마`,
      },
    ],
    temperature: 0,
    max_tokens: 1000,
  });
  return response.choices[0].message.content;
};

export const getEnglishName = async (
  parse: string,
  setKeyword: React.Dispatch<React.SetStateAction<string>>
) => {
  const openai = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `${parse} 영어로 번역해줘`,
      },
    ],
    temperature: 0,
    max_tokens: 1000,
  });
  setKeyword(response.choices[0].message.content);
};

export const getRecipeImage = async (query: string) => {
  const Access_Key = process.env.NEXT_PUBLIC_ACCESS_KEY;
  const response = await fetch(
    `https://api.unsplash.com/search/photos?page=1&query=${query}&client_id=${Access_Key}&orientation=landscape&per_page=1`
  );
  const responseJson = await response.json();
  const result = responseJson.results;
  return result[0].urls.full;
};
