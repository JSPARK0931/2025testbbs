import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import supabase from "../../utils/supabase";

function ImageComp() {
  const [selectFile, setSelectFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadUrl, setuploadUrl] = useState("");
  const [filename, setFilename] = useState("+");

  //미리보기 state
  const [preview, setPreview] = useState("");
  //미리보기 삭제 ref
  const fileInputRef = useRef("");

  const fileChangeHandler = (e) => {
    console.log(e.target.files[0]);
    const file = e.target.files[0];
    setSelectFile(file ?? null);
    setMessage("");
    setFilename(file.name);

    //미리보기
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!selectFile) {
      setMessage("전송할 이미지를 선택하세요");
      toast(message);
      return;
    }

    const bucket = "images";
    const table = "image_upload";
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
      //파일명으로 파일경로 전달받음
      const { data, error: urlErr } = await supabase.storage
        .from(bucket)
        .getPublicUrl(filepath);
      console.log(data.publicUrl);
      setuploadUrl(data.publicUrl);
      if (!urlErr) {
        const { error: insertErr } = await supabase.from(table).insert({
          filename: filename,
          fileurl: uploadUrl,
        });

        if (!insertErr) {
          setMessage("업로드가 완료되었습니다.");
          toast("업로드가 완료되었습니다.");
          setFilename("+");
        } else {
          setMessage("작성실패 :" + insertErr.message);
        }
      } else {
        setMessage("작성실패 :" + urlErr.message);
      }
    }
  };

  const clearPreview = () => {
    //alert("삭제");

    setPreview("");
    setSelectFile(null);
    setFilename("+");
    fileInputRef.current.value = "";
  };

  return (
    <div>
      <h3>이미지업로드</h3>
      <div>
        <form onSubmit={submitHandler}>
          <div style={{ position: "relative" }}>
            <label
              htmlFor="photo"
              className="d-flex justify-content-center align-items-center bg-info rounded text-white mb-3"
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
                  style={{
                    width: "100px",
                    height: "100px",
                    objectfit: "cover",
                  }}
                />
                {/* <div className="btn btn-primary btn-sm position-absolute start-0 top-0">
                  삭제
                </div> */}
              </div>
            </>
          )}

          <button className="btn btn-primary">파일업로드</button>
          <div> {message && <p className="text-danger mt-2">{message}</p>}</div>
          <div>{uploadUrl && <p className="mt-2">{uploadUrl}</p>}</div>
        </form>
      </div>
    </div>
  );
}

export default ImageComp;
