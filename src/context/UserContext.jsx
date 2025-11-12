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
    let mounted = true;
    console.log("Session 준비===========================");
    const loadUser = async () => {
      const { data } = await supabase.auth.getSession();
      console.log(data.session);

      // data.session 값이 없으면 null값 setting
      const session = data?.session ?? null;
      console.log(session?.user ?? null);
      console.log("session.user.id :" + session?.user.id);
      // setUser(session?.user ?? null);
      if (session?.user) {
        const extra = await fetchUserInfo(session?.user.id);
        setUser({ ...session.user, ...extra });
      }

      const { data: sub } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (!mounted) return;

          if (session?.user) {
            const extra = await fetchUserInfo(session?.user.id);
            setUser({ ...session.user, ...extra });
          } else {
            setUser(null);
          }
        }
      );

      // useEffect의 event성을 정지시킬때 return 사용
      return () => {
        mounted = false;
        sub?.subscription?.unsubscribe?.();
      };
    };
    loadUser();
  }, []);

  // SignUp : 회원가입
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

  //SignIn : 로그인
  const signIn = async (email, password) => {
    console.log("[userProvider] SignIn Start====>");
    //로그인 성공시 signInWithPassword에서 local storage에 key 자동저장 data, 에러시 error
    // cf) spring에서는 key값을 JWT 이용 localstorage에 저장하는 flow필요
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
