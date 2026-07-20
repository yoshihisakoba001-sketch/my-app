import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';

const client = new Anthropic();

export async function POST(request: Request) {
  const { messages, userId, accessToken, lastMessageImages } = await request.json();

  // トークンを使ってユーザー認証済みクライアントを作成
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    }
  );

  let contextData = '';
  if (userId && accessToken) {
    const { data: races } = await supabase
      .from('races')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: true })
      .limit(1);

    const { data: plans } = await supabase
      .from('plans')
      .select('*')
      .eq('user_id', userId)
      .order('week_start', { ascending: true });

    const { data: runs } = await supabase
      .from('runs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .limit(5);

    const today = new Date().toISOString().split('T')[0];
    const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const { data: dailyPlans } = await supabase
      .from('daily_plans')
      .select('*')
      .eq('user_id', userId)
      .gte('date', today)
      .lte('date', future)
      .order('date', { ascending: true });

    if (races && races.length > 0) {
      contextData += '\n【目標大会】' + races[0].name + ' (' + races[0].date + ') 目標: ' + races[0].goal_time;
    }
    if (plans && plans.length > 0) {
      contextData += '\n【週別計画】' + plans.map(p => p.week_start + ': ' + p.phase + ' ' + p.target_km + 'km').join(', ');
    }
    if (runs && runs.length > 0) {
      contextData += '\n【最近の記録】' + runs.map(r => r.date + ': ' + r.distance + 'km').join(', ');
    }
    if (dailyPlans && dailyPlans.length > 0) {
      contextData += '\n【今後の日次計画】' + dailyPlans.map(p => p.date + ': ' + p.type + (p.km ? ' ' + p.km + 'km' : '')).join(', ');
    }
  }

  const systemPrompt = 'あなたはRunPlanのAIランニングコーチです。\n\n役割：\n- ユーザーと会話しながらトレーニング計画を作成・調整\n- 記録へのフィードバック・応援・褒める\n- 天気や体調に合わせた代替メニュー提案\n- 走力向上のアドバイス\n\n' +
    (contextData ? '【ユーザーの現在の状況】' + contextData + '\n\n' : '') +
    '【データ保存のルール — 必ず守ること】\n\n■ 走行記録（画像あり）\nランニング記録の画像が共有されたとき：分析・フィードバックを行い、その返答の末尾に必ず[RUN_DATA]タグを出力し「この内容で記録しますか？」と確認を求めること。ユーザーが確認済みの場合や、画像なしでテキストだけで記録を求められた場合も同様に出力すること。一度[RUN_DATA]を出力した後、ユーザーが「はい」「お願いします」などと言っても再出力しないこと（二重保存防止）。\n\n[RUN_DATA]{"date":"YYYY-MM-DD","distance":数値(km),"duration":"H:MM:SS","pace":"M:SS","heart_rate":数値(bpm)またはnull,"note":"メモ"}[/RUN_DATA]\n\n■ トレーニング計画\n週別計画を作成・提案するときは、[PLAN_DATA]と[DAILY_PLAN_DATA]を必ずセットで出力すること。[DAILY_PLAN_DATA]は提案する週の全日（月〜日）を含めること（レストデーも含む）。どちらか片方だけ出力することは禁止。\n\n[PLAN_DATA][{"week_start":"YYYY-MM-DD（月曜日）","target_km":数値,"phase":"フェーズ名","long_run_km":数値}][/PLAN_DATA]\n[DAILY_PLAN_DATA][{"date":"YYYY-MM-DD","type":"ジョグ/ロング走/テンポ走/インターバル/レスト/筋トレ","km":数値またはnull,"note":"メモ"},…（7日分）][/DAILY_PLAN_DATA]\n\n■ その他\n大会を設定した場合：\n[RACE_DATA]{"name":"大会名","date":"YYYY-MM-DD","distance":"フルマラソン","goal_time":"目標タイム"}[/RACE_DATA]\n\n全タグは返答テキストの末尾にまとめて出力すること。開始タグと終了タグは必ずセットで使うこと。JSONは必ず有効な形式で出力すること。\n\n口調：親しみやすく励ましを忘れずに。絵文字を適度に使う。';

  const claudeMessages = messages.map((m: { role: string; content: string }, idx: number) => {
    if (idx === messages.length - 1 && m.role === 'user' && lastMessageImages?.length > 0) {
      const rawText = m.content
        .replace(/📷 \d+枚の画像を送信しました/, 'これらの画像のトレーニング内容を詳しく分析してください。1kmごとのペース、心拍数の推移、総合的な評価とアドバイスをお願いします。')
        .replace(/^📷 \d+枚の画像\n/, '');
      return {
        role: m.role,
        content: [
          ...lastMessageImages.map((img: { mediaType: string; base64: string }) => ({
            type: 'image',
            source: { type: 'base64', media_type: img.mediaType, data: img.base64 },
          })),
          { type: 'text', text: rawText || 'これらの画像のトレーニング内容を分析してください。' },
        ],
      };
    }
    return { role: m.role, content: m.content };
  });

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 4000,
    system: systemPrompt,
    messages: claudeMessages,
  });

  const fullReply = response.content[0].type === 'text' ? response.content[0].text : '';

  // データ抽出（書き込みはせずフロントに返す）
  let runData = null;
  let raceData = null;
  let planData = null;
  let dailyPlanData = null;

  const runMatch = fullReply.match(/\[RUN_DATA\]([\s\S]*?)\[\/RUN_DATA\]/);
  if (runMatch) {
    try { runData = JSON.parse(runMatch[1]); } catch (e) { console.error('Run parse error:', e); }
  }

  const raceMatch = fullReply.match(/\[RACE_DATA\]([\s\S]*?)\[\/RACE_DATA\]/);
  if (raceMatch) {
    try { raceData = JSON.parse(raceMatch[1]); } catch (e) { console.error('Race parse error:', e); }
  }

  const planMatch = fullReply.match(/\[PLAN_DATA\]([\s\S]*?)\[\/PLAN_DATA\]/);
  if (planMatch) {
    try { planData = JSON.parse(planMatch[1]); } catch (e) { console.error('Plan parse error:', e); }
  }

  const dailyPlanMatch = fullReply.match(/\[DAILY_PLAN_DATA\]([\s\S]*?)\[\/DAILY_PLAN_DATA\]/);
  if (dailyPlanMatch) {
    try { dailyPlanData = JSON.parse(dailyPlanMatch[1]); } catch (e) { console.error('DailyPlan parse error:', e); }
  }

  const reply = fullReply
    .replace(/\[RUN_DATA\][\s\S]*?(\[\/RUN_DATA\]|$)/g, '')
    .replace(/\[RACE_DATA\][\s\S]*?(\[\/RACE_DATA\]|$)/g, '')
    .replace(/\[PLAN_DATA\][\s\S]*?(\[\/PLAN_DATA\]|$)/g, '')
    .replace(/\[DAILY_PLAN_DATA\][\s\S]*?(\[\/DAILY_PLAN_DATA\]|$)/g, '')
    .trim();

  return Response.json({ reply, runData, raceData, planData, dailyPlanData });
}