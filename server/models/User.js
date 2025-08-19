import mongoose from 'mongoose';

// 사용자 정보 스키마 정의
const userSchema = new mongoose.Schema({
  // 사용자 이름(닉네임)
  username:{
    type: String,
    required: true, // 필수 값
  },
  // 이메일 (로그인 ID로 사용)
  email:{
    type:String,
    required: true,
    unique: true, // 고유한 값이어야 함 (중복 불가)
  },
  password: {
    type: String,
    required: true,
  }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

export default User;