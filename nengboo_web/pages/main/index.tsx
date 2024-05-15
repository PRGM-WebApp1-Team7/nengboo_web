import { useUserStore } from "@/store/user";

import { getUserStoreInfo, updateUser } from "@/utils/actions";
import { useEffect } from "react";

export default function MainPage() {
  const { user, updateUserState } = useUserStore();

  const check = () => {
    console.log(user);
  };

  useEffect(() => {
    const initMain = async () => {
      await updateUser();
      const data = await getUserStoreInfo();
      if (!!data) updateUserState(data);
    };
    initMain();
  }, []);

  return (
    <div>
      <button onClick={check}>console</button>
    </div>
  );
}
