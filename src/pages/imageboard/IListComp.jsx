import React, { useEffect, useState } from "react";

import { IuseBoard } from "../../context/IBoardContext";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

function IListComp() {
  const { imageBbs, totalCount, getImageBbsWithPagination } = IuseBoard();
  //   console.log(imageBbs);

  //페이지네이션 변수
  const [page, setPage] = useState(1);
  const size = 9;
  const pagerCnt = 10;

  //페이지네이션 계산
  const totalPage = Math.ceil(totalCount / size);
  const startPage = Math.floor((page - 1) / pagerCnt) * pagerCnt + 1;
  const endPage = Math.min(startPage + pagerCnt - 1, totalPage);

  //페이지네이션 번호 배열생성
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    getImageBbsWithPagination(page, size);
  }, [page]);

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
      {/* 페이지네이션 */}
      <div> 페이지정보</div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3">
        <div className="mb3">
          총 {totalCount} 개 / {page} 페이지 / 총 {totalPage} 페이지
        </div>
        <div>
          <ul className="pagination">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => {
                  setPage((prev) => Math.max(prev - 1, 1));
                }}
                disabled={page === 1}
              >
                이전
              </button>
            </li>
            {/* 페이지네이션 bootstrap 디자인 */}
            {pageNumbers.map((item, i) => {
              return (
                <li
                  key={i}
                  className={`page-item ${item == page ? "active" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => {
                      setPage(item);
                    }}
                  >
                    {item}
                  </button>
                </li>
              );
            })}
            <li className={`page-item ${page === totalPage ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => {
                  // setPage(page + 1);
                  setPage((prev) => Math.min(page + 1, totalPage));
                }}
              >
                다음
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div className="d-flex justify-content-end">
        <div className="d-flex gap-2">
          <Link to="/iboard/write" className="btn btn-primary">
            글작성
          </Link>
        </div>
      </div>
      <div>{JSON.stringify(imageBbs)}</div>
    </div>
  );
}

export default IListComp;
