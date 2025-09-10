import express from 'express'
import axios from 'axios'

const router = express.Router();

router.get('/', async(req, res) => {
  try{
    const apiKey = process.env.EXCHANGE_API_KEY;
    if(!apiKey) {
      return res.status(500).json({message: '환율정보 API KEY를 찾을 수 없습니다.'});
    }
    
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const searchDate = `${year}${month}${day}`;

    const url = `https://www.koreaxim.go.kr/site/program/financial/exchangeJSON?authkey=${apiKey}&searchdate=${searchDate}&data=AP01`;
    
    const response = await axios.get(url);
    const ratesData = response.data;

    if (!ratesData || ratesData.length === 0) {
      // todo : 주말/공휴일인 경우 가장 최신 영업일 환율가져오는 로직 추가
      return res.status(404).json({message: '해당 날짜의 환율정보를 찾을 수 없습니다. (주말/공휴일 확인)'});
    }

    // 기준 통화 : KRW
    const conversion_rates = {
      'KRW': 1,
    }

    ratesData.forEach(rate => {
      let currencyCode = rate.cur_unit;
      let dealRate = parseFloat(rate.deal_bas_r.replace(/,/g,''));

      //JPY(100) 같은 뒤에 뭐가 붙으면 나눠서 1엔당 환율로 계산
      if (currencyCode.includes('(100)')) {
        currencyCode = currencyCode.replace('(100)', '');
        dealRate = dealRate / 100;
      }

      conversion_rates[currencyCode] = dealRate;
    });
    
    res.json(conversion_rates);
  } catch(error) {
    console.error('환율 정보 조회 실패', error);
    res.status(500).json({message: '환율 정보를 가져오는데 문제가 발생했습니다.'});
  }
});

export default router;