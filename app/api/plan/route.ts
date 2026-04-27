import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export async function POST(request: Request) {
  const { messages } = await request.json();

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    system: `あなたはランニングコーチのAIアシスタントです。
ユーザーと会話しながら、以下の情報を収集してトレーニングプランを作成してください。

収集する情報：
1. 目標大会（名前・日付・距離）
2. 現在の走力（週何km走っているか、最近のレースタイムなど）
3. 週に何回トレーニングできるか
4. 長所・短所（スタミナ不足、スピード不足など）

情報が揃ったら、月別・週別のトレーニングプランを提案してください。
返答は日本語で、親しみやすい口調でお願いします。`,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const reply = response.content[0].type === 'text' ? response.content[0].text : '';
  return Response.json({ reply });
}