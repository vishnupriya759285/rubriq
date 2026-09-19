export type ReviewState = "Ready" | "Needs a look" | "In progress";

export const cohorts = [
  { id: "c1", name: "Biology · Year 11", learners: 28, next: "Ecology lab report", trend: 7 },
  { id: "c2", name: "Biology · Year 10", learners: 31, next: "Cell systems", trend: 4 },
  { id: "c3", name: "Science seminar", learners: 16, next: "Independent inquiry", trend: 12 },
];

export const assessments = [
  { id: "a1", title: "Ecology: field study", cohort: "Biology · Year 11", submitted: 24, total: 28, state: "Ready" as ReviewState, date: "Due 24 Sep" },
  { id: "a2", title: "Cell systems checkpoint", cohort: "Biology · Year 10", submitted: 31, total: 31, state: "Needs a look" as ReviewState, date: "Reviewed today" },
  { id: "a3", title: "Independent inquiry", cohort: "Science seminar", submitted: 9, total: 16, state: "In progress" as ReviewState, date: "Due 2 Oct" },
];

export const reviewQueue = [
  { initials: "AM", learner: "Amara Mensah", work: "Ecology: field study", note: "Evidence for criterion 3 is unclear", score: "16 / 20", priority: "Review required" },
  { initials: "JK", learner: "Jayden Khan", work: "Cell systems checkpoint", note: "Handwriting confidence is low on page 2", score: "12 / 15", priority: "Review suggested" },
  { initials: "SR", learner: "Sofia Rossi", work: "Ecology: field study", note: "Teacher reconsideration requested", score: "18 / 20", priority: "Teacher note" },
];

export const conceptSignals = [
  { name: "Interdependence", value: 82, tone: "good" },
  { name: "Evidence & reasoning", value: 69, tone: "steady" },
  { name: "Data interpretation", value: 56, tone: "watch" },
];
