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
  const [imageBbs, setImageBbs] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const getImageBbs = async () => {
    const { data, error } = await supabase
      .from("image_bbs")
      .select()
      .order("id", { ascending: false });

    if (!error) {
      setImageBbs(data);
    }
    console.log(data);
  };

  useEffect(() => {
    getImageBbs();
  }, []);

  //PAGENATION
  const getImageBbsWithPagination = async (page = 1, size = 10) => {
    const from = (page - 1) * size; // 0 10 20
    const to = from + size - 1; // 9 19 29

    //count 개수
    const { count, error: countError } = await supabase
      .from("image_bbs")
      .select("*", { count: "exact", head: true });

    console.log(count);

    if (countError) {
      console.error(countError);
      return { data: [], totalCount: 0, error: countError };
    }

    // 페이지네이션 데이터조회
    const { data, error } = await supabase
      .from("image_bbs")
      .select("*")
      .order("id", { ascending: false })
      .range(from, to);

    // select * from posts order by id desc

    if (!error) {
      setImageBbs(data);
      setTotalCount(count);
      return { data: data, totalCount: count, error: null };
    }

    return { data: [], totalCount: count, error };
  };

  const value = {
    imageBbs,
    totalCount,
    getImageBbs,
    getImageBbsWithPagination,
  };

  return (
    <IBoardContext.Provider value={value}>{children}</IBoardContext.Provider>
  );
};
