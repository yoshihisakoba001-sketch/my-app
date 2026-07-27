import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const client = new Anthropic();

const TOOLS: Anthropic.Tool[] = [
  {
    name: 'save_run',
    description: 'ユーザーの走行記録をデータベースに保存する。ランニング画像を分析した後、またはユーザーが記録保存を求めたときに必ず使用する。',
    input_schema: {
      type: 'object',
      properties: {
        date: { type: 'string', description: '走行日 YYYY-MM-DD形式' },
        distance: { type: 'number', description: '走行距離(km)' },
        duration: { type: 'string', description: 'タイム H:MM:SS形式' },
        pace: { type: 'string', description: '平均ペース M:SS形式' },
        heart_rate: { type: 'number', description: '平均心拍数(bpm)' },
        note: { type: 'string', description: 'NGP・TSS・VO2max・アプリ名など補足情報' },
      },
      required: ['date', 'distance'],
    },
  },
  {
    name: 'create_plan',
    description: '週別トレーニング計画を作成してデータベースに保存する。必ず週次サマリーと全7日分の日次計画を含めること。',
    input_schema: {
      type: 'object',
      properties: {
        week_start: { type: 'string', description: '週開始日（月曜）YYYY-MM-DD' },
        target_km: { type: 'number', description: '週間目標距離(km)' },
        phase: { type: 'string', description: 'トレーニングフェーズ名' },
        long_run_km: { type: 'number', description: 'ロング走距離(km)' },
        daily_plans: {
          type: 'array',
          description: '全7日分の日次計画（レスト含む）',
          items: {
            type: 'object',
            properties: {
              date: { type: 'string', description: 'YYYY-MM-DD' },
              type: { type: 'string', description: 'ジョグ/ロング走/テンポ走/インターバル/レスト/筋トレ' },
              km: { type: 'number', description: '距離(km)。レストはnull可' },
              note: { type: 'string', description: 'メモ' },
            },
            required: ['date', 'type'],
          },
        },
      },
      required: ['week_start', 'target_km', 'daily_plans'],
    },
  },
  {
    name: 'set_race',
    description: '目標レースを設定または変更する。既存の目標レースは上書きされる。',
    input_schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'レース名' },
        date: { type: 'string', description: '開催日 YYYY-MM-DD' },
        distance: { type: 'string', description: 'フルマラソン/ハーフマラソン等' },
        goal_time: { type: 'string', description: '目標タイム' },
      },
      required: ['name', 'date'],
    },
  },
];

export async function POST(request: Request) {
  const { messages, userId, accessToken, lastMessageImages } = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );

  // コンテキスト取得
  let contextData = '';
  if (userId && accessToken) {
    const { data: races } = await supabase.from('races').select('*').eq('user_id', userId).order('date', { ascending: true }).limit(1);
    const { data: plans } = await supabase.from('plans').select('*').eq('user_id', userId).order('week_start', { ascending: true });
    const { data: runs } = await supabase.from('runs').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(5);
    const today = new Date().toISOString().split('T')[0];
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: dailyPlans } = await supabase.from('daily_plans').select('*').eq('user_id', userId).gte('date', today).lte('date', future).order('date', { ascending: true });

    if (races && races.length > 0) contextData += '\n【目標大会】' + races[0].name + ' (' + races[0].date + ') 目標: ' + races[0].goal_time;
    if (plans && plans.length > 0) contextData += '\n【週別計画】' + plans.map(p => p.week_start + ': ' + p.phase + ' ' + p.target_km + 'km').join(', ');
    if (runs && runs.length > 0) contextData += '\n【最近の記録】' + runs.map(r => r.date + ': ' + r.distance + 'km').join(', ');
    if (dailyPlans && dailyPlans.length > 0) contextData += '\n【今後の日次計画】' + dailyPlans.map(p => p.date + ': ' + p.type + (p.km ? ' ' + p.km + 'km' : '')).join(', ');
  }

  const systemPrompt = 'あなたはRunPlanのAIランニングコーチです。\n\n役割：\n- ユーザーと会話しながらトレーニング計画を作成・調整\n- 記録へのフィードバック・応援・褒める\n- 天気や体調に合わせた代替メニュー提案\n- 走力向上のアドバイス\n\n' +
    (contextData ? '【ユーザーの現在の状況】' + contextData + '\n\n' : '') +
    '【ツール使用ルール】\n・ランニング記録の画像が共有されたとき：分析を行い、save_runツールで必ず保存すること\n・ユーザーが「記録して」「保存して」「登録して」などと言ったとき：save_runツールを呼ぶこと\n・トレーニング計画を提案するとき：create_planツールで週次＋全7日分の日次計画を保存すること\n・目標レースを設定・変更するとき：set_raceツールを呼ぶこと\n\n口調：親しみやすく励ましを忘れずに。絵文字を適度に使う。';

  const claudeMessages = messages.map((m: { role: string; content: string }, idx: number) => {
    if (idx === messages.length - 1 && m.role === 'user' && lastMessageImages?.length > 0) {
      const rawText = m.content
        .replace(/📷 \d+枚の画像を送信しました/, 'ランニング記録の画像を分析し、save_runツールで記録を保存してください。')
        .replace(/^📷 \d+枚の画像\n/, '');
      return {
        role: m.role,
        content: [
          ...lastMessageImages.map((img: { mediaType: string; base64: string }) => ({
            type: 'image',
            source: { type: 'base64', media_type: img.mediaType, data: img.base64 },
          })),
          { type: 'text', text: rawText || 'ランニング記録の画像を分析し、save_runツールで記録を保存してください。' },
        ],
      };
    }
    return { role: m.role, content: m.content };
  });

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4000,
    tools: TOOLS,
    tool_choice: { type: 'auto' },
    system: systemPrompt,
    messages: claudeMessages,
  });

  // テキスト返答を抽出
  const reply = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map(b => b.text)
    .join('');

  // ツール呼び出しをサーバー側で実行
  const toolBlocks = response.content.filter(
    (b): b is Anthropic.ToolUseBlock => b.type === 'tool_use'
  );

  let runSaved = false;
  let planSaved = false;

  for (const tool of toolBlocks) {
    const input = tool.input as Record<string, any>;

    if (tool.name === 'save_run' && userId) {
      const { error } = await supabase.from('runs').insert({
        user_id: userId,
        date: input.date,
        distance: input.distance,
        duration: input.duration ?? null,
        pace: input.pace ?? null,
        heart_rate: input.heart_rate ?? null,
        note: input.note ?? null,
      });
      if (!error) runSaved = true;
      else console.error('save_run error:', error);
    }

    if (tool.name === 'create_plan' && userId) {
      const { week_start, target_km, phase, long_run_km, daily_plans } = input;
      await supabase.from('plans').delete().eq('user_id', userId).eq('week_start', week_start);
      await supabase.from('plans').insert({ user_id: userId, week_start, target_km, phase: phase ?? null, long_run_km: long_run_km ?? null });
      if (daily_plans?.length > 0) {
        const dates = daily_plans.map((p: any) => p.date);
        await supabase.from('daily_plans').delete().eq('user_id', userId).in('date', dates);
        await supabase.from('daily_plans').insert(daily_plans.map((p: any) => ({ ...p, user_id: userId })));
      }
      planSaved = true;
    }

    if (tool.name === 'set_race' && userId) {
      await supabase.from('races').delete().eq('user_id', userId);
      const { error } = await supabase.from('races').insert({ user_id: userId, ...input });
      if (error) console.error('set_race error:', error);
    }
  }

  return Response.json({ reply, runSaved, planSaved });
}
