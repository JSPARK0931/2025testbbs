import React, { useRef, useState } from "react";
import { useUser } from "../../context/UserContext";
import supabase from "../../utils/supabase";
import { Link, useNavigate } from "react-router-dom";
import { IuseBoard } from "../../context/IBoardContext";
import { toast } from "react-toastify";

function IWriteComp() {
  const { user } = useUser();
  const [selectFile, setSelectFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [filename, setFilename] = useState("+");

  const [uploadUrl, setUploadUrl] = useState("");

  //미리보기 state
  const [preview, setPreview] = useState("");
  //미리보기 삭제 ref
  const fileInputRef = useRef("");

  if (!user) {
    return <p>로그인 후 이용가능합니다.!!!</p>;
  }

  const { getImageBbs } = IuseBoard();
  const navigate = useNavigate();

  // 파일선택시
  const fileChangeHandler = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    setSelectFile(file ?? null);
    setMsg("");
    setFilename(file.name);

    //미리보기
    setPreview(URL.createObjectURL(file));
  };

  const [formData, setFormData] = useState({
    title: "",
    name: user?.name ?? "",
    content: "",
    filename: "",
    fileurl: "",
    user_id: user.id,
  });

  const eventHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!selectFile) {
      setMsg("전송할 이미지를 선택하세요.");
      toast(msg);
      return;
    }
    const bucket = "images";
    const table = "image_upload";
    //파일이름 : 날짜 _ file명
    const filepath = `${Date.now()}_${selectFile.name}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filepath, selectFile);
    if (error) {
      setMsg("업로드 실패 :" + error.message);
      return;
    } else {
      // 파일명으로 파일경로 전달받음
      const { data, error: urlErr } = await supabase.storage
        .from(bucket)
        .getPublicUrl(filepath);
      console.log(data.publicUrl);
      setUploadUrl(data.publicUrl);

      console.log("uploadURL :" + uploadUrl);

      if (urlErr) {
        alert("작성실패");
        setMsg("작성실패 :" + urlErr.message);
      } else {
        alert("작성성공");
        // console.log("url값 " + data.publicUrl);
        // console.log("uploadURL :" + uploadUrl);
      }

      //   //   validate();
      //   console.log("filename : " + filename);
      //   console.log("url :" + uploadUrl);
      //   console.log("data:" + data.publicUrl);
      const createWrite = async () => {
        const { error } = await supabase
          .from("image_bbs")
          .insert({
            title: formData.title,
            name: formData.name,
            content: formData.content,
            user_id: formData.user_id,
            // filename: formData.filename,
            // fileurl: formData.fileurl,
            filename: filename,
            fileurl: data.publicUrl,
          })
          .select();

        if (!error) {
          alert("글작성성공!!");
          navigate("/iboard/list");
          // setFilename("+");
          // setUploadUrl("");
          getImageBbs();
        } else {
          alert("글작성실패!!");
          console.log("error :" + error);
        }
      };
      createWrite();
    }
  };

  const clearPreview = () => {
    alert("삭제");

    setPreview("");
    setSelectFile(null);
    setFilename("+");
    fileInputRef.current.value = "";
  };

  return (
    <div>
      <h3>이미지글작성</h3>
      <div>
        <form onSubmit={submitHandler}>
          <div className="mb-3">
            <label htmlFor="" className="form-label">
              제목
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="form-control"
              placeholder="글제목을 입력하세요"
              required
              onChange={eventHandler}
            />
          </div>
          <div>{formData.title} </div>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              placeholder="이름을 입력하세요"
              required
              onChange={eventHandler}
              //onChange = {(e)=>{setName(e.target.value)}}
              value={user?.name ?? ""}
              disabled={user?.name}
            />
          </div>
          <div>{formData.name}</div>
          <div className="mb-3">
            <label htmlFor="content" className="form-label">
              내용
            </label>
            <textarea
              type="text"
              id="content"
              name="content"
              className="form-control"
              placeholder="내용을 입력하세요"
              rows="10"
              required
              onChange={eventHandler}
              //onChange = {(e)=>{setContent(e.target.value)}}
              // style={{ height: "200px" }}
            />
          </div>
          <div>{formData.content}</div>
          <div>
            {/* <label htmlFor="photo">{filename}</label> */}
            <label htmlFor="photo"></label>
            <input
              className="d-flex mb-3"
              type="file"
              accept="image/*"
              id="photo"
              onChange={fileChangeHandler}
              ref={fileInputRef}
            />
          </div>
          {preview && (
            <>
              <div
                className="mb-3 position-relative bg-info shadow"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "10px",
                  overflow: "hidden",
                }}
              >
                <div
                  className="bg-white  btn-sm position-absolute"
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "10px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontSize: "10px",
                    lineHeight: "10px",
                    right: "5px",
                    top: "5px",
                  }}
                  onClick={clearPreview}
                >
                  X
                </div>
                <img
                  src={preview}
                  style={{ width: "100px", height: "100px", objecfit: "cover" }}
                />
              </div>
            </>
          )}

          <div> {msg && <p className="text-danger mt-2">{msg}</p>}</div>
          <div>{uploadUrl && <p className="mt-2">{uploadUrl}</p>}</div>

          <div className="d-flex justify-content-end">
            <div className="d-flex gap-2">
              <Link to="iboard/list" className="btn btn-danger">
                취소
              </Link>

              <button to="iboard/write" className="btn btn-primary">
                글작성
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default IWriteComp;
