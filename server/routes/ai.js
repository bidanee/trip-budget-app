import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();
const ai = new GoogleGenAI({apiKey:process.env.GEMINI_API_KEY});

const tools = [
  {
    "google_search" : {},
  },
];

router.post('/chat', async (req, res) => {
  try{
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({message: '질문을 입력해주세요.'});
    }

    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{role: "user", parts:[{text: prompt}]}],
      tools: tools,
    });
    
    const responseText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (responseText) {
      res.status(200).json({response:responseText});
    } else {
      console.error('Gemini API의 응답 구조가 예상과 다릅니다. :', JSON.stringify(result, null, 2));
      throw new Error('AI 응답에서 텍스트 추출 불가')
    }
  } catch(error) {
    console.error('AI 응답 생성 실패: ', error);
    res.status(500).json({message: 'AI가 응답을 생성하는 데 실패했습니다.'})
  }
});

export default router;