const datesFor = (year, month, days) => days.map((day) => ({
  date: `${String(day).padStart(2, "0")} ${month} ${year}`,
  slug: `${String(month === "January" ? 1 : month === "February" ? 2 : month === "August" ? 8 : month === "September" ? 9 : month === "October" ? 10 : month === "November" ? 11 : 12).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
  shifts: ["Shift 1", "Shift 2", "Shift 3"],
}));

export const railwayGroupD = {
  id: "group-d",
  title: "RRB Group D",
  description: "Level 1 computer-based test papers, organized by year and exam date.",
  correct: "+1",
  wrong: "-1/3",
  unanswered: "0",
  years: [
    { year: "2026", months: [{ month: "August", dates: datesFor(2026, "August", [3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 17, 18, 19, 20, 21, 25]) }] },
    { year: "2025", months: [
      { month: "January", dates: datesFor(2025, "January", [8, 9]) },
      { month: "February", dates: datesFor(2025, "February", [2, 3, 4, 5, 6, 9, 10]) },
      { month: "November", dates: datesFor(2025, "November", [27, 28]) },
      { month: "December", dates: datesFor(2025, "December", [2, 3, 4, 5, 8, 9, 10, 11, 12, 14, 15, 16, 17, 19, 21, 22, 23, 26, 27, 29, 30]) },
    ] },
    { year: "2022", stage: "Level 1", months: [
      { month: "September", dates: datesFor(2022, "September", [1, 2, 5, 8, 9, 12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 26, 27, 28, 29, 30]) },
      { month: "August", dates: datesFor(2022, "August", [17, 18, 22, 23, 25, 26, 29, 30]) },
      { month: "October", dates: datesFor(2022, "October", [6, 7, 11]) },
    ] },
  ],
};