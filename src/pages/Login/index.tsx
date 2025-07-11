import { useEffect, useState } from "react";

import styles from "./index.module.scss"

import { useNavigate } from "react-router-dom";
import fetchMe from "../../api/user/me";
import register from "../../api/user/register";
import login from "../../api/user/login";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() =>{
    fetchMe().then((result)=>{
      if (result.success) {
        navigate("/")
      }
    });
  }, [])

  const handleRegister = (username: string, password: string) => {
    setMessage("註冊中...");
    setError("");
    register(username, password).then((result) => {
      if (result.success) {
        setMessage(result.message)
        setError("");
      } else {
        setMessage("")
        setError(result.message);
      };
    });
  }

  const handleLogin = (username: string, password: string) => {
    setMessage("登入中...");
    setError("");
    login(username, password).then((result)=>{
      if (result.success) {
        navigate("/")
      } else {
        setMessage("")
        setError(result.message);
      };
    });
    
  }

  return(
    <div className={styles.wrapper}>
      <h1>Note system</h1>
      <div className={styles.box}>
        <div className={styles.inputField}>
          <a>Username</a>
          <input 
            type="text"
            value={username}
            onChange={(e)=>{setUsername(e.target.value)}}
          />
        </div>
        <div className={styles.inputField}>
          <a>Password</a>
          <input 
            type="password"
            value={password}
            onChange={(e)=>{setPassword(e.target.value)}}
          />
        </div>
        <div className={styles.actions}>
          <div className={styles.button} onClick={()=>{handleRegister(username, password)}}>
            Register
          </div>
          <div className={styles.button} onClick={()=>{handleLogin(username, password)}}>
            Login
          </div>
        </div>
        {error && 
          <div className={styles.error}>
            {error}
          </div>
        }
        {message && 
          <div className={styles.message}>
            {message}
          </div>
        }
      </div>
    </div>
  )
}