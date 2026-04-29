import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const client = new Anthropic();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: Request) {
  const { messages, userId } = await request.json();

  console.log('userId received:', userId);

  const response = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 2000,
    system: `あなたはRunPlanのAIランニングコーチです。

役割：
- ユーザーと会話しながらトレーニング計画を作成
- 記録へのフィードバック・応援・褒める
- 天気や体調に合わせた代替メニュー提案
- 走力向上のアドバイス

大会設定や計画を作成した場合、返答の最後に必ず以下のJSON形式でデータを含めてください：

大会を設定した場合：
[RACE_DATA]{"name":"大会名","date":"YYYY-MM-DD","distance":"フルマラソン","goal_time":"目標タイム"}[/RACE_DATA]

週別計画を作成した場合：
[PLAN_DATA][{"week_start":"YYYY-MM-DD","target_km":数値,"phase":"フェーズ名","long_run_km":数値}][/PLAN_DATA]

口調：親しみやすく励ましを忘れずに。絵文字を適度に使う。返答は短めに（3〜5文）。`,
    messages: messages.map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    })),
  });

  const fullReply = response.content[0].type === 'text' ? response.content[0].text : '';

  console.log('Full reply:', fullReply);

  const raceMatch = fullReply.match(/\[RACE_DATA\]([\s\S]*?)\[\/RACE_DATA\]/);
  console.log('raceMatch:', raceMatch ? raceMatch[1] : 'none');

  if (raceMatch && userId) {
    try {
      const raceData = JSON.parse(raceMatch[1]);
      const { error } = await supabase.from('races').upsert({ user_id: userId, ...raceData });
      console.log('Race save error:', error);
    } catch (e) {
      console.error('Race data parse error:', e);
    }
  }

  const planMatch = fullReply.match(/\[PLAN_DATA\]([\s\S]*?)\[\/PLAN_DATA\]/);
  console.log('planMatch:', planMatch ? 'found' : 'none');

  if (planMatch && userId) {
    try {
      const planData = JSON.parse(planMatch[1]);
      const plansWithUserId = planData.map((p: any) => ({ ...p, user_id: userId }));
      const { error } = await supabase.from('plans').upsert(plansWithUserId);
      console.log('Plan save error:', error);
    } catch (e) {
      console.error('Plan data parse error:', e);
    }
  }

  const reply = fullReply
    .replace(/\[RACE_DATA\][\s\S]*?\[\/RACE_DATA\]/g, '')
    .replace(/\[PLAN_DATA\][\s\S]*?\[\/PLAN_DATA\]/g, '')
    .trim();

  return Response.json({ reply });
}