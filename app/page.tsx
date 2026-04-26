export default function Home() {
  const race = {
    name: "東京マラソン2027",
    date: "2027-03-21",
    daysLeft: 329,
  };

  const thisWeek = {
    planned: 4,
    done: 2,
    totalKm: 28,
    doneKm: 14,
  };

  const nextSession = {
    day: "明日（火曜）",
    type: "ロング走",
    km: 16,
  };

  return (
    <main style={{ fontFamily: "sans-serif", maxWidth: 480, margin: "0 auto", padding: "24px 16px" }}>

      {/* ヘッダー */}
      <h1 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>RunPlan</h1>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>今日も一歩ずつ</p>

      {/* 大会カード */}
      <div style={{ background: "#1a1a2e", color: "#fff", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <p style={{ fontSize: 12, opacity: 0.7, marginBottom: 4 }}>目標大会</p>
        <p style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>{race.name}</p>
        <p style={{ fontSize: 36, fontWeight: "bold", lineHeight: 1 }}>{race.daysLeft}<span style={{ fontSize: 16, fontWeight: "normal", marginLeft: 4 }}>日後</span></p>
      </div>

      {/* 次のトレーニング */}
      <div style={{ background: "#f0f9f4", borderRadius: 16, padding: "20px 24px", marginBottom: 16 }}>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 4 }}>次のトレーニング</p>
        <p style={{ fontSize: 16, fontWeight: "bold", color: "#1a1a1a" }}>{nextSession.day}</p>
        <p style={{ fontSize: 14, color: "#2d8a5e" }}>{nextSession.type}　{nextSession.km}km</p>
      </div>

      {/* 今週の達成率 */}
      <div style={{ background: "#fafafa", border: "1px solid #eee", borderRadius: 16, padding: "20px 24px" }}>
        <p style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>今週の進捗</p>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 14 }}>トレーニング回数</span>
          <span style={{ fontSize: 14, fontWeight: "bold" }}>{thisWeek.done} / {thisWeek.planned}回</span>
        </div>
        <div style={{ background: "#eee", borderRadius: 99, height: 8, marginBottom: 16 }}>
          <div style={{ background: "#2d8a5e", borderRadius: 99, height: 8, width: `${(thisWeek.done / thisWeek.planned) * 100}%` }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 14 }}>距離</span>
          <span style={{ fontSize: 14, fontWeight: "bold" }}>{thisWeek.doneKm} / {thisWeek.totalKm}km</span>
        </div>
        <div style={{ background: "#eee", borderRadius: 99, height: 8, marginTop: 8 }}>
          <div style={{ background: "#2d8a5e", borderRadius: 99, height: 8, width: `${(thisWeek.doneKm / thisWeek.totalKm) * 100}%` }} />
        </div>
      </div>

    </main>
  );
}

