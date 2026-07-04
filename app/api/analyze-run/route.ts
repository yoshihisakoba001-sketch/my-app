import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { imageBase64, mediaType } = await request.json();

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: `以下のJSONのみを返してください。前置きや説明は不要です。

{
  "distance": 数値(km),
  "duration": "H:MM:SS形式",
  "pace": "M:SS形式",
  "heart_rate": 数値(bpm),
  "note": "以下の項目をすべて読み取り1行ずつ記載。存在しない項目はスキップ：\\n- アプリ名・デバイス名\\n- 日付\\n- NGP（normalized graded pace）\\n- TSS（training stress score）\\n- 推定VO2max\\n- 平均ケイデンス(spm)\\n- 上昇高度(m)\\n- 回復心拍数\\n- 今月・今週の最長ランなどの称号\\n- その他画面に表示されている指標"
}`,
            },
          ],
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const cleaned = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(cleaned);

    return Response.json({ success: true, data });
  } catch (e) {
    console.error('Analyze error:', e);
    return Response.json({ success: false, error: '画像の読み取りに失敗しました' });
  }
}