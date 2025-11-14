import React, { useEffect, useState } from "react";
import supabase from "./../../utils/supabase";
import { Link, useParams } from "react-router-dom";
import dayjs from "dayjs";

function IViewComp() {
  const { id } = useParams();
  const [view, setView] = useState([]);
  useEffect(() => {
    const viewData = async () => {
      const { data, error } = await supabase
        .from("image_bbs")
        .select("*")
        .eq("id", Number(id))
        .single();
      console.log("IviewComp===> " + id);
      console.log(data);
      setView(data);
    };
    viewData();
  }, []);
  return (
    <div>
      <h3>이미지 글보기</h3>
      <hr />
      {/* <div className="d-flex flex-column flex-md-row justify-content-between"> */}
      <div>
        <h4>{view.title}</h4>

        <div>
          {view.name} / {dayjs(view.created_at).format("YY.MM.DD hh:mm")} / no :{" "}
          {view.id}
        </div>
        <hr />
        <img src={view.fileurl} />
        <p style={{ "min-height": "200px" }}>{view.content}</p>
      </div>
      <div className="d-flex justify-content-end">
        <div className="d-flex gap-2">
          <Link to="/iboard/list" className="btn btn-primary">
            리스트
          </Link>
          <Link to={`/iboard/modify/${id}`} className="btn btn-info">
            수정
          </Link>
          <Link to="" className="btn btn-danger">
            삭제
          </Link>
        </div>
      </div>
    </div>
  );
}

export default IViewComp;
