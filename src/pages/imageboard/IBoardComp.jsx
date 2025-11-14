import React from "react";
import IListComp from "./IListComp";
import IWriteComp from "./IWriteComp";
import { Link, Route, Routes } from "react-router-dom";
import { IBoardProvider } from "../../context/IBoardContext";
import IViewComp from "./IViewComp";

function IBoardComp() {
  return (
    <IBoardProvider>
      <div className="container">
        <div
          style={{ width: "100%", height: "200px" }}
          className="d-flex justify-content-center align-items-center bg-info rounded mb-3"
        >
          Image-Board
        </div>

        <div className="d-flex justify-content-center gap-3">
          <Link to="../iboard/list" className="nav-link">
            글리스트
          </Link>
          <Link to="../iboard/write" className="nav-link">
            글작성
          </Link>
        </div>
        <Routes>
          <Route index element={<IListComp />}></Route>
          <Route path="list" element={<IListComp />}></Route>
          <Route path="write" element={<IWriteComp />}></Route>
          <Route path="view/:id" element={<IViewComp />}></Route>
        </Routes>
      </div>
    </IBoardProvider>
  );
}

export default IBoardComp;
