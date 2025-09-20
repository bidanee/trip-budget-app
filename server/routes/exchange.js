import express from 'express';
import axios from 'axios';

const router = express.Router();

// === Config ===
const MAX_ATTEMPTS = 10;
const CACHE_TTL_MS = 10 * 60 * 1000; 


let cache = {
  ts: 0,
  usedDate: null,
  data: null,
};

const yyyymmddKSTMinusDays = (days = 0) => {
  const kst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  kst.setUTCDate(kst.getUTCDate() - days);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, '0');
  const d = String(kst.getUTCDate()).padStart(2, '0');
  return `${y}${m}${d}`;
};

const fetchRatesForDate = async (apiKey, yyyymmdd) => {
  const url = `https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${apiKey}&searchdate=${yyyymmdd}&data=AP01`;
  const { data } = await axios.get(url, { timeout: 10_000 });
  return Array.isArray(data) ? data : [];
};

router.get('/rates', async (req, res) => {
  try {
    const apiKey = process.env.EXCHANGE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ message: '환율 API 키가 서버에 설정되지 않았습니다.' });
    }

    const now = Date.now();
    const force = req.query.force === '1';
    if (!force && cache.data && now - cache.ts < CACHE_TTL_MS) {
      res.set('X-Rate-Base-Date', cache.usedDate || '');
      return res.json(cache.data);
    }

    let ratesData = [];
    let usedDate = null;

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      const searchDate = yyyymmddKSTMinusDays(i);
      try {
        const data = await fetchRatesForDate(apiKey, searchDate);
        if (data.length > 0) {
          ratesData = data;
          usedDate = searchDate;
          break;
        }
      } catch (err) {
        console.warn(`[Exchange] fetch fail for ${searchDate}:`, err.message);
      }
    }

    if (ratesData.length === 0) {
      return res.status(404).json({ message: '최근 환율 정보를 가져올 수 없습니다.' });
    }

    const conversion_rates = { KRW: 1 };
    for (const rate of ratesData) {
      if (!rate?.cur_unit || !rate?.deal_bas_r) continue;
      let code = String(rate.cur_unit);
      let deal = parseFloat(String(rate.deal_bas_r).replace(/,/g, ''));
      if (Number.isNaN(deal)) continue;

      if (code.includes('(100)')) {
        code = code.replace('(100)', '');
        deal = deal / 100;
      }
      conversion_rates[code] = deal;
    }
    
    cache = { ts: now, usedDate, data: conversion_rates };

    res.set('X-Rate-Base-Date', usedDate || '');
    return res.json(conversion_rates);
  } catch (error) {
    console.error('[Exchange] Critical error:', error.message);
    return res.status(500).json({ message: '환율 정보를 가져오는 데 실패했습니다.' });
  }
});

export default router;
