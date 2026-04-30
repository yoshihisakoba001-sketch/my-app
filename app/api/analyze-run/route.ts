import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(request: Request) {
  try {
    const { imageBase64, mediaType } = await request.json();

    const response = await client.messages.create({
      model: 'claude-opus-4-6',
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
              text: `このランニングアプリ（Suunto、Garmin、Nike Run Club、Stravaなど）のスクリーンショットから以下の情報を読み取ってください。

必ず以下のJSON形式のみで返答してください（他のテキストは不要）：
{
  "distance": 数値（km）,
  "duration": "時間:分:秒の文字列 例: 1:23:45",
  "pace": "分:秒/kmの文字列 例: 5:30",
  "heart_rate": 数値（bpm、ない場合はnull）,
  "calories": 数値（kcal、ない場合はnull）,
  "note": "アプリ名と簡単な説明"
}

情報が読み取れない場合はnullにしてください。`,
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