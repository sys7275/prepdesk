const tgtSubjects = [
  "Hindi",
  "Mathematics",
  "Science",
  "Social Science",
  "English",
  "Biology",
  "Commerce",
  "Sanskrit",
  "Home Science",
  "Music",
  "Physical Education",
];

export const upTgtExam = {
  id: "tgt",
  name: "UP TGT (2026)",
  category: "upessc",
  totalQuestions: 120,
  totalMarks: 360,
  marksPerQuestion: 3,
  negativeMarking: 1,
  durationMinutes: 120,
  years: [
    {
      year: 2026,
      dates: [
        { date: "03/06/2026", shifts: ["Shift 1", "Shift 2"] },
        { date: "04/06/2026", shifts: ["Shift 1", "Shift 2"] },
      ],
      subjects: tgtSubjects.map((name) => ({
        name,
        sets: ["Set-A", "Set-B", "Set-C", "Set-D"],
      })),
    },
    {
      year: 2021,
      dates: [
        { date: "07/08/2021", shifts: ["Shift 1", "Shift 2"] },
        { date: "08/08/2021", shifts: ["Shift 1", "Shift 2"] },
      ],
      subjects: tgtSubjects.map((name) => ({
        name,
        sets: ["Set-A", "Set-B", "Set-C", "Set-D"],
      })),
    },
    {
      year: 2019,
      dates: [
        { date: "March 2019", shifts: ["Shift 1", "Shift 2"] },
      ],
      subjects: tgtSubjects.map((name) => ({
        name,
        sets: ["Set-A", "Set-B", "Set-C", "Set-D"],
      })),
    },
  ],
};