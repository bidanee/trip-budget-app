import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import userRoutes from './routes/users.js';

// express 앱 생성
const app = express();
const PORT = process.env.PORT || 3001;

// middleware 설정
app.use(cors());
app.use(express.json());

// 데이터베이스에 연결(mongodb)
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB에 성공적으로 연결되었습니다~~ ☁️'))
.catch(err => console.error('MongoDB에 연결 실패 ㅠㅠ', err));


// --- TODO ---
// API 라우트 추가 예정

// 1.users라우터 추가
app.use('/api/users', userRoutes);

// 기본 라우트 설정 (서버 생존 확인용)
app.get('/', (req, res) => {
  res.send('trip-budget-app 백엔드 서버 열려있어용!~');
});


// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 ${PORT}번 포트에서 실행 중입니다~ 슝슝🚀`);
})
