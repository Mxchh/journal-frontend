import "./StreakCard.css";

interface StreakProps {
  current_streak: number;
  week_progress: number;
  week_days: boolean[];
}

export default function StreakCard({
  current_streak,
  week_progress,
  week_days,
}: StreakProps) {
  const dayNames = ["M", "T", "W", "T", "F", "S", "S"];

  const last7Dates = [...Array(7)].map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    return date.getDate();
  });

  return (
    <div className="streak-card">
      <div className="streak-header">
        <div>
          <div className="streak-card-header">
            <p className="streak-title">YOUR WRITING STREAK</p>
            <div className="fire">🔥</div>
          </div>

          <h1>
            {current_streak} <span>days in a row</span>
          </h1>

          <p>You're building a lovely habit</p>
        </div>

        <div className="week-days">
          {dayNames.map((day, index) => (
            <div key={index} className="day-wrapper">
              <p>{day}</p>
              <div
                className={`day-circle ${week_days[index] ? "completed" : ""}`}
              >
                {week_days[index] ? "✓" : ""}
              </div>

              <small>{last7Dates[index]}</small>
            </div>
          ))}
        </div>
        <div className="week-progress">
          <div className="week-progress-days">
            <p>This week</p>
            <div>{week_progress} of 7 days</div>
          </div>
          <div className="progress-line">
            <div
              className="progress-fill"
              style={{ width: `${(week_progress / 7) * 100}%` }}
            ></div>
          </div>
          <p>
            {week_progress === 7
              ? "Weekly goal completed 🎉"
              : `${7 - week_progress} more entries to reach your weekly goal`}
          </p>
        </div>
        <div className="streak-message">
          <h4>✦ One page at a time.</h4>
          <p>Your next entry keeps the streak going.</p>
        </div>
      </div>
    </div>
  );
}
