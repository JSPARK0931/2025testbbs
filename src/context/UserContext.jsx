import { createContext, useContext, useEffect, useState } from "react";

import supabase from "../utils/supabase";

const UserContext = createContext();

export const useUser = () => {
  console.log("[useUser] Start====>");
  const context = useContext(UserContext);
  console.log(context);
  if (!context) {
    throw new Error("userProvider 내부에 있어야 합니다.");
  }
  console.log("[useUser] End====>");
  return context;
};

export const UserProvider = ({ children }) => {
  console.log("[userProvider] Start====>");
  //const [text, setText] = useState("안녕하세요");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  //회원가입부분

  const fetchUserInfo = async (userId) => {
    const { data, error } = await supabase
      .from("user_table")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) return null;
    return data;
  };

  useEffect(() => {
    console.log("Session 준비===========================");
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      console.log(data.session);

      // data.session 값이 없으면 null값 setting
      const session = data?.session ?? null;
      console.log(session?.user ?? null);
      console.log(session?.user.id);
      // setUser(session?.user ?? null);
      if (session?.user) {
        const extra = await fetchUserInfo(session?.user.id);
        setUser({ ...session.user, ...extra });
      }
    };
    loadUser();
  }, [loading]);

  const signUp = async (email, password, name, phone, text) => {
    //alert("test");
    console.log("[userProvider] SignUp Start====>");
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    //    if (error) throw error;

    if (!error) {
      console.log(data.user.id);
      const { error: userError } = await supabase
        .from("user_table")
        .insert([
          {
            id: data.user.id, //uuid 32난수
            name: name,
            phone: phone,
            text: text,
          },
        ])
        .select();

      if (!userError) {
        return { error: null };
      } else {
        return { error: userError };
      }
    } else {
      return { error: error };
    }
  };

  const signIn = async (email, password) => {
    console.log("[userProvider] SignIn Start====>");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) {
      return { error: null };
    } else {
      return { error: error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    loading,
    user,
    signUp,
    signIn,
    signOut,
    setLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
