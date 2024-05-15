import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  user_id: string;
  user_email: string;
  user_name: string;
  user_create_day: string;
  refrige_id: string;
}

interface UserState {
  user: User | null;
  updateUserState: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      updateUserState: (user: User) => set(() => ({ user })),
    }),
    { name: "user-storage" }
  )
);
