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
      {imageBbs.map((item, i) => {
        return (
          <ul key={i}>
            <p scope="row">{imageBbs.length - i}</p>
            <p>{item.fileurl}</p>
            <p>
              <img src={item.fileurl} />
            </p>

            <p>{item.filename}</p>
            <li>
              <Link to={`/iboard/view/${item.id}`} className="nav-link">
                {item.title}
              </Link>
            </li>

            <p>{item.name}</p>
            <p>{dayjs(item.created_at).format("YY.MM.DD")}</p>
          </ul>
        );
      })}
    </div>
  );
}

export default IListComp;
