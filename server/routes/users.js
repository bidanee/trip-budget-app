import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// --- 회원가입 API ---
router.post('/register', async (req, res) => {
  try{
    // 프론트에서 보낸 정보 가져오기
    const {username, email, password} = req.body;

    // 이메일 중복확인
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message: '이미 사용 중인 이메일입니다🥺'});
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 12);
    
    // 새로운 사용자 생성
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    // 데이터베이스에 사용자 저장
    await newUser.save();

    // 회원가입 성공 응답
    res.status(201).json({message:'회원가입 성공! 🎉 환영합니다!'});
  } catch(error) {
    // 서버 에러가 발생하면 500에러
    res.status(500).json({message:' 서버에 문제가 발생했어요 😭'})
  }
});

// TODO : 로그인 API 추가 예정

export default router;