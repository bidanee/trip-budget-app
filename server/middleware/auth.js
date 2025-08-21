import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    // 프론트에서 보낸 요청 헤더에서 토큰 추출
    const token = req.headers.authorization.split(' ')[1];

    // 토큰 검증
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // 토큰 검증에 성공하면 req.user에 사용자 정보 저장
    req.userId = decodedData?.id;

    // 다음 미들웨어나 라우터 로직으로 넘어감
    next();
  } catch(error) {
    res.status(401).json({message:'인증되지 않은 사용자입니다.'})
  }
};

export default auth;