import { createContext, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import supabase from "../utils/supabase";

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("userProvider 내부에 있어야 합니다.");
  }

  return context;
};

export const UserProvider = ({ children }) => {
  //const [text, setText] = useState("안녕하세요");
  const [loading, setLoading] = useState(false);
  //회원가입부분
  const signUp = async (email, password, name, phone, text) => {
    //alert("test");

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

  const value = {
    loading,
    signUp,
    signIn,
    setLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
