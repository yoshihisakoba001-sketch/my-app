export type WeatherData = {
  temp: number;
  weatherCode: number;
  emoji: string;
  description: string;
};

export type DailyWeather = {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
  emoji: string;
  description: string;
};

const getWeatherEmoji = (code: number): { emoji: string; description: string } => {
  if (code === 0) return { emoji: '☀️', description: '快晴' };
  if (code <= 2) return { emoji: '🌤️', description: '晴れ' };
  if (code <= 3) return { emoji: '☁️', description: '曇り' };
  if (code <= 48) return { emoji: '🌫️', description: '霧' };
  if (code <= 57) return { emoji: '🌧️', description: '霧雨' };
  if (code <= 67) return { emoji: '🌧️', description: '雨' };
  if (code <= 77) return { emoji: '❄️', description: '雪' };
  if (code <= 82) return { emoji: '🌦️', description: 'にわか雨' };
  if (code <= 99) return { emoji: '⛈️', description: '雷雨' };
  return { emoji: '🌡️', description: '不明' };
};

export const getWeather = async (lat: number, lon: number): Promise<WeatherData | null> => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=Asia/Tokyo`
    );
    const data = await res.json();
    const temp = Math.round(data.current.temperature_2m);
    const code = data.current.weather_code;
    const { emoji, description } = getWeatherEmoji(code);
    return { temp, weatherCode: code, emoji, description };
  } catch {
    return null;
  }
};

export const getWeatherForecast = async (lat: number, lon: number): Promise<DailyWeather[]> => {
  try {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Asia/Tokyo&forecast_days=14`
    );
    const data = await res.json();
    return data.daily.time.map((date: string, i: number) => {
      const code = data.daily.weather_code[i];
      const { emoji, description } = getWeatherEmoji(code);
      return {
        date,
        maxTemp: Math.round(data.daily.temperature_2m_max[i]),
        minTemp: Math.round(data.daily.temperature_2m_min[i]),
        weatherCode: code,
        emoji,
        description,
      };
    });
  } catch {
    return [];
  }
};

export const getUserLocation = (): Promise<{ lat: number; lon: number } | null> => {
  return new Promise(resolve => {
    if (!navigator.geolocation) {
      resolve({ lat: 35.6762, lon: 139.6503 });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => resolve({ lat: 35.6762, lon: 139.6503 }),
      { timeout: 5000 }
    );
  });
};