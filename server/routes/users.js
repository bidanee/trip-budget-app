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

// --- 로그인 API ---
router.post('/login', async (req, res) => {
  try{
    // 프론트에서 보낸 이메일,비밀번호 가져오기
    const {email, password} = req.body;

    // 이메일이 데이터베이스에 존재하는지 확인
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({message:'가입되지 않은 이메일이에요. 😭'});
    }
    // 입력된 비밀번호와 DB의 암호화된 비밀번호 비교
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect){
      return res.status(400).json({message:'비밀번호가 일치하지 않아요. 😭'});
    }
    // 로그인에 성공하면 JWT 토큰을 생성
    const token = jwt.sign(
      { email:user.email, id:user._id},
      process.env.JWT_SECRET,
      {expiresIn: '1h'}
    );
    
    // 생성된 토큰 프론트에 전달
    res.status(200).json({token, username:user.username});
  } catch(error) {
    res.status(500).json({message:'서버에 문제가 발생했어요 😭'})
  }
})

export default router;