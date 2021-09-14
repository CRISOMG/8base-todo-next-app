import { useState } from 'react';
import { useUserLogin } from '../hooks';

export default function Login() {
  const [email, setEmail] = useState(process.env.NEXT_PUBLIC_EMAIL);
  const [password, setPassword] = useState(process.env.NEXT_PUBLIC_PASSWORD);
  const [toggleShow, setToggleShow] = useState(false);
  const [userLogin, { loading }] = useUserLogin(email, password);

  const handlerShowPassword = (e) => {
    setToggleShow(!toggleShow);
  };
  const handlerSubmit = async (e) => {
    e.preventDefault();
    const { data } = await userLogin();
    localStorage.setItem('token', data.userLogin.auth.idToken);
    location.href = '/';
  };
  const handlerEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlerPassword = (e) => {
    setPassword(e.target.value);
  };
  return (
    <section>
      <h1>login</h1>
      <form onSubmit={handlerSubmit}>
        <div>
          <label className='block' htmlFor='login-input-email'>
            Email:
          </label>
          <input
            onChange={handlerEmail}
            value={email}
            disabled={loading}
            type='email'
            id='login-input-email'
            placeholder='Email'
          />
        </div>
        <div>
          <label className='block' htmlFor='login-input-password'>
            Password:
          </label>
          <input
            onChange={handlerPassword}
            value={password}
            disabled={loading}
            type={toggleShow ? 'text' : 'password'}
            id='login-input-password'
            placeholder='Password'
          />
          <div>
            <label className='no-user-select' htmlFor='show-input-password'>
              show password
            </label>
            <input type='checkbox' onChange={handlerShowPassword} checked={toggleShow} id='show-input-password' />
          </div>
        </div>
        <button disabled={loading}>submit</button>
      </form>
      <style jsx>{`
        section {
          margin: auto;
          width: 16rem;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        div {
          margin-bottom: 8px;
        }
        .block {
          display: block;
        }
        .no-user-select {
          cursor: pointer;
          user-select: none;
        }
      `}</style>
    </section>
  );
}
