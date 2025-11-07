import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";

function SignUpComp() {
  const { loading, setLoading, signUp } = useUser();

  const [formData, setFormData] = useState({
    useremail: "",
    userpwd: "",
    userpwd1: "",
    name: "",
    phone: "",
    text: "",
  });

  const [errorM, setErrorM] = useState("");
  //const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const eventHandler = (e) => {
    const { name, value } = e.target;
    //    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const validation = () => {
    if (formData.userpwd.length < 6) {
      //   alert("비밀번호는 6자리 X");
      return "비밀번호는 6자리이상 입력하세요.";
    }
    if (formData.userpwd1.length < 6) {
      //   alert("비밀번호는 6자리 X");
      return "비밀번호확인은 6자리이상 입력하세요.";
    }
    if (formData.userpwd != formData.userpwd1) {
      //   alert("비밀번호 X.");
      return "비밀번호가 일치하지 않습니다.";
    }

    return "";
  };

  const confirmHandler = async (e) => {
    e.preventDefault();

    //validation check 필요 (email, 비밀번호 등)

    //if ("1" === 1 ) false : 형식까지 비교
    //if ("1" == 1) true

    const message = validation();
    if (message) {
      //   setErrorM(message);
      toast(message);
      return;
    } else {
      setErrorM("");
    }

    // alert("회원가입");

    setLoading(true);

    //회원가입
    const { error } = await signUp(
      formData.useremail,
      formData.userpwd,
      formData.name,
      formData.phone,
      formData.text
    );

    console.log(error);

    if (!error) {
      toast("회원가입완료");
      setLoading(false);
      navigate("/member/signin");
    } else {
      toast("회원가입실패 : " + error);
      setLoading(false);
    }

    //   const { data, error } = await supabase.auth.signUp({
    //     email: formData.useremail,
    //     password: formData.userpwd,
    //   });

    //   console.log(data);

    // if (!error) {
    //   console.log(data.user.id);
    //   const { error } = await supabase
    //     .from("user_table")
    //     .insert([
    //       {
    //         id: data.user.id,
    //         name: formData.name,
    //         phone: formData.phone,
    //         text: formData.text,
    //       },
    //     ])
    //     .select();

    //   if (!error) {
    //     toast("회원가입완료");
    //     setLoading(false);
    //     navigate("/");
    //   } else {
    //     toast("회원가입실패(USER)");
    //     setLoading(false);
    //   }
    // } else {
    //   toast("회원가입실패(AUTH)");
    //   setLoading(false);
    // }
  };

  return (
    <div
      className=" rounded shadow p-4"
      style={{ width: "80%", maxwhidth: "400px" }}
    >
      <h4>회원가입</h4>
      <hr />
      <div>{errorM}</div>
      <div>
        <form onSubmit={confirmHandler}>
          <div>
            <label htmlFor="email" className="label-control my-2">
              이메일 {formData.useremail}
            </label>
            <input
              type="text"
              className="form-control"
              id="email"
              placeholder="이메일을 입력하세요."
              name="useremail"
              onChange={eventHandler}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="pwd" className="label-control my-2">
              비밀번호 {formData.userpwd}
            </label>
            <input
              type="password"
              className="form-control"
              id="pwd"
              placeholder="비밀번호를 입력하세요.(6자이상)"
              name="userpwd"
              onChange={eventHandler}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="pwd1" className="label-control my-2">
              비밀번호확인 {formData.userpwd1}
            </label>
            <input
              type="password"
              className="form-control"
              id="pwd1"
              placeholder="비밀번호를 확인하세요.(6자이상)"
              name="userpwd1"
              onChange={eventHandler}
              required
              disabled={loading}
            />
          </div>
          <hr />
          <div>
            <label htmlFor="name" className="label-control my-2">
              이름 {formData.name}
            </label>
            <input
              type="text"
              className="form-control"
              name="name"
              id="name"
              placeholder="이름을 입력하세요."
              onChange={eventHandler}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="phone" className="label-control my-2">
              전화번호 {formData.phone}
            </label>
            <input
              type="text"
              className="form-control"
              name="phone"
              id="phone"
              placeholder="핸드폰번호를 입력하세요."
              onChange={eventHandler}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="text" className="label-control my-2">
              자기소개 {formData.text}
            </label>
            <input
              type="text"
              className="form-control"
              name="text"
              id="text"
              placeholder="간단자기소개를 입력하세요."
              onChange={eventHandler}
              disabled={loading}
            />
          </div>
          <div className="d-flex py-3 justify-content-between">
            <div>
              <Link to="/member/siginin" className="nav-link">
                로그인
              </Link>
            </div>
            <button className="btn btn-primary" disabled={loading}>
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SignUpComp;
