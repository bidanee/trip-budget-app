import React, {useState} from 'react';
import styles from './Auth.module.css';
import {signIn, signUp} from '../api';
import useAuthStore from '../store/authStore'
import { toast } from 'react-hot-toast'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login)

  const handleChange = (e) => {
    setFormData({
      ...formData, [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setLoading(true);

    try{
      if (isLogin) {
        const response = await signIn({
          email: formData.email,
          password: formData.password
        });
        const {token} = response.data;
        login(token);
        toast.success('로그인 성공! 환영합니다. :)')
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error('비밀번호가 일치하지 않습니다. 다시 확인해주세요.');
          setLoading(false);
          return;
        }

        await signUp({
          username: formData.username,
          email: formData.email,
          password: formData.password
        });

        const response = await signIn({
          email: formData.email,
          password: formData.password
        });
        const {token} = response.data;
        login(token);
        toast.success('회원가입 성공!! 회원이되신걸 축하드립니다!', token);
      }
    } catch(error) {
      console.error('인증 실패', error);
      toast.error(error.response?.data?.message || '오류가 발생했습니다.')
      setLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authBox}>
        <div className={styles.piggyIcon}>🐷</div>
        <h1 className={styles.title}>
          {isLogin ? 'Trip Pocket' : '회원가입'}
        </h1>
        <p className={styles.subtitle}>
          {isLogin ? '여행 경비를 기록하고 관리해보세요!' : '지금 가입하고 여행 계획을 시작하세요!'}
        </p>
        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="닉네임"
              onChange={handleChange}
              required
              className={styles.input}
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="이메일"
            onChange={handleChange}
            required
            className={styles.input}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            onChange={handleChange}
            required
            className={styles.input}
          />
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="비밀번호 확인"
              onChange={handleChange}
              required
              className={styles.input}
            />
          )}
          <button type="submit" className={styles.button}>
            {isLogin ? '로그인' : '가입하기'}
          </button>
        </form>
        <p className={styles.toggleText}>
          {isLogin ? '아직 회원이 아니신가요?' : '이미 계정이 있으신가요?'}
          <span onClick={() => setIsLogin(!isLogin)} className={styles.toggleLink}>
            {isLogin ? ' 회원가입' : ' 로그인'}
          </span>
        </p>
      </div>
    </div>
  )
}

export default Auth;