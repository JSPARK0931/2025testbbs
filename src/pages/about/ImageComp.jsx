import React, { useState } from "react";
import { toast } from "react-toastify";
import supabase from "../../utils/supabase";

function ImageComp() {
  const [selectFile, setSelectFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadUrl, setuploadUrl] = useState("");
  const [filename, setFilename] = useState("+");

  const fileChangeHandler = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    setSelectFile(file ?? null);
    setMessage("");
    setFilename(file.name);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!selectFile) {
      setMessage("전송할 이미지를 선택하세요");
      toast(message);
      return;
    }

    const bucket = "images";
    const filepath = `${Date.now()}_${selectFile.name}`;

    // 파일이름 uuid + "_" + selectFile.name -> ERSDXC123412_han.png
    // 파일이름 날짜 + "_"  + selectFile.name -> 20251112_han.png (V)
    // 파일이름 난수 + "_"  + selectFile.name
    // alert("테스트");

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filepath, selectFile);

    if (error) {
      setMessage("업로드 실패 :" + error.message);
      return;
    } else {
      setMessage("업로드가 완료되었습니다.");
      toast("업로드가 완료되었습니다.");

      //파일명으로 파일경로 전달받음
      const { data } = supabase.storage.from(bucket).getPublicUrl(filepath);
      console.log(data.publicUrl);
      setuploadUrl(data.publicUrl);
      setFilename("+");
    }
  };
  return (
    <div>
      <h3>이미지업로드</h3>
      <div>
        <form onSubmit={submitHandler}>
          <div style={{ position: "relative" }}>
            <label
              htmlFor="photo"
              className="d-flex justify-content-center align-times-center bg-info rounded text-white mb-3"
              style={{ width: "100%", height: "50px" }}
            >
              {filename}
            </label>
            {/* <input type="text" /> */}
            <input
              type="file"
              accept="image/*"
              id="photo"
              onChange={fileChangeHandler}
              style={{
                position: "absolute",
                width: "100%",
                opacity: 0,
                top: 0,
              }}
            />
          </div>
          <button className="btn btn-primary">파일업로드</button>
          <div> {message && <p className="text-danger mt-2">{message}</p>}</div>
          <div>{uploadUrl && <p className="mt-2">{uploadUrl}</p>}</div>
        </form>
      </div>
    </div>
  );
}

export default ImageComp;
