import React from "react";

import { IuseBoard } from "../../context/IBoardContext";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

function IListComp() {
  const { imageBbs } = IuseBoard();
  //   console.log(imageBbs);
  if (!imageBbs.length) {
    return <p>게시물이 없습니다.</p>;
  }

  return (
    <div>
      <h3>이미지 리스트</h3>
      <div className="iboardList shadow">
        {imageBbs.map((item, i) => {
          return (
            <>
              <div key={i} className="mb-5 shadow">
                <Link to={`/iboard/view/${item.id}`} className="nav-link">
                  <p>
                    <img
                      src={
                        item.fileurl
                          ? item.fileurl
                          : "https://jthyftgxlnafhkrcasyl.supabase.co/storage/v1/object/public/images/no-img-icon-p.png"
                      }
                      width={200}
                      height={200}
                    />
                  </p>
                  {/* <p>{item.filename}</p> */}
                  <p>
                    {item.id}. 글제목 : {item.title}
                  </p>

                  {/* <p>{item.name}</p> */}
                  {/* <p>{dayjs(item.created_at).format("YY.MM.DD")}</p> */}
                </Link>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
}

export default IListComp;
