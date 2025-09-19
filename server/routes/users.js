import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import { uploadAvatar } from '../middleware/upload.js'

const router = express.Router();

// --- 회원가입 API ---
router.post('/register', async (req, res) => {
  try{
    // 프론트에서 보낸 정보 가져오기
    const {username, email, password} = req.body;

    // 이메일 중복확인
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message: '이미 사용 중인 이메일입니다'});
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
    res.status(500).json({message: error.message || ' 서버에 문제가 발생했어요 😭'})
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
});


// 현재 사용자 정보
router.get('/me', auth, async(req, res) => {
  const user = await User.findById(req.userId).select('username email avatarUrl').lean();
  if(!user) return res.status(404).json({message:'사용자 정보를 찾을 수 없습니다.'});
  res.json(user);
});

// 닉네임, 이미지 업데이트
router.put('/profile', auth, uploadAvatar.single('avatar'), async(req, res) => {
  try {
    const {username} = req.body;
    const update = {};

    if (typeof username === 'string' && username.trim()){
      update.username = username.trim();
    }
    if(req.file) {
      update.avatarUrl = `/uploads/${req.file.filename}`;    
    }

    const user = await User.findByIdAndUpdate(req.userId, {$set: update}, {new: true}).select('username email avatarUrl').lean();

    if (!user) {
      return res.status(404).json('사용자를 찾을 수 없습니다.');
    }
    res.json({ message: '프로필이 업데이트 되었습니다.', user });
  } catch(error) {
    res.status(400).json({message: error.message || '프로필 업데이트 실패'});
  }
});

// 비밀번호 변경
router.put('/password', auth, async(req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword)  {
    return res.status(400).json({message:'현재 비밀번호와 새 비밀번호를 모두 입력해주세요.'});
  }

  const user = await User.findById(req.userId);
  if (!user) {
    return res.status(404).json({message:'사용자를 찾을 수 없습니다.'});
  }
  const ok = await bcrypt.compare(currentPassword, user.password);
  if (!ok) {
    return res.status(400).json({message:'비밀번호가 올바르지 않습니다.'});
  }

  if (newPassword.length < 8) {
    return res.status(400).json({message:'비밀번호는 8자 이상이야 합니다.'});
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.json({message:'비밀번호가 변경되었습니다.'})
})


export default router;