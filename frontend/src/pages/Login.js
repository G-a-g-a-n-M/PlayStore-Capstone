import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import BackButton from "../components/BackButton";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      authService.login(res.data.token, res.data.user.role, res.data.user.name, res.data.user.email);
      dispatch(loginSuccess({ token: res.data.token, role: res.data.user.role, name: res.data.user.name, email: res.data.user.email }));

      alert("Login successful");

      navigate("/", { replace: true });

    } catch (error) {

      alert("Invalid credentials");

    }

  };

  return (

    <div style={{ padding: "30px" }}>
      <BackButton />

      <h2>Login</h2>

      <form onSubmit={handleLogin}>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />

        <br/><br/>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
        />

        <br/><br/>

        <button type="submit">

          Login

        </button>

      </form>

    </div>

  );

}

export default Login;