const pad = (n) => String(n).padStart(2, "0");

const parseTime = (t) => {
  return {
    hours: parseInt(t.slice(0, 2)),
    minutes: parseInt(t.slice(2, 4)),
    seconds: parseInt(t.slice(4, 6)),
  };
};

const timeToMinutes = ({ hours, minutes }) => hours * 60 + minutes;

const minutesToTimeStr = (total) => {
  const h = pad(Math.floor(total / 60));
  const m = pad(total % 60);
  return `${h}${m}00`;
};

export function generateSchedule({
  plots,
  motors,
  startTime,
  endTime,
  runtime,
  interval,
}) {
  plots = parseInt(plots);
  motors = parseInt(motors);
  runtime = parseInt(runtime);
  interval = parseInt(interval);

  const start = timeToMinutes(parseTime(startTime));
  const end = timeToMinutes(parseTime(endTime));
  const cycleLength = runtime + interval;

  let timeCursor = start;
  let index = 0;
  const schedule = [];
  let plotIndex = 0;
  while (timeCursor + runtime <= end) {
    for (let m = 0; m < motors; m++) {
      const plot = plotIndex % plots;
      const startTimeStr = minutesToTimeStr(timeCursor);
      const endTimeStr = minutesToTimeStr(timeCursor + runtime);

      schedule.push({
        index: index++,
        plot: `D${plot + 1}`,
        startTime: startTimeStr,
        endTime: endTimeStr,
        runBy: `M${m + 1}`,
      });

      plotIndex++;
    }
    timeCursor += runtime + interval;
  }

  return schedule;
}
