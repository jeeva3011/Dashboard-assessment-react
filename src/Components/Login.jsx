import React from "react";
import "../Styles/Login.css";
import { useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate  = useNavigate();
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://stg.dhunjam.in/account/admin/login', {
        username: username,
        password: password
      });

      console.log(response.data);

      setUsername('');
      setPassword('');
      if (response.status === 200) {
        navigate('/admin')
        alert("Login success!!")
      } else{
        alert("Enter valid Username or password!");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="login_main">
      <div>
        <span className="login_header">Venue Admin Login</span>
      </div>
      <form className="login_form" onSubmit={onSubmitHandler}>
        <div className="form_input">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"   
            value={password}        
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form_button">
          <button className="singin_btn" type="submit">
            Sign in
          </button>
          <span>New Registration?</span>
        </div>
      </form>
    </div>
  );
};

export default Login;
