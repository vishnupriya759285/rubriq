"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, Bell, BookOpen, Check, ChevronRight, ClipboardCheck, FileUp, GraduationCap, LayoutDashboard, Menu, Plus, Search, Settings, Sparkles, Users, X } from "lucide-react";
import { assessments, cohorts, conceptSignals, reviewQueue } from "@/lib/domain";

type View = "Today" | "Classes" | "Assessments" | "Review" | "Insights";

const navigation = [
  ["Today", LayoutDashboard], ["Classes", Users], ["Assessments", ClipboardCheck], ["Review", BookOpen], ["Insights", Sparkles],
] as const;

export function Workspace() {
  const [view, setView] = useState<View>("Today");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const title = view === "Today" ? "Good morning, Mira." : view;
  const subtitle = view === "Today" ? "Here is what needs your attention today." : `A considered view of your ${view.toLowerCase()}.`;
  const page = useMemo(() => {
    if (view === "Classes") return <Classes onCreate={() => setNotice("New class draft opened")} />;
    if (view === "Assessments") return <Assessments onCreate={() => setNotice("Assessment builder opened")} />;
    if (view === "Review") return <Review onComplete={() => setNotice("Paper marked as reviewed")} />;
    if (view === "Insights") return <Insights />;
    return <Today onReview={() => setView("Review")} onCreate={() => setNotice("Assessment builder opened")} />;
  }, [view]);

  return <main className="shell">
    <aside className={`sidebar ${drawerOpen ? "open" : ""}`}>
      <div className="brand"><span className="brand-mark">r</span><span>rubriq</span></div>
      <p className="workspace-label">Mira&apos;s teaching room</p>
      <nav>{navigation.map(([label, Icon]) => <button key={label} className={view === label ? "nav-item active" : "nav-item"} onClick={() => { setView(label); setDrawerOpen(false); }}><Icon size={18}/>{label}{label === "Review" && <span className="nav-count">3</span>}</button>)}</nav>
      <div className="sidebar-bottom"><button className="nav-item"><Settings size={18}/>Settings</button><div className="profile"><div className="avatar sage">MP</div><div><strong>Mira Patel</strong><small>Teacher</small></div><ChevronRight size={16}/></div></div>
    </aside>
    <section className="content">
      <header className="topbar"><button className="icon-button mobile-only" aria-label="Open navigation" onClick={() => setDrawerOpen(!drawerOpen)}><Menu size={20}/></button><div className="crumb"><span>Teaching room</span><ChevronRight size={15}/><strong>{view}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Search"><Search size={19}/></button><button className="icon-button notification" aria-label="Notifications"><Bell size={19}/><i /></button><button className="avatar-button" aria-label="Profile">MP</button></div></header>
      <div className="page-heading"><div><p className="eyebrow">{view === "Today" ? "Tuesday, 19 September" : "Rubriq workspace"}</p><h1>{title}</h1><p>{subtitle}</p></div>{view !== "Review" && <button className="primary" onClick={() => setNotice(view === "Classes" ? "New class draft opened" : "Assessment builder opened")}><Plus size={18}/>{view === "Classes" ? "New class" : "New assessment"}</button>}</div>
      {notice && <div className="toast"><Check size={16}/>{notice}<button onClick={() => setNotice("")} aria-label="Dismiss"><X size={16}/></button></div>}
      {page}
    </section>
  </main>;
}

function Today({ onReview, onCreate }: { onReview: () => void; onCreate: () => void }) {
  return <><section className="focus-card"><div><p className="eyebrow">YOUR FOCUS</p><h2>Three papers are waiting for your eye.</h2><p>Two have a detail worth checking. Your final judgment remains the one that counts.</p><button className="light-button" onClick={onReview}>Open review queue <ArrowUpRight size={16}/></button></div><div className="focus-orbit"><span>3</span><small>to review</small></div></section><section className="metric-grid"><Metric value="78%" label="Class understanding" note="Across recent work"/><Metric value="24" label="Papers assessed" note="This week"/><Metric value="2.6h" label="Time returned" note="Faster than last week"/></section><section className="split-grid"><Queue onReview={onReview}/><Concepts/></section><section className="section-head"><div><p className="eyebrow">ASSESSMENTS</p><h2>Keep the work moving</h2></div><button className="text-button" onClick={onCreate}>Create assessment <Plus size={15}/></button></section><AssessmentTable /></>;
}
function Metric({ value, label, note }: { value: string; label: string; note: string }) { return <article className="metric"><strong>{value}</strong><span>{label}</span><small>{note}</small></article>; }
function Queue({ onReview }: { onReview: () => void }) { return <section className="panel"><div className="panel-heading"><div><p className="eyebrow">REVIEW QUEUE</p><h2>Awaiting your decision</h2></div><button className="round-button" onClick={onReview}><ArrowUpRight size={17}/></button></div><div className="queue-list">{reviewQueue.map(item => <button className="queue-row" key={item.learner} onClick={onReview}><div className="avatar clay">{item.initials}</div><div className="queue-copy"><strong>{item.learner}</strong><span>{item.work}</span><small>{item.note}</small></div><div className="queue-score"><em>{item.priority}</em><b>{item.score}</b></div><ChevronRight size={18}/></button>)}</div></section>; }
function Concepts() { return <section className="panel concepts"><div className="panel-heading"><div><p className="eyebrow">LEARNING PULSE</p><h2>Year 11 biology</h2></div><button className="round-button"><ArrowUpRight size={17}/></button></div><p className="muted">Based on released assessments</p>{conceptSignals.map(signal => <div className="signal" key={signal.name}><div><span>{signal.name}</span><b>{signal.value}%</b></div><div className="meter"><i className={signal.tone} style={{width: `${signal.value}%`}}/></div></div>)}<p className="insight-note"><Sparkles size={16}/>Data interpretation could use a short revisit before the next field study.</p></section>; }
function AssessmentTable() { return <section className="table-card"><div className="table-head"><span>Assessment</span><span>Submissions</span><span>Status</span><span /></div>{assessments.map(item => <div className="assessment-row" key={item.id}><div><strong>{item.title}</strong><small>{item.cohort} · {item.date}</small></div><span>{item.submitted} <small>/ {item.total}</small></span><span><i className={`status-dot ${item.state.replaceAll(" ", "-").toLowerCase()}`}/>{item.state}</span><button className="round-button"><ChevronRight size={17}/></button></div>)}</section>; }
function Classes({ onCreate }: { onCreate: () => void }) { return <section className="class-grid">{cohorts.map(cohort => <article className="class-card" key={cohort.id}><div className="class-art"><GraduationCap size={30}/><span>+{cohort.trend}%</span></div><p className="eyebrow">ACTIVE CLASS</p><h2>{cohort.name}</h2><p>{cohort.learners} learners · Next up: {cohort.next}</p><div><button className="secondary">Open class</button><button className="icon-button" onClick={onCreate}><Plus size={18}/></button></div></article>)}</section>; }
function Assessments({ onCreate }: { onCreate: () => void }) { return <><section className="builder-callout"><FileUp size={27}/><div><h2>Build an assessment from your materials</h2><p>Bring a question paper or begin with a clear marking plan. Rubriq creates an editable draft for your approval.</p></div><button className="primary" onClick={onCreate}>Start building</button></section><AssessmentTable /></>; }
function Review({ onComplete }: { onComplete: () => void }) { const [index, setIndex] = useState(0); const current = reviewQueue[index]; return <section className="review-workbench"><div className="paper-pane"><div className="paper-toolbar"><span>Page 2 of 3</span><div><button className="icon-button">−</button><button className="icon-button">+</button></div></div><div className="paper"><p>Name: {current.learner}</p><h3>Ecology field study</h3><p className="handwriting">The data suggests that biodiversity rises when the woodland edge has less disturbance...</p><span className="evidence">Evidence selected for criterion 3</span><p className="handwriting small">This is because more species have a suitable habitat and food source.</p></div></div><div className="mark-pane"><div className="review-top"><p className="eyebrow">{current.work}</p><h2>{current.learner}</h2><span className="review-index">{index + 1} of {reviewQueue.length}</span></div><div className="criterion"><div><span>Criterion 3</span><b>Explains a relationship using evidence</b></div><strong>4 <small>/ 5</small></strong></div><div className="flag"><Sparkles size={17}/><div><strong>{current.priority}</strong><p>{current.note}. Check the highlighted answer before releasing.</p></div></div><label>Teacher note<textarea placeholder="Add context for this decision…" /></label><div className="review-actions"><button className="secondary" onClick={() => setIndex((index + 1) % reviewQueue.length)}>Next paper</button><button className="primary" onClick={onComplete}>Confirm mark <Check size={17}/></button></div></div></section>; }
function Insights() { return <section className="insights-page"><div className="insight-hero"><div><p className="eyebrow">TERM VIEW</p><h2>Understanding is growing steadily.</h2><p>Year 11 biology has improved 7% across the last three assessment moments.</p></div><strong>78<small>%</small></strong></div><div className="chart-panel"><div><p className="eyebrow">CONCEPT PERFORMANCE</p><h2>Where to teach next</h2></div><div className="bar-chart">{conceptSignals.concat([{name:"Scientific vocabulary", value:74, tone:"good"}]).map((item, i) => <div key={item.name} className="bar"><i className={item.tone} style={{height:`${item.value}%`}}/><span>{item.name}</span><b>{item.value}%</b></div>)}</div></div></section>; }
