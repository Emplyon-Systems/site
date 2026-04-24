const STORAGE_KEY = 'emplyon_site_visits_v1';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { events: [], byDay: {} };
    const data = JSON.parse(raw);
    return {
      events: Array.isArray(data.events) ? data.events : [],
      byDay: data.byDay && typeof data.byDay === 'object' ? data.byDay : {},
    };
  } catch {
    return { events: [], byDay: {} };
  }
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/** Regista uma vista de página (apenas no browser — modo demo até existir API). */
export function recordPageView(pathname) {
  const data = load();
  const day = new Date().toISOString().slice(0, 10);
  data.events.push({ path: pathname, t: Date.now() });
  if (data.events.length > 3000) {
    data.events = data.events.slice(-3000);
  }
  data.byDay[day] = (data.byDay[day] || 0) + 1;
  save(data);
  window.dispatchEvent(new Event('emplyon-analytics'));
}

export function getAnalyticsSummary() {
  const { events, byDay } = load();
  const today = new Date().toISOString().slice(0, 10);
  const todayCount = byDay[today] || 0;

  const last7 = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    last7.push({ date: key, count: byDay[key] || 0 });
  }

  const pathCounts = {};
  for (const ev of events) {
    pathCounts[ev.path] = (pathCounts[ev.path] || 0) + 1;
  }
  const topPaths = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([path, count]) => ({ path, count }));

  return {
    totalPageviews: events.length,
    todayPageviews: todayCount,
    last7Days: last7,
    topPaths,
  };
}
