import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./Statistic.css";
import { useState, useEffect } from "react";

interface TotalJournal {
  current_month_journal: number;
}

interface WordsWrittenItem {
  total_words_written: number;
}

interface CommonMoods {
  mood: string;
  count: number;
}

interface CurrentStreak {
  current_streak: number;
}

interface WritingRhythmItem {
  day: number;
  total: number;
}

interface WeeklyGoal {
  week_progress: number;
}

export default function Statistic() {
  const [stats, setStats] = useState<TotalJournal>({
    current_month_journal: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [currentStreak, setCurrentStreak] = useState<CurrentStreak>({
    current_streak: 0,
  });

  const [wordsWritten, setWordsWritten] = useState<WordsWrittenItem>({
    total_words_written: 0,
  });

  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyGoal>({
    week_progress: 0,
  });

  const [CommonMoods, setCommonMoods] = useState<CommonMoods>({
    mood: "",
    count: 0,
  });

  const [writingRhythm, setWritingRhythm] = useState<WritingRhythmItem[]>([]);

  const today = new Date(); //get date
  const monthLabel = today.toLocaleDateString("en", {
    //get month and year
    month: "long",
    year: "numeric",
  });
  const monthOffset =
    (new Date(today.getFullYear(), today.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0,
  ).getDate();
  const calendarDays: Array<number | null> = [
    ...Array.from({ length: monthOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const daysWithEntries = new Set(
    writingRhythm.filter((item) => item.total > 0).map((item) => item.day),
  );
  useEffect(() => {
    const fetchStats = async () => {
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      };

      try {
        const [
          statsResponse,
          streakResponse,
          wordsResponse,
          writingRhythmResponse,
          commonMoodResponse,
        ] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/statistics", { headers }),
          fetch("http://127.0.0.1:8000/api/streak", { headers }),
          fetch("http://127.0.0.1:8000/api/statistics/words", { headers }),
          fetch("http://127.0.0.1:8000/api/statistics/writing-rhythm", {
            headers,
          }),
          fetch("http://127.0.0.1:8000/api/statistics/common-mood", {headers,}),
        ]);

        if (
          !statsResponse.ok ||
          !streakResponse.ok ||
          !wordsResponse.ok ||
          !writingRhythmResponse.ok ||
          !commonMoodResponse.ok
        ) {
          throw new Error(
            `Request failed: statistics ${statsResponse.status}, streak ${streakResponse.status}, words ${wordsResponse.status}, writing rhythm ${writingRhythmResponse.status}, common mood ${commonMoodResponse.status}`
          );
        }

        const [statsData, streakData, wordsData, rhythmData, CommonMoods] =
          await Promise.all([
            statsResponse.json(),
            streakResponse.json(),
            wordsResponse.json(),
            writingRhythmResponse.json(),
            commonMoodResponse.json(),
          ]);

        setWordsWritten({
          total_words_written: wordsData.total_words_written ?? 0,
        });

        setStats({
          current_month_journal: statsData.current_month_journals ?? 0,
        });

        setCurrentStreak({
          current_streak: streakData.current_streak ?? 0,
        });

        setCommonMoods({
          mood: CommonMoods.mood ?? "No entries yet",
          count: CommonMoods.count ?? 0,
        });

        setWeeklyProgress({ week_progress: streakData.week_progress ?? 0 });
        setWritingRhythm(
          rhythmData.map((item: WritingRhythmItem) => ({
            day: Number(item.day),
            total: Number(item.total),
          })),
        );
      } catch (error) {
        console.error("Failed to get the journal entries", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="container">
      <div className="statistic-title">
        <h1>Statistics</h1>
        <p>A gentle look at the thoughts and habits you've been building</p>
      </div>
      <div className="stats-overview">
        <div className="card">
          <h3>ENTRIES THIS MONTH</h3>
          <h1>{loading ? "..." : stats.current_month_journal}</h1>
        </div>
        <div className="card">
          <div className="streak">
            <h3>WRITING STREAK</h3>
            <h1>{loading ? "..." : `${currentStreak.current_streak} days`}</h1>
          </div>
        </div>
        <div className="card">
          <div className="total-words-written">
            <h3>WORDS WRITTEN</h3>
            <h1>{loading ? "..." : wordsWritten.total_words_written}</h1>
          </div>
        </div>
        <div className="card">
          <div className="weekly-goal">
            <h3>WEEKLY GOALS</h3>
            <h1>
              {loading ? "..." : `${weeklyProgress.week_progress} of 7 days`}
            </h1>
          </div>
        </div>
        <section className="writing-rhythm-card">
          <div className="writing-rhythm-heading">
            <h2>Your writing rhythm</h2>
            <p>Journal entries by day this month</p>
          </div>
          <div className="writing-rhythm-chart">
            {writingRhythm.length === 0 ? (
              <p className="writing-rhythm-empty">
                No journal entries this month yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={writingRhythm}
                  margin={{ top: 12, right: 12, left: 0, bottom: 4 }}
                >
                  <CartesianGrid stroke="#e8edef" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#71808a", fontSize: 12 }}
                    width={28}
                  />
                  <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#71808a", fontSize: 12 }}
                    width={28}
                  />
                  <Tooltip
                    labelFormatter={(day) => `Day ${day}`}
                    formatter={(value) => [value, "Journal entries"]}
                  />
                  <Bar
                    dataKey="total"
                    name="Journal entries"
                    fill="#70a893"
                    radius={[7, 7, 0, 0]}
                    maxBarSize={38}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>
        <section
          className="calendar-card"
          aria-label={`Journal activity for ${monthLabel}`}
        >
          <div className="calendar-heading">
            <h2>Days you showed up</h2>
            <p>A small mark for every page</p>
          </div>
          <div className="calendar-grid">
            {["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].map((day) => (
              <div className="calendar-weekday" key={day}>
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => (
              <div className="calendar-cell" key={`${monthLabel}-${index}`}>
                {day !== null && (
                  <span
                    className={
                      daysWithEntries.has(day)
                        ? "calendar-date has-entry"
                        : "calendar-date"
                    }
                    aria-label={`${monthLabel} ${day}${daysWithEntries.has(day) ? ", journal entry" : ""}`}
                    title={
                      daysWithEntries.has(day) ? "Journal entry" : undefined
                    }
                  >
                    {daysWithEntries.has(day) && (
                      <span className="calendar-entry-dot" aria-hidden="true" />
                    )}
                    {day}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
        <section className="card-mood">
          <div className="mood-header">
            <h3>MOST COMMON WORD</h3>
          </div>
          <div className="shows-common-mood">
            <div className="common-mood">
              {loading ? "..." : `${CommonMoods.mood}`}
            </div>
            <div className="total-common-mood">
              <p>in</p>
              {loading ? "..." : `${CommonMoods.count}`}
              <p>entries</p>
            </div>
          </div>
        </section>
        <section className="note-yourself">
          <h3>A NOTE TO YOURSELF</h3>
          <p>"Your thoughts are worth the time to write them."</p>
        </section>
      </div>
    </div>
  );
}
