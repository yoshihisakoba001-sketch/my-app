import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(request: Request) {
  const { messages } = await request.json();

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1000,
    system: `あなたはRunPlanのAIランニングコーチです。
ユーザーの目標：東京マラソン2027（フルマラソン）完走。
現在の累計走行距離：284km。今週目標42km、達成28km。

役割：
- トレーニング計画の作成・調整
- 記録へのフィードバック・応援・褒める
- 天気や体調に合わせた代替メニュー提案
- 走力向上のアドバイス

口調：親しみやすく励ましを忘れずに。絵文字を適度に使う。返答は短めに（3〜5文）。`,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const reply = response.content[0].type === 'text' ? response.content[0].text : '';
  return Response.json({ reply });
}