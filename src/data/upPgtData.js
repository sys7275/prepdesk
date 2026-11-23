export const upPgtExam = {
  id: "pgt",
  name: "UP PGT (2026)",
  category: "upessc",
  totalQuestions: 120,
  totalMarks: 360,
  interviewMarks: 40,
  marksPerQuestion: 3,
  negativeMarking: 1,
  durationMinutes: 120,
  years: [
    {
      year: 2026,
      dates: [
        { date: "09 May 2026", shifts: ["Shift 1", "Shift 2"], sets: ["Set-A", "Set-B", "Set-C", "Set-D"] },
        { date: "10 May 2026", shifts: ["Shift 1", "Shift 2"], sets: ["Set-A", "Set-B", "Set-C", "Set-D"] },
      ],
    },
    {
      year: 2021,
      dates: [
        { date: "17 Aug 2021", shifts: ["Shift 1", "Shift 2"], sets: ["Set-A", "Set-B", "Set-C", "Set-D"] },
        { date: "18 Aug 2021", shifts: ["Shift 1", "Shift 2"], sets: ["Set-A", "Set-B", "Set-C", "Set-D"] },
      ],
    },
    {
      year: 2019,
      dates: [
        { date: "Feb 2019", shifts: ["Shift 1", "Shift 2"], sets: ["Set-A", "Set-B", "Set-C", "Set-D"] },
      ],
    },
  ],
};