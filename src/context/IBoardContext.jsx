import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "../utils/supabase";

const IBoardContext = createContext();

export const IuseBoard = () => {
  const context = useContext(IBoardContext);
  if (!context) {
    throw new Error("IBoardProvider 안에 있어야 함");
  }
  return context;
};

export const IBoardProvider = ({ children }) => {
  const [imageBbs, SetImageBbs] = useState([]);

  const getImageBbs = async () => {
    const { data, error } = await supabase
      .from("image_bbs")
      .select()
      .order("id", { ascending: false });

    if (!error) {
      SetImageBbs(data);
    }
    console.log(data);
  };

  useEffect(() => {
    getImageBbs();
  }, []);

  const value = {
    imageBbs,
    getImageBbs,
  };

  return (
    <IBoardContext.Provider value={value}>{children}</IBoardContext.Provider>
  );
};
