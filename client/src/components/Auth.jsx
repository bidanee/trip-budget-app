import React, {useState} from 'react';
import styles from './Auth.module.css';

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: ''
  });
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignup) {
      console.log('회원가입 로직')
    } else {
      console.log('로그인 로직')
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  }

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authBox}>
        <h2>{isSignup ? '회원가입' : '로그인'}</h2>
        <form onSubmit={handleSubmit}>
          {isSignup && ( 
            <div className={styles.inputGroup}>
              <input name='username' placeholder='닉네임' onChange={handleChange}/>
            </div>
          )}
          <div className={styles.inputGroup}>
            <input name='email' placeholder='이메일' type='email' onChange={handleChange}/>
          </div>
          <div className={styles.inputGroup}>
            <input name='password' placeholder='비밀번호' type='password' onChange={handleChange}/>
          </div>
          {isSignup && (
            <div className={styles.inputGroup}>
              <input name='confirmPassword' placeholder='비밀번호 확인' type='password' onChange={handleChange}/>
            </div>
          )}
          <button type='submit' className={styles.authButton}>
            {isSignup ? '가입하기' : '로그인하기'}
          </button>
          <p className={styles.toggleAuth}>
            {isSignup ? '이미 계정이 있으신가요?  ' : '계정이 없으신가요?  '}
            <span onClick={switchMode}>
              {isSignup ? '로그인' : '회원가입'}
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Auth;