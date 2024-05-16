import React, { useEffect } from "react";
import { useUserStore } from "@/store/user";
import { getUserStoreInfo, updateUser } from "@/utils/actions";
import { sendMessage } from "@/utils/message";

const Index = () => {
  const { user, updateUserState } = useUserStore();
  useEffect(() => {
    const init = async () => {
      await updateUser();

      const data = await getUserStoreInfo();
      if (!!data) {
        updateUserState(data);
      }
      sendMessage({ message: JSON.stringify(user) });
    };
    init();
  }, []);
  console.log("1`23123", user);
  return null;
};

export default Index;
