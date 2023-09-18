import { useState } from 'react';
import './App.css';
import { getInfo, userLogin } from './api/inerface';

interface User {
  username: string;
  password: string;
}

function App() {
  const [user, setUser] = useState<User>();

  const login = async () => {
    const test = {
      username: 'xzxldl',
      password: '123',
    };
    const data = await userLogin(test);
    console.log(data);

    setUser(data.userInfo);
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
  };

  const info = async () => {
    const data = await getInfo();
    const data2 = await getInfo();
    const data3 = await getInfo();

    console.log(data, data2, data3);
  };

  const forceExpires = () => {
    localStorage.setItem('accessToken', 'xxx'); // 随便的错误的 token 模拟过期
  }

  return (
    <>
      {user?.username ? (
        <div>当前账号: {user.username}</div>
      ) : (
        <button onClick={login}>登录</button>
      )}

      <button onClick={info}>get info</button>
      <button onClick={forceExpires}>模拟过期</button>
    </>
  );
}

export default App;
