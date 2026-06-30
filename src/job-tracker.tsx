import { useState, useEffect } from "react";
import { Briefcase, Users, Plus, Trash2, Edit2, X, TrendingUp, MapPin, Calendar, ExternalLink, FileText, Target, Award, Loader, Wand2, CheckCircle2, Circle, Copy, Check, Download, Search, LayoutGrid, Table as TableIcon, ArrowUpDown, Bell, AlertTriangle, Clock, Star, Filter, MessageSquarePlus, Send, Sun, Compass, Crown, Building2, Sparkles, User, AlertCircle, Upload, Gauge, Mail, Link } from "lucide-react";

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);
import * as mammoth from "mammoth";

// ====== STATUS ======
const STATUS_OPTIONS = ["Saved", "Missed to apply", "Applied", "Screening", "Assessment", "Interview 1", "Interview 2", "Interview 3", "Interview 4+", "Final round", "Offer", "Rejected", "Ghosted", "Withdrawn"];
const STATUS_COLORS = {
  Saved: "bg-amber-100 text-amber-900 border-amber-300",
  "Missed to apply": "bg-slate-200 text-slate-700 border-slate-400",
  Applied: "bg-purple-100 text-purple-900 border-purple-300",
  Screening: "bg-violet-100 text-violet-900 border-violet-300",
  Assessment: "bg-fuchsia-100 text-fuchsia-900 border-fuchsia-300",
  "Interview 1": "bg-yellow-100 text-yellow-900 border-yellow-300",
  "Interview 2": "bg-yellow-200 text-yellow-900 border-yellow-400",
  "Interview 3": "bg-amber-200 text-amber-900 border-amber-400",
  "Interview 4+": "bg-orange-200 text-orange-900 border-orange-400",
  "Final round": "bg-orange-300 text-orange-950 border-orange-500",
  Offer: "bg-emerald-100 text-emerald-900 border-emerald-300",
  Rejected: "bg-rose-100 text-rose-900 border-rose-300",
  Ghosted: "bg-slate-300 text-slate-800 border-slate-500",
  Withdrawn: "bg-slate-100 text-slate-600 border-slate-300",
};
const STATUS_GROUPS = [
  { label: "All", values: null },
  { label: "Saved", values: ["Saved"] },
  { label: "Missed", values: ["Missed to apply"] },
  { label: "Applied", values: ["Applied"] },
  { label: "In progress", values: ["Screening", "Assessment", "Interview 1", "Interview 2", "Interview 3", "Interview 4+", "Final round"] },
  { label: "Offer", values: ["Offer"] },
  { label: "Closed", values: ["Rejected", "Ghosted", "Withdrawn"] },
];

const TOP_FIRMS = ["McKinsey & Company", "BCG", "Bain & Company", "Deloitte", "Accenture", "PA Consulting", "EY", "PwC", "KPMG", "Oliver Wyman", "Kearney", "Roland Berger", "LEK", "OC&C", "Capgemini", "IBM Consulting"];

const TIER_COLORS = {
  "Strong fit": "border-emerald-400 bg-emerald-50 text-emerald-800",
  "Stretch (referral helps)": "border-amber-400 bg-amber-50 text-amber-800",
  "Reach": "border-orange-400 bg-orange-50 text-orange-800",
  "Worth a look": "border-purple-400 bg-purple-50 text-purple-800",
  "Low priority": "border-slate-300 bg-slate-100 text-slate-700",
  "Blocked (clearance)": "border-rose-400 bg-rose-50 text-rose-800",
  "Unclear": "border-slate-300 bg-slate-100 text-slate-700",
};

const SPONSOR_LIKELY_FIRMS = new Set(["Accenture", "Deloitte", "PwC", "KPMG", "EY", "BCG", "Cognizant", "Capgemini", "IBM Consulting", "IQVIA", "GSK", "Aviva", "BNY", "Siemens Energy", "WSP", "Gartner", "Tencent", "LVMH", "Revolut", "Celonis", "Salesforce", "McKinsey & Company", "Bain & Company", "Oliver Wyman", "Kearney", "Roland Berger"]);

const LEVEL_OPTIONS = ["Intern", "Analyst/BA", "Associate", "Consultant", "Senior Consultant", "Manager", "Senior Manager", "Director+", "Other"];

const SPONSOR_COLORS = {
  Confirmed: "border-emerald-400 bg-emerald-50 text-emerald-800",
  Likely: "border-purple-400 bg-purple-50 text-purple-800",
  Unknown: "border-slate-300 bg-slate-100 text-slate-700",
  Unlikely: "border-rose-400 bg-rose-50 text-rose-800",
};

// ====== FIRM CATEGORY ======
const FIRM_CATEGORY: Record<string, string> = {
  "McKinsey & Company": "Tier 1 (MBB)", "McKinsey": "Tier 1 (MBB)",
  "BCG": "Tier 1 (MBB)", "Boston Consulting Group": "Tier 1 (MBB)",
  "Bain & Company": "Tier 1 (MBB)", "Bain": "Tier 1 (MBB)",
  "Deloitte": "Tier 2 (Big 4 / Major)", "PwC": "Tier 2 (Big 4 / Major)",
  "EY": "Tier 2 (Big 4 / Major)", "EY-Parthenon": "Tier 2 (Big 4 / Major)", "KPMG": "Tier 2 (Big 4 / Major)",
  "Accenture": "Tier 2 (Big 4 / Major)", "Accenture Strategy": "Tier 2 (Big 4 / Major)", "Accenture Song": "Tier 2 (Big 4 / Major)",
  "Oliver Wyman": "Tier 2 (Big 4 / Major)", "Kearney": "Tier 2 (Big 4 / Major)",
  "Strategy&": "Tier 2 (Big 4 / Major)", "PwC Strategy&": "Tier 2 (Big 4 / Major)",
  "Roland Berger": "Tier 2 (Big 4 / Major)", "LEK": "Tier 2 (Big 4 / Major)", "L.E.K.": "Tier 2 (Big 4 / Major)", "L.E.K. Consulting": "Tier 2 (Big 4 / Major)",
  "AlixPartners": "Tier 2 (Big 4 / Major)", "Alvarez & Marsal": "Tier 2 (Big 4 / Major)",
  "Arthur D. Little": "Tier 2 (Big 4 / Major)",
  "Cognizant": "Tier 3 (Mid-tier / IT)", "Capgemini": "Tier 3 (Mid-tier / IT)",
  "Capgemini Invent": "Tier 3 (Mid-tier / IT)", "IBM Consulting": "Tier 3 (Mid-tier / IT)",
  "Infosys": "Tier 3 (Mid-tier / IT)", "Infosys Consulting": "Tier 3 (Mid-tier / IT)",
  "TCS": "Tier 3 (Mid-tier / IT)", "Wipro": "Tier 3 (Mid-tier / IT)",
  "HCL": "Tier 3 (Mid-tier / IT)", "Tech Mahindra": "Tier 3 (Mid-tier / IT)",
  "Slalom": "Tier 3 (Mid-tier / IT)", "Publicis Sapient": "Tier 3 (Mid-tier / IT)",
  "PA Consulting": "Boutique", "Baringa": "Boutique", "Newton (Europe)": "Boutique", "Newton": "Boutique", "Newton Europe": "Boutique",
  "Simon-Kucher": "Boutique", "OC&C": "Boutique", "OC&C Strategy": "Boutique", "Altman Solon": "Boutique",
  "North Highland": "Boutique", "Sia Partners": "Boutique", "Elixirr": "Boutique",
  "Charles River Associates": "Boutique", "Teneo": "Boutique", "Advancy": "Boutique",
  "Management Solutions": "Boutique", "Berkeley Partnership": "Boutique",
  "Edge Consulting": "Boutique", "Credera": "Boutique", "Q5": "Boutique",
  "GSK": "In-house / Industry", "AstraZeneca": "In-house / Industry", "IQVIA": "In-house / Industry",
  "Bupa": "In-house / Industry", "Aviva": "In-house / Industry", "BT": "In-house / Industry",
  "Lloyds Banking Group": "In-house / Industry", "Barclays": "In-house / Industry", "HSBC": "In-house / Industry",
  "Revolut": "In-house / Industry", "BNY": "In-house / Industry", "Salesforce": "In-house / Industry",
  "WSP": "In-house / Industry", "Siemens Energy": "In-house / Industry", "LVMH": "In-house / Industry",
  "Tencent": "In-house / Industry", "Gartner": "In-house / Industry", "Celonis": "In-house / Industry",
  "Corti": "In-house / Industry", "Avado": "In-house / Industry", "Quaisr": "In-house / Industry",
  "Tiffany & Co.": "In-house / Industry", "Google (UK)": "In-house / Industry", "Amazon (UK)": "In-house / Industry",
  "Microsoft (UK)": "In-house / Industry", "Palantir (UK)": "In-house / Industry", "ServiceNow (UK)": "In-house / Industry",
};

function firmCategory(company) {
  if (!company) return "Other";
  if (FIRM_CATEGORY[company]) return FIRM_CATEGORY[company];
  const key = Object.keys(FIRM_CATEGORY).find(k => company.toLowerCase().startsWith(k.toLowerCase()) || k.toLowerCase().startsWith(company.toLowerCase()));
  return key ? FIRM_CATEGORY[key] : "Other";
}

const CATEGORY_OPTIONS = ["Tier 1 (MBB)", "Tier 2 (Big 4 / Major)", "Tier 3 (Mid-tier / IT)", "Boutique", "In-house / Industry", "Other"];

const CATEGORY_COLORS = {
  "Tier 1 (MBB)": "border-purple-500 bg-purple-100 text-purple-900",
  "Tier 2 (Big 4 / Major)": "border-amber-500 bg-amber-100 text-amber-900",
  "Tier 3 (Mid-tier / IT)": "border-yellow-500 bg-yellow-100 text-yellow-900",
  "Boutique": "border-fuchsia-400 bg-fuchsia-50 text-fuchsia-800",
  "In-house / Industry": "border-emerald-400 bg-emerald-50 text-emerald-800",
  "Other": "border-slate-300 bg-slate-50 text-slate-700",
};

// ====== RECOMMENDED FIRMS ======
const RECOMMENDED_FIRMS = [
  { name: "McKinsey & Company", category: "Tier 1 (MBB)", sponsor: "Likely", notes: "Sponsors at Associate (MBA) level. London is a major MBA hire hub. Case-interview prep essential.", site: "https://www.mckinsey.com/careers" },
  { name: "BCG", category: "Tier 1 (MBB)", sponsor: "Likely", notes: "Sponsors at Consultant (MBA) level. London office hires from Imperial. Casing + experience hire pathway both open.", site: "https://careers.bcg.com" },
  { name: "Bain & Company", category: "Tier 1 (MBB)", sponsor: "Likely", notes: "Sponsors MBA Associate Consultants. Smaller London cohort vs MBB peers, very competitive.", site: "https://www.bain.com/careers/find-a-role/" },
  { name: "Deloitte", category: "Tier 2 (Big 4 / Major)", sponsor: "Likely", notes: "Sponsors broadly. Strongest fit given your alumna status. Strategy, Consulting, Digital all sponsor.", site: "https://apply.deloitte.co.uk/UKCareers/JobSearch" },
  { name: "PwC", category: "Tier 2 (Big 4 / Major)", sponsor: "Likely", notes: "Sponsors most consulting roles. Strategy& is the boutique-style sub-brand.", site: "https://jobs.pwc.co.uk/uk/en/search-results" },
  { name: "EY", category: "Tier 2 (Big 4 / Major)", sponsor: "Likely", notes: "Sponsors at Consultant+ levels. EY-Parthenon is the strategy arm.", site: "https://careers.ey.com/ey/search/" },
  { name: "KPMG", category: "Tier 2 (Big 4 / Major)", sponsor: "Likely", notes: "Sponsors widely. Healthcare Advisory and Tech Transformation are your best fits.", site: "https://www.kpmgcareers.co.uk/jobs/" },
  { name: "Accenture", category: "Tier 2 (Big 4 / Major)", sponsor: "Likely", notes: "Sponsors widely except clearance-required roles. Strategy and S&C are your target practices.", site: "https://www.accenture.com/gb-en/careers/jobsearch" },
  { name: "Accenture Song", category: "Tier 2 (Big 4 / Major)", sponsor: "Likely", notes: "Accenture's creative/CX arm — digital strategy + design crossover.", site: "https://www.accenture.com/gb-en/careers/jobsearch" },
  { name: "Oliver Wyman", category: "Tier 2 (Big 4 / Major)", sponsor: "Likely", notes: "Sponsors MBA Associates. Strong in FS, retail, health. Smaller than MBB but similar prestige.", site: "https://careers.oliverwyman.com/" },
  { name: "Kearney", category: "Tier 2 (Big 4 / Major)", sponsor: "Likely", notes: "Sponsors MBA hires. Strong in ops, retail, industrial sectors.", site: "https://www.kearney.com/careers" },
  { name: "Roland Berger", category: "Tier 2 (Big 4 / Major)", sponsor: "Likely", notes: "European strategy house. London office sponsors. Smaller MBA cohort.", site: "https://www.rolandberger.com/en/Careers/" },
  { name: "L.E.K. Consulting", category: "Tier 2 (Big 4 / Major)", sponsor: "Likely", notes: "Strong in LS/healthcare/pharma — fits your background. Sponsors MBA Associates.", site: "https://www.lek.com/careers" },
  { name: "AlixPartners", category: "Tier 2 (Big 4 / Major)", sponsor: "Likely", notes: "Turnaround/restructuring focus. Some practices need finance/accounting depth.", site: "https://www.alixpartners.com/careers/" },
  { name: "Alvarez & Marsal", category: "Tier 2 (Big 4 / Major)", sponsor: "Likely", notes: "Turnaround + digital. Digital & Tech Services practice fits you. Internship pathway available.", site: "https://careers.alvarezandmarsal.com/" },
  { name: "Arthur D. Little", category: "Tier 2 (Big 4 / Major)", sponsor: "Likely", notes: "Oldest strategy firm globally. Innovation + tech strategy focus.", site: "https://www.adlittle.com/en/careers" },
  { name: "Cognizant", category: "Tier 3 (Mid-tier / IT)", sponsor: "Likely", notes: "Mid-tier IT consulting. Strong sponsor for tech profiles. Consulting Manager roles a good level for you.", site: "https://careers.cognizant.com/uki-en/jobs/" },
  { name: "Capgemini Invent", category: "Tier 3 (Mid-tier / IT)", sponsor: "Likely", notes: "Capgemini's strategy/digital arm. Better fit than SAP BTP-heavy parent reqs.", site: "https://www.capgemini.com/gb-en/careers/" },
  { name: "IBM Consulting", category: "Tier 3 (Mid-tier / IT)", sponsor: "Likely", notes: "Major tech transformation player. Salesforce, AI, hybrid cloud practices.", site: "https://www.ibm.com/uk-en/employment" },
  { name: "Infosys Consulting", category: "Tier 3 (Mid-tier / IT)", sponsor: "Likely", notes: "Sponsors broadly. INSTEP MBA programme is a structured entry pathway.", site: "https://www.infosys.com/careers/" },
  { name: "Publicis Sapient", category: "Tier 3 (Mid-tier / IT)", sponsor: "Likely", notes: "Digital business transformation. Strong in retail/FS, growing in LS.", site: "https://www.publicissapient.com/careers" },
  { name: "Slalom", category: "Tier 3 (Mid-tier / IT)", sponsor: "Likely", notes: "Strong Salesforce partner — your 21x certs are a real edge.", site: "https://www.slalom.com/careers" },
  { name: "PA Consulting", category: "Boutique", sponsor: "Likely", notes: "UK-HQ strategy + innovation. Energy, health, defence (clearance-gated) practices.", site: "https://jobs.paconsulting.com/" },
  { name: "Baringa", category: "Boutique", sponsor: "Likely", notes: "UK-strong; energy, FS, customer & ops practices. Sponsors at most levels.", site: "https://www.baringa.com/en/careers/" },
  { name: "Newton Europe", category: "Boutique", sponsor: "Likely", notes: "Pure operational improvement consultancy — ops MBA + process-efficiency wins map directly.", site: "https://www.newtoneurope.com/careers/" },
  { name: "Simon-Kucher", category: "Boutique", sponsor: "Likely", notes: "Pricing/commercial strategy specialist. CPQ + commercial pharma experience translates.", site: "https://www.simon-kucher.com/en/careers" },
  { name: "OC&C Strategy", category: "Boutique", sponsor: "Likely", notes: "Consumer, retail, TMT strategy boutique. Industry mismatch unless pivoting.", site: "https://www.occstrategy.com/en/careers" },
  { name: "Altman Solon", category: "Boutique", sponsor: "Worth checking", notes: "TMT-only strategy. Industry mismatch unless pivoting to telecoms/media.", site: "https://www.altmansolon.com/careers" },
  { name: "North Highland", category: "Boutique", sponsor: "Likely", notes: "Change management + transformation specialist. Strong adjacency to your adoption/workshop work.", site: "https://careers.northhighland.com/" },
  { name: "Sia Partners", category: "Boutique", sponsor: "Likely", notes: "French boutique with strong UK presence. Energy & utilities a fit.", site: "https://www.sia-partners.com/en/careers" },
  { name: "Elixirr", category: "Boutique", sponsor: "Worth checking", notes: "London-listed challenger consultancy. Smaller, hires selectively.", site: "https://www.elixirr.com/en-gb/careers/" },
  { name: "Charles River Associates", category: "Boutique", sponsor: "Worth checking", notes: "Economics/litigation strategy. Quant-heavy; may need econ background.", site: "https://careers.crai.com/" },
  { name: "Teneo", category: "Boutique", sponsor: "Likely", notes: "Strategic comms + advisory. Different from pure strategy but adjacent.", site: "https://www.teneo.com/careers/open-positions/" },
  { name: "Berkeley Partnership", category: "Boutique", sponsor: "Worth checking", notes: "Independent UK transformation boutique. Small, very experienced consultants.", site: "https://www.berkeleypartnership.com/careers/" },
  { name: "Credera", category: "Boutique", sponsor: "Likely", notes: "UK tech consultancy. Solid digital strategy / tech delivery roles.", site: "https://www.credera.com/en-gb/careers" },
  { name: "Q5", category: "Boutique", sponsor: "Worth checking", notes: "Org change / behaviour boutique. UK presence.", site: "https://www.q5partners.com/careers/" },
  { name: "Edge Consulting", category: "Boutique", sponsor: "Worth checking", notes: "Pharma/LS-specialist boutique — directly relevant industry-wise.", site: "https://www.edge-consulting.com/" },
  { name: "Salesforce", category: "In-house / Industry", sponsor: "Likely", notes: "Sponsors at Manager+ levels. Your 21x certs + Health Cloud + Agentforce experience is strong (e.g. CSM-LS roles).", site: "https://careers.salesforce.com/en/jobs/?country=United%20Kingdom" },
  { name: "GSK", category: "In-house / Industry", sponsor: "Likely", notes: "Major UK pharma. In-house digital/PM roles a strong industry fit.", site: "https://jobs.gsk.com/en-gb" },
  { name: "AstraZeneca", category: "In-house / Industry", sponsor: "Likely", notes: "UK-listed pharma giant. Strong in-house digital + data roles.", site: "https://careers.astrazeneca.com/" },
  { name: "IQVIA", category: "In-house / Industry", sponsor: "Likely", notes: "LS-focused — consulting arm is a strong industry-aligned bet.", site: "https://jobs.iqvia.com/en/" },
  { name: "Bupa", category: "In-house / Industry", sponsor: "Likely", notes: "UK health insurer + private healthcare. Digital transformation roles.", site: "https://jobs.bupa.com/" },
  { name: "Aviva", category: "In-house / Industry", sponsor: "Likely", notes: "Major UK insurer. Digital portfolio / transformation roles open.", site: "https://www.aviva.com/careers/" },
  { name: "BT", category: "In-house / Industry", sponsor: "Likely", notes: "UK telecoms — large digital transformation function.", site: "https://www.bt.com/careers/" },
  { name: "Lloyds Banking Group", category: "In-house / Industry", sponsor: "Likely", notes: "Major UK bank. Significant in-house consulting and transformation function.", site: "https://www.lloydsbankinggroup.com/careers/" },
  { name: "Barclays", category: "In-house / Industry", sponsor: "Likely", notes: "UK-HQ bank. Strategy & Transformation teams sponsor.", site: "https://search.jobs.barclays/" },
  { name: "HSBC", category: "In-house / Industry", sponsor: "Likely", notes: "Global bank, UK-HQ. Sponsors widely.", site: "https://www.hsbc.com/careers" },
  { name: "Google (UK)", category: "In-house / Industry", sponsor: "Likely", notes: "Sponsors. Strategy & operations / cloud customer engineering roles.", site: "https://careers.google.com/jobs/results/?location=United+Kingdom" },
  { name: "Amazon (UK)", category: "In-house / Industry", sponsor: "Likely", notes: "Sponsors. AWS Professional Services + Strategy roles fit your tech background.", site: "https://www.amazon.jobs/en/locations/united-kingdom" },
  { name: "Microsoft (UK)", category: "In-house / Industry", sponsor: "Likely", notes: "Sponsors. Industry Solutions Delivery + Cloud Solution Architect roles relevant.", site: "https://careers.microsoft.com/v2/global/en/locations/united-kingdom" },
  { name: "Celonis", category: "In-house / Industry", sponsor: "Likely", notes: "Process mining leader. Value engineer / solution consultant roles fit your ops focus.", site: "https://careers.celonis.com/" },
  { name: "Palantir (UK)", category: "In-house / Industry", sponsor: "Likely", notes: "Heavy on tech + data, much UK work is defence/clearance-gated (verify).", site: "https://www.palantir.com/careers/" },
  { name: "ServiceNow (UK)", category: "In-house / Industry", sponsor: "Likely", notes: "Enterprise platform. Solution consulting / value advisory roles.", site: "https://careers.servicenow.com/" },
];

// ====== HELPERS ======
function estimateSponsorship(app) {
  if (app.sponsorship) return app.sponsorship;
  const tier = app.tier || "";
  const notes = (app.notes || "").toLowerCase();
  if (tier.includes("clearance") || notes.includes("clearance") || notes.includes("defence")) return "Unlikely";
  if (SPONSOR_LIKELY_FIRMS.has(app.company)) return "Likely";
  return "Unknown";
}

function inferLevel(app) {
  if (app.level) return app.level;
  const r = (app.role || "").toLowerCase();
  if (r.includes("intern")) return "Intern";
  if (r.includes("senior manager")) return "Senior Manager";
  if (r.includes("associate director") || r.includes("director")) return "Director+";
  if (r.includes("senior consultant")) return "Senior Consultant";
  if (r.includes("manager")) return "Manager";
  if (r.includes("senior associate")) return "Associate";
  if (r.includes("consultant")) return "Consultant";
  if (r.includes("analyst")) return "Analyst/BA";
  if (r.includes("associate")) return "Associate";
  return "Other";
}

function linkedinSearchUrl(company) { return "https://www.linkedin.com/search/results/people/?keywords=" + encodeURIComponent(company); }
function linkedinJobUrl(role, company, location) {
  const q = [role, company].filter(Boolean).join(" ");
  return "https://www.linkedin.com/jobs/search/?keywords=" + encodeURIComponent(q) + "&location=" + encodeURIComponent(location || "London");
}

const TIER_SCORE = { "Strong fit": 40, "Stretch (referral helps)": 28, "Worth a look": 20, "Reach": 12, "Unclear": 10, "Low priority": 5, "Blocked (clearance)": 0 };

const HONEST_RUBRIC = "SCORING PHILOSOPHY:\n" +
  "You are helping an MBA candidate decide where to invest application effort. MBAs are explicitly hired for cross-functional, generalist capability — lateral moves are the whole point of the degree. Your role is OPTIMISTIC HONESTY: assess realistic possibility of a switch given transferable skills, not exact resume-to-JD match. The goal is to help the candidate prioritize and rectify gaps, not discourage them.\n\n" +
  "THE THREE-AXIS SWITCH FRAMEWORK:\n" +
  "Every role asks the candidate to switch across some combination of three axes vs their current background:\n" +
  "  1. ROLE — different function (e.g. tech delivery -> strategy consulting; IC -> people manager; consulting -> in-house)\n" +
  "  2. INDUSTRY — different sector (e.g. healthcare -> financial services; pharma commercial -> pharma R&D is 'adjacent', not full switch)\n" +
  "  3. LOCATION/MARKET — different geography or market dynamics\n\n" +
  "Score the difficulty of the combined switch, weighted by transferable skills:\n" +
  "  - 0 switches (direct extension): 8-10. Bullseye to strong fit.\n" +
  "  - 1 switch: 7-9. Very achievable. One axis of stretch with rest being direct fit. This is what MBAs do well.\n" +
  "  - 2 switches: 5-7. Achievable with effort. Needs strong cover letter and/or referral. Realistic for a motivated MBA.\n" +
  "  - 3 switches (all axes different): 3-5. Hard reach. Possible only with exceptional transferable evidence or a unique angle.\n\n" +
  "PARTIAL SWITCHES MATTER:\n" +
  "  - 'Adjacent industry' (e.g. healthcare -> life sciences, pharma commercial -> pharma R&D, B2B SaaS -> enterprise tech) counts as ~0.5 switch, not full.\n" +
  "  - 'Adjacent role' (e.g. tech architect -> tech-led strategy consultant, delivery lead -> change management) counts as ~0.5 switch.\n" +
  "  - 'Adjacent location' (e.g. India -> UK with strong English + global client experience) counts as ~0.5 switch.\n" +
  "  - Sum partial switches together. Two adjacents = ~1 full switch.\n\n" +
  "CALIBRATION RULES:\n" +
  "1. MBA is a recognized signal of management readiness, lateral mobility, and fast learning. Do NOT penalize 'career switching' aggressively — it is the explicit purpose of the degree.\n" +
  "2. Transferable skills count fully. Executive workshops = stakeholder management. Multi-year client delivery = stakeholder + project management. Building a CRM business case = strategic thinking + financial modeling. Credit these even when the role/industry is different.\n" +
  "3. Seniority match: An MBA + 5 yrs prior experience is appropriate for Manager and Senior Consultant levels. Do not artificially cap unless the role requires Director-level scope (managing managers, P&L ownership, 10+ yrs).\n" +
  "4. Hard blockers are real but rare: security clearance (residency-gated), mandatory specific certs the candidate cannot obtain in time, or citizenship requirements. ONLY here do you cap at 3 and flag a blocker. Most JDs do not have true hard blockers.\n" +
  "5. Articulation is not qualification — a polished CV does not justify a higher score if underlying experience is misaligned. But the inverse is also true: a thin CV with strong underlying experience should not be penalized for weak writing.\n" +
  "6. Do not default to 7-8 OR to 4-5. Use the full range. A 9 is a real possibility for direct-extension roles. A 5 is a real possibility for two-axis switches. Both are legitimate, useful prioritization signals.\n" +
  "7. State the realistic outcome plainly. 'Strong shortlist candidate' vs 'Will need a referral to clear screening' vs 'Likely auto-rejected at ATS' vs 'Stretch — apply only if you have a unique angle.'\n\n" +
  "SCORING ANCHORS:\n" +
  "  10 = Bullseye. Direct extension of past role, all must-haves with quantified evidence. Auto-shortlist.\n" +
  "  8-9 = Strong fit. 0-1 axes of switch. Realistic shortlist candidate with a competent application.\n" +
  "  6-7 = Plausible fit. 1-2 switches with strong transferable skills. Achievable with a good cover and/or referral.\n" +
  "  4-5 = Stretch. 2-3 switches with some transferable angle. Needs strong narrative + ideally an advocate inside.\n" +
  "  2-3 = Reach. 3-axis switch with limited transferable skills, OR hard blockers in place.\n" +
  "  1 = Mismatch. Wrong function, wrong industry, no transferable angle, or definitive hard blocker.\n\n" +
  "Remember: this is a prioritization tool. The candidate needs accurate signal to allocate their time wisely. Be honest about what is hard, but optimistic about what is possible.";
const STATUS_SCORE = { Saved: 10, "Missed to apply": -50, Applied: 15, Screening: 20, Assessment: 25, "Interview 1": 28, "Interview 2": 32, "Interview 3": 36, "Interview 4+": 40, "Final round": 45, Offer: 25, Rejected: -100, Ghosted: -60, Withdrawn: -100 };
const SPONSOR_SCORE = { Confirmed: 15, Likely: 8, Unknown: 3, Unlikely: -20 };

function priorityScore(a: any, level: any, sponsor: any) {
  let s = 0;
  s += TIER_SCORE[a.tier] || 0;
  s += STATUS_SCORE[a.status] || 0;
  s += SPONSOR_SCORE[sponsor] || 0;
  if (a.deadline) {
    const days = Math.ceil(((new Date(a.deadline) as any) - (new Date() as any)) / 86400000);
    if (days >= 0 && days <= 3) s += 25;
    else if (days <= 7) s += 15;
    else if (days <= 14) s += 8;
    else if (days < 0) s -= 30;
  }
  if (a.fitScore != null) s += a.fitScore;
  return s;
}

function daysUntil(date: any) { if (!date) return null; return Math.ceil(((new Date(date) as any) - (new Date() as any)) / 86400000); }
function daysSince(iso: any) { if (!iso) return null; return Math.floor(((new Date() as any) - (new Date(iso) as any)) / 86400000); }

function computeReminders(applications: any, contacts: any) {
  const out = [];
  applications.forEach(a => {
    const sponsor = a.sponsorship || estimateSponsorship(a);
    if (a.deadline && a.status === "Saved") {
      const d = daysUntil(a.deadline);
      if (d != null && d >= 0 && d <= 7) {
        out.push({ type: "deadline", urgency: d <= 2 ? "high" : "medium", appId: a.id, label: a.company + " - " + a.role, detail: d === 0 ? "Deadline today" : d === 1 ? "Deadline tomorrow" : "Deadline in " + d + " days" });
      } else if (d != null && d < 0) {
        out.push({ type: "deadline", urgency: "low", appId: a.id, label: a.company + " - " + a.role, detail: "Deadline passed " + Math.abs(d) + " days ago" });
      }
    }
    if (a.status === "Applied") {
      const sinceCreated = daysSince(a.createdAt);
      if (sinceCreated != null && sinceCreated >= 14) {
        out.push({ type: "followup", urgency: "medium", appId: a.id, label: a.company + " - " + a.role, detail: "Applied " + sinceCreated + " days ago - follow up?" });
      }
    }
    if ((a.tier === "Strong fit" || a.tier === "Stretch (referral helps)") && sponsor !== "Confirmed" && sponsor !== "Unlikely" && a.status === "Saved") {
      out.push({ type: "visa", urgency: "medium", appId: a.id, label: a.company + " - " + a.role, detail: "Top-tier role - verify visa sponsorship in JD" });
    }
    if ((a.tier === "Strong fit" || a.tier === "Stretch (referral helps)") && !a.studioData && a.status === "Saved") {
      out.push({ type: "tailor", urgency: "low", appId: a.id, label: a.company + " - " + a.role, detail: "High-priority role - run Resume Studio" });
    }
  });
  contacts.forEach(c => {
    if (c.followUp) {
      const d = daysUntil(c.followUp);
      if (d != null && d <= 0) {
        out.push({ type: "contact", urgency: "medium", label: c.name + (c.firm ? " (" + c.firm + ")" : ""), detail: d === 0 ? "Follow up today" : "Follow-up overdue by " + Math.abs(d) + " days" });
      } else if (d != null && d <= 3) {
        out.push({ type: "contact", urgency: "low", label: c.name + (c.firm ? " (" + c.firm + ")" : ""), detail: "Follow up in " + d + " days" });
      }
    }
  });
  const urgencyRank = { high: 0, medium: 1, low: 2 };
  out.sort((a, b) => urgencyRank[a.urgency] - urgencyRank[b.urgency]);
  return out;
}

// Placeholder used only if user has not yet set their profile.
const CANDIDATE_PROFILE_PLACEHOLDER = "[No profile set yet. Go to the Profile tab and paste your CV/background.]";

// No starter pack — everyone (including you) starts at 0 and builds their own list via Paste JD or Add.
const SEEDED_ROLES: any[] = [
  { company: "McKinsey & Company", role: "Associate", location: "London, UK", tier: "Strong fit", status: "Saved", notes: "MBA hiring cycle. Focus on casing and networking with alumni.", fitScore: 9, fitRationale: "Strong shortlist candidate with MBA signal and transferable strategy skills." },
  { company: "Deloitte", role: "Senior Consultant", location: "London, UK", tier: "Strong fit", status: "Saved", notes: "Alumna status helps. Strategy & Digital practices are most likely to sponsor.", fitScore: 10, fitRationale: "Bullseye match given previous experience at the firm and MBA degree." },
  { company: "BCG", role: "Consultant", location: "London, UK", tier: "Strong fit", status: "Saved", notes: "Focus on digital/transformation practice. Case prep essential.", fitScore: 8, fitRationale: "Strong fit for digital strategy; case interview performance will be the deciding factor." },
  { company: "Capgemini Invent", role: "Consultant", location: "London, UK", tier: "Stretch (referral helps)", status: "Saved", notes: "Digital transformation focus. Connect with hiring manager via LinkedIn.", fitScore: 7, fitRationale: "Plausible fit with strong tech background; referral highly recommended." },
  { company: "PA Consulting", role: "Senior Consultant", location: "London, UK", tier: "Worth a look", status: "Saved", notes: "Energy/Health practices are strong. Check JD for clearance requirements.", fitScore: 6, fitRationale: "Relevant industry experience, but may require specific methodology knowledge." },
  { company: "Oliver Wyman", role: "Associate", location: "London, UK", tier: "Reach", status: "Saved", notes: "Very competitive MBA intake. FS depth preferred.", fitScore: 5, fitRationale: "Stretch role; needs a very strong narrative to compete with industry-specific hires." },
  { company: "EY-Parthenon", role: "Consultant", location: "London, UK", tier: "Strong fit", status: "Saved", notes: "Strategy arm of EY. Focus on corporate strategy and M&A.", fitScore: 8, fitRationale: "Good seniority match; highlight financial modeling and strategic analysis." }
];

// ============== MAIN ==============
export default function JobTracker() {
  const [tab, setTab] = useState("dashboard");
  const [applications, setApplications] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAppForm, setShowAppForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [editingApp, setEditingApp] = useState<any>(null);
  const [editingContact, setEditingContact] = useState<any>(null);
  const [studioApp, setStudioApp] = useState<any>(null);
  const [showJdPaste, setShowJdPaste] = useState(false);
  const [cvs, setCvs] = useState<any[]>([]); // array of { id, label, focus, text, updatedAt }

  useEffect(() => {
    (async () => {
      try {
        const r = await window.storage.get("jobs-data");
        if (r && r.value) {
          const d = JSON.parse(r.value);
          setApplications(d.applications || []);
          setContacts(d.contacts || []);
        } else {
          // Initialize with demo contact seen in screenshot if empty
          setContacts([{ id: "seed-1", name: "Sarah Chen", firm: "BCG", role: "Senior Manager", met: "Imperial Career Fair", followUp: "2026-07-05", notes: "Discussed digital transformation practice. Mentioned MBA hiring track." }]);
        }
      } catch (e) {}
      try {
        const p = await window.storage.get("user-cvs");
        if (p && p.value) {
          const parsed = JSON.parse(p.value);
          // Backwards compatibility: if old single-string profile, migrate to first CV
          if (Array.isArray(parsed)) setCvs(parsed);
          else if (typeof parsed === "string" && parsed.trim()) {
            setCvs([{ id: Date.now().toString(), label: "Main CV", focus: "", text: parsed, updatedAt: new Date().toISOString() }]);
          }
        } else {
          // Initialize with demo CVs seen in screenshot if empty
          setCvs([
            { id: "cv-1", label: "Salesforce Architect", focus: "Tech delivery roles", text: "EDUCATION\n- MBA, Imperial College London\n- B.Tech Computer Science\n\nEXPERIENCE\nSalesforce Architect - Tech Corp\n- Led implementation of Health Cloud for global client.\n- Optimized CPQ processes saving 20% in processing time.\n- Managed team of 5 developers.\n\nSKILLS\n- 21x Salesforce Certified\n- Digital Transformation", updatedAt: new Date().toISOString() },
            { id: "cv-2", label: "Strategy Consultant", focus: "MBB cases", text: "EDUCATION\n- MBA, Imperial College London\n\nEXPERIENCE\nDelivery Lead - Global Consulting\n- Spearheaded strategic turnaround for retail client.\n- Improved operational efficiency by 15% across 4 regions.\n- Built financial models for $50M business case.", updatedAt: new Date().toISOString() }
          ]);
          // Try migrating from old single-string key
          const old = await window.storage.get("user-profile");
          if (old && old.value && old.value.trim()) {
            setCvs([{ id: Date.now().toString(), label: "Main CV", focus: "", text: old.value, updatedAt: new Date().toISOString() }]);
          }
        }
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (loading) return;
    (async () => {
      try { await window.storage.set("jobs-data", JSON.stringify({ applications, contacts })); }
      catch (e) { console.error("Save failed", e); }
    })();
  }, [applications, contacts, loading]);

  const saveCvs = async (next) => {
    setCvs(next);
    try { await window.storage.set("user-cvs", JSON.stringify(next)); } catch (e) { console.error("CV save failed", e); }
  };

  const addOrUpdateApp = (app) => {
    if (editingApp) setApplications(applications.map(a => a.id === editingApp.id ? { ...a, ...app } : a));
    else setApplications([...applications, { ...app, id: Date.now().toString(), createdAt: new Date().toISOString() }]);
    setShowAppForm(false); setEditingApp(null);
  };
  const updateAppData = (id, patch) => setApplications(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
  const addOrUpdateContact = (c) => {
    if (editingContact) setContacts(contacts.map(x => x.id === editingContact.id ? { ...x, ...c } : x));
    else setContacts([...contacts, { ...c, id: Date.now().toString() }]);
    setShowContactForm(false); setEditingContact(null);
  };
  const deleteApp = (id) => setApplications(applications.filter(a => a.id !== id));
  const deleteContact = (id) => setContacts(contacts.filter(c => c.id !== id));
  const seedRoles = () => {
    const existingUrls = new Set(applications.map(a => a.url).filter(Boolean));
    const existingKeys = new Set(applications.map(a => a.company + "|" + a.role));
    const toAdd = SEEDED_ROLES.filter(r => r.url ? !existingUrls.has(r.url) : !existingKeys.has(r.company + "|" + r.role))
      .map((r, i) => ({ ...r, id: (Date.now() + i).toString(), createdAt: new Date().toISOString() }));
    setApplications([...applications, ...toAdd]);
  };
  const addParsedJd = (parsed) => {
    setApplications(prev => [...prev, { ...parsed, id: Date.now().toString(), createdAt: new Date().toISOString(), status: "Saved" }]);
    setShowJdPaste(false);
  };

  const INTERVIEW_STATUSES = ["Screening", "Assessment", "Interview 1", "Interview 2", "Interview 3", "Interview 4+", "Final round"];
  const stats = {
    total: applications.length,
    applied: applications.filter(a => a.status === "Applied").length,
    interview: applications.filter(a => INTERVIEW_STATUSES.includes(a.status)).length,
    offer: applications.filter(a => a.status === "Offer").length,
  };

  const currentStudioApp = studioApp ? applications.find(a => a.id === studioApp) : null;

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-purple-50 flex items-center justify-center"><Loader className="w-8 h-8 text-purple-600 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-purple-50 text-slate-800">
      <header className="border-b border-amber-200 bg-white/70 backdrop-blur sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-300 via-amber-400 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-200/60">
              <Sun className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-purple-600 bg-clip-text text-transparent">LetsGetAJob</h1>
              <p className="text-xs text-slate-500">Your personal job hunt HQ</p>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto">
          {[
            { id: "dashboard", label: "Dashboard", icon: TrendingUp },
            { id: "applications", label: "Applications", icon: Briefcase },
            { id: "recommended", label: "Recommended", icon: Compass },
            { id: "contacts", label: "Network", icon: Users },
            { id: "profile", label: "Profile", icon: User },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={"flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap " + (tab === t.id ? "border-purple-600 text-purple-700" : "border-transparent text-slate-500 hover:text-slate-800")}>
              <t.icon className="w-4 h-4" />{t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === "dashboard" && <Dashboard stats={stats} applications={applications} contacts={contacts} onJumpToApplications={() => setTab("applications")} onStudio={(id) => setStudioApp(id)} />}
        {tab === "applications" && (
          <Applications applications={applications}
            cvs={cvs}
            onAdd={() => { setEditingApp(null); setShowAppForm(true); }}
            onEdit={(app) => { setEditingApp(app); setShowAppForm(true); }}
            onDelete={deleteApp}
            onStatusChange={(id, status) => updateAppData(id, { status })}
            onUpdate={updateAppData}
            onStudio={(id) => setStudioApp(id)}
            onSeed={seedRoles}
            onPasteJd={() => setShowJdPaste(true)}
          />
        )}
        {tab === "recommended" && <Recommended applications={applications} />}
        {tab === "contacts" && (
          <Contacts contacts={contacts}
            onAdd={() => { setEditingContact(null); setShowContactForm(true); }}
            onEdit={(c) => { setEditingContact(c); setShowContactForm(true); }}
            onDelete={deleteContact} />
        )}
        {tab === "profile" && <ProfileEditor cvs={cvs} onSave={saveCvs} />}
      </main>

      {showAppForm && <AppForm initial={editingApp} onSave={addOrUpdateApp} onClose={() => { setShowAppForm(false); setEditingApp(null); }} />}
      {showContactForm && <ContactForm initial={editingContact} onSave={addOrUpdateContact} onClose={() => { setShowContactForm(false); setEditingContact(null); }} />}
      {showJdPaste && <JdPasteModal profile={cvs.map((cv, i) => "=== CV: " + cv.label + (cv.focus ? " (" + cv.focus + ")" : "") + " ===\n" + cv.text).join("\n\n")} onAdd={addParsedJd} onClose={() => setShowJdPaste(false)} onGoToProfile={() => { setShowJdPaste(false); setTab("profile"); }} />}
      {currentStudioApp && <ResumeStudio app={currentStudioApp} cvs={cvs} onClose={() => setStudioApp(null)} onSave={(patch) => updateAppData(currentStudioApp.id, patch)} onGoToProfile={() => { setStudioApp(null); setTab("profile"); }} />}
    </div>
  );
}

// ============== DASHBOARD ==============
function Dashboard({ stats, applications, contacts, onJumpToApplications, onStudio }) {
  const reminders = computeReminders(applications, contacts);
  const enriched = applications.map(a => {
    const sponsor = a.sponsorship || estimateSponsorship(a);
    return { ...a, _sponsor: sponsor, _priority: priorityScore(a, inferLevel(a), sponsor) };
  });
  const ACTIVE_STATUSES = ["Saved", "Applied", "Screening", "Assessment", "Interview 1", "Interview 2", "Interview 3", "Interview 4+", "Final round", "Offer"];
  const topPriorities = enriched.filter(a => ACTIVE_STATUSES.includes(a.status)).sort((a, b) => b._priority - a._priority).slice(0, 6);
  const wallOfShame = enriched
    .map(a => {
      const dOverdue = a.deadline ? -daysUntil(a.deadline) : null;
      const isExplicitMiss = a.status === "Missed to apply";
      const isOverdueSave = a.status === "Saved" && dOverdue != null && dOverdue > 0;
      const isGhosted = a.status === "Ghosted";
      if (!isExplicitMiss && !isOverdueSave && !isGhosted) return null;
      return { ...a, _daysOverdue: dOverdue, _reason: isExplicitMiss ? "missed" : isGhosted ? "ghosted" : "expired" };
    })
    .filter(Boolean)
    .sort((a, b) => (a._daysOverdue || 9999) - (b._daysOverdue || 9999));

  const URGENCY_STYLE = {
    high: "border-rose-300 bg-rose-50 text-rose-900",
    medium: "border-amber-300 bg-amber-50 text-amber-900",
    low: "border-purple-300 bg-purple-50 text-purple-900",
  };
  const REMINDER_ICON = { deadline: AlertTriangle, followup: Clock, visa: Bell, tailor: Wand2, contact: Users };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-1 bg-gradient-to-r from-amber-600 to-purple-600 bg-clip-text text-transparent">Hello sunshine</h2>
        <p className="text-slate-600">Here is your job search pipeline at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Total" value={stats.total} color="from-amber-300 to-yellow-400" icon={Briefcase} />
        <StatCard label="Applied" value={stats.applied} color="from-purple-400 to-purple-500" icon={FileText} />
        <StatCard label="Interview" value={stats.interview} color="from-yellow-400 to-amber-500" icon={Target} />
        <StatCard label="Offers" value={stats.offer} color="from-emerald-400 to-emerald-500" icon={Award} />
        <StatCard label="Network" value={contacts.length} color="from-purple-500 to-fuchsia-500" icon={Users} />
      </div>

      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800">
          <Bell className="w-5 h-5 text-purple-600" /> Things to do
          {reminders.length > 0 && <span className="text-xs bg-gradient-to-r from-amber-500 to-purple-600 text-white px-2 py-0.5 rounded-full font-bold">{reminders.length}</span>}
        </h3>
        {reminders.length === 0 ? (
          <p className="text-slate-500 text-sm">All caught up. Nothing urgent right now.</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {reminders.map((r, i) => {
              const Icon = REMINDER_ICON[r.type] || Bell;
              return (
                <div key={i} className={"flex items-start gap-3 p-3 rounded-lg border " + URGENCY_STYLE[r.urgency]}>
                  <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{r.label}</p>
                    <p className="text-xs opacity-80 mt-0.5">{r.detail}</p>
                  </div>
                  {r.appId && r.type === "tailor" && (
                    <button onClick={() => onStudio(r.appId)} className="text-xs px-2 py-1 bg-purple-600 text-white font-semibold rounded hover:bg-purple-700 shrink-0">Tailor</button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {wallOfShame.length > 0 && (
        <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-rose-50 border-2 border-dashed border-rose-300 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold flex items-center gap-2 text-rose-700">
              Wall of Shame
              <span className="text-xs bg-rose-500 text-white px-2 py-0.5 rounded-full font-bold">{wallOfShame.length}</span>
            </h3>
          </div>
          <p className="text-xs text-slate-600 mb-4 italic">Missed deadlines, expired saves, and recruiters who ghosted you. Onwards and upwards.</p>
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {wallOfShame.map(a => {
              const badge = a._reason === "missed" ? { text: "Missed", cls: "bg-slate-200 text-slate-800 border-slate-400" }
                : a._reason === "ghosted" ? { text: "Ghosted", cls: "bg-slate-300 text-slate-800 border-slate-500" }
                : { text: a._daysOverdue === 1 ? "1 day late" : a._daysOverdue + " days late", cls: "bg-rose-100 text-rose-800 border-rose-300" };
              return (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/70 border border-rose-200">
                  <Clock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 truncate">{a.role}</p>
                    <p className="text-xs text-slate-500 truncate">{a.company} {a.tier ? "- " + a.tier : ""}</p>
                  </div>
                  <span className={"text-xs px-2 py-1 rounded-full border font-semibold whitespace-nowrap shrink-0 " + badge.cls}>{badge.text}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-slate-800"><Star className="w-5 h-5 text-amber-500" /> Top priorities</h3>
          <button onClick={onJumpToApplications} className="text-xs text-purple-600 hover:text-purple-800 font-medium">See all roles</button>
        </div>
        {topPriorities.length === 0 ? <p className="text-slate-500 text-sm">No active applications yet.</p> : (
          <div className="grid sm:grid-cols-2 gap-3">
            {topPriorities.map(a => (
              <div key={a.id} className="bg-gradient-to-br from-yellow-50 to-purple-50 border border-amber-200 rounded-lg p-3 hover:border-purple-300 transition">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-sm truncate flex-1 text-slate-800">{a.role}</p>
                  <span className="text-xs bg-gradient-to-r from-amber-500 to-purple-600 text-white px-1.5 py-0.5 rounded font-bold shrink-0">{a._priority}</span>
                </div>
                <p className="text-xs text-slate-600 truncate">{a.company}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {a.tier && <span className={"text-[10px] px-1.5 py-0.5 rounded border " + (TIER_COLORS[a.tier] || "border-slate-300")}>{a.tier}</span>}
                  <span className={"text-[10px] px-1.5 py-0.5 rounded border " + STATUS_COLORS[a.status]}>{a.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800"><TrendingUp className="w-5 h-5 text-purple-600" /> Pipeline</h3>
          {stats.total === 0 ? <p className="text-slate-500 text-sm">No applications yet.</p> : (
            <div className="space-y-3">
              {STATUS_OPTIONS.filter(s => applications.filter(a => a.status === s).length > 0).map(s => {
                const count = applications.filter(a => a.status === s).length;
                const pct = stats.total > 0 ? (count / stats.total) * 100 : 0;
                return (
                  <div key={s}>
                    <div className="flex justify-between text-sm mb-1"><span className="text-slate-700">{s}</span><span className="text-slate-500">{count}</span></div>
                    <div className="h-2 bg-amber-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-400 to-purple-500 transition-all" style={{ width: pct + "%" }} /></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-800"><Calendar className="w-5 h-5 text-purple-600" /> Recent Applications</h3>
          {applications.length === 0 ? <p className="text-slate-500 text-sm">Nothing here yet.</p> : (
            <ul className="space-y-3">
              {[...applications].sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")).slice(0, 5).map(a => (
                <li key={a.id} className="flex items-center justify-between py-2 border-b border-amber-100 last:border-0">
                  <div className="min-w-0 flex-1"><p className="font-medium truncate text-slate-800">{a.role}</p><p className="text-xs text-slate-500 truncate">{a.company}</p></div>
                  <span className={"text-xs px-2 py-1 rounded border whitespace-nowrap ml-2 " + STATUS_COLORS[a.status]}>{a.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, color, icon: Icon }) {
  return (
    <div className={"bg-gradient-to-br rounded-2xl p-4 relative overflow-hidden shadow-sm text-white " + color}>
      <Icon className="absolute right-2 top-2 w-8 h-8 text-white/30" />
      <p className="text-xs uppercase tracking-wider opacity-90">{label}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );
}

// ============== RECOMMENDED TAB ==============
function Recommended({ applications }) {
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");
  const appliedFirms = new Set(applications.map(a => a.company));

  const filtered = RECOMMENDED_FIRMS.filter(f => {
    if (catFilter !== "All" && f.category !== catFilter) return false;
    if (search.trim() && !(f.name + " " + (f.notes || "")).toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const byCategory = {};
  filtered.forEach(f => {
    if (!byCategory[f.category]) byCategory[f.category] = [];
    byCategory[f.category].push(f);
  });

  const CATEGORY_ICON = {
    "Tier 1 (MBB)": Crown,
    "Tier 2 (Big 4 / Major)": Building2,
    "Tier 3 (Mid-tier / IT)": Building2,
    "Boutique": Sparkles,
    "In-house / Industry": Briefcase,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-1 bg-gradient-to-r from-amber-600 to-purple-600 bg-clip-text text-transparent">Recommended firms</h2>
        <p className="text-slate-600">Curated UK consulting and digital strategy firms that historically sponsor international MBA candidates. Sponsor signal is a starting heuristic — verify on each JD.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-amber-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none text-slate-800"
          placeholder="Search firms by name or specialism..." />
      </div>

      <div className="flex gap-2 flex-wrap">
        {["All"].concat(CATEGORY_OPTIONS).map(c => {
          const count = c === "All" ? RECOMMENDED_FIRMS.length : RECOMMENDED_FIRMS.filter(f => f.category === c).length;
          return (
            <button key={c} onClick={() => setCatFilter(c)}
              className={"px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 " + (catFilter === c ? "bg-purple-600 text-white" : "bg-white border border-amber-300 text-slate-700 hover:border-purple-400")}>
              {c}<span className={"text-xs " + (catFilter === c ? "text-purple-200" : "text-slate-400")}>{count}</span>
            </button>
          );
        })}
      </div>

      {Object.keys(byCategory).length === 0 ? (
        <div className="text-center py-16 bg-white border border-amber-200 rounded-2xl">
          <Compass className="w-12 h-12 text-amber-300 mx-auto mb-3" />
          <p className="text-slate-500">No firms match your filter.</p>
        </div>
      ) : (
        CATEGORY_OPTIONS.filter(c => byCategory[c]).map(cat => {
          const CatIcon = CATEGORY_ICON[cat] || Building2;
          return (
            <div key={cat}>
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-slate-800">
                <CatIcon className="w-5 h-5 text-purple-600" /> {cat}
                <span className={"text-xs px-2 py-0.5 rounded border " + (CATEGORY_COLORS[cat] || "border-slate-300")}>{byCategory[cat].length}</span>
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {byCategory[cat].map(f => {
                  const inTracker = appliedFirms.has(f.name);
                  return (
                    <div key={f.name} className="bg-white border border-amber-200 rounded-xl p-4 hover:border-purple-300 hover:shadow-md transition">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-slate-800">{f.name}</h4>
                        {inTracker && <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-medium shrink-0">In tracker</span>}
                      </div>
                      <div className="flex gap-1.5 mb-2 flex-wrap">
                        <span className={"text-[10px] px-1.5 py-0.5 rounded border " + (CATEGORY_COLORS[f.category] || "border-slate-300")}>{f.category}</span>
                        <span className={"text-[10px] px-1.5 py-0.5 rounded border " + (f.sponsor === "Likely" ? SPONSOR_COLORS.Likely : "border-amber-300 bg-amber-50 text-amber-800")}>Visa: {f.sponsor}</span>
                      </div>
                      <p className="text-xs text-slate-600 mb-3">{f.notes}</p>
                      <div className="flex gap-2 flex-wrap">
                        <a href={f.site} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-gradient-to-r from-amber-500 to-purple-600 text-white text-xs font-semibold hover:shadow-md transition">
                          <ExternalLink className="w-3 h-3" /> Careers
                        </a>
                         <a href={linkedinSearchUrl(f.name)} target="_blank" rel="noreferrer" className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-[#0A66C2] text-white text-xs font-semibold hover:bg-[#004182] transition">
                          <div className="w-3 h-3"><LinkedinIcon /></div> People
                        </a>

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

// ============== APPLICATIONS ==============
function FilterSelect({ value, onChange, options, allLabel }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-white border border-amber-300 rounded-lg px-3 py-2.5 text-sm focus:border-purple-500 focus:outline-none cursor-pointer text-slate-800">
      {options.map(o => <option key={o} value={o}>{o === "All" ? allLabel : o}</option>)}
    </select>
  );
}

function MiniStat({ value, label, accent }: any) {
  return (
    <div className="bg-white border border-amber-200 rounded-xl px-4 py-3 shadow-sm">
      <p className={"text-2xl font-bold " + (accent || "text-slate-800")}>{value}</p>
      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

function RoleTable({ rows, sortKey, sortDir, onSort, onEdit, onDelete, onStudio, selectedIds, onToggleSelect }) {
  const headers = [
    { k: "company", label: "Firm" },
    { k: "role", label: "Role title" },
    { k: "_category", label: "Category" },
    { k: "_level", label: "Level" },
    { k: "tier", label: "Tier" },
    { k: "status", label: "Status" },
    { k: "_sponsor", label: "Visa" },
  ];
  return (
    <div className="overflow-x-auto border border-amber-200 rounded-2xl bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-gradient-to-r from-amber-50 to-purple-50 border-b border-amber-200">
          <tr>
            <th className="px-3 py-3 w-8"></th>
            {headers.map(h => (
              <th key={h.k} onClick={() => onSort(h.k)} className="text-left px-3 py-3 font-semibold text-slate-700 cursor-pointer hover:text-purple-700 whitespace-nowrap select-none">
                <span className="inline-flex items-center gap-1">{h.label}<ArrowUpDown className="w-3 h-3 opacity-50" />{sortKey === h.k ? <span className="text-purple-600 text-xs">{sortDir === "asc" ? "(A-Z)" : "(Z-A)"}</span> : null}</span>
              </th>
            ))}
            <th className="px-3 py-3 font-semibold text-slate-700">JD</th>
            <th className="px-3 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(a => {
            const hasJd = a.jd && a.jd.trim().length > 0;
            return (
            <tr key={a.id} className={"border-b border-amber-100 transition " + (selectedIds && selectedIds.has(a.id) ? "bg-purple-50" : "hover:bg-amber-50/50")}>
              <td className="px-3 py-2.5">
                <input type="checkbox" checked={selectedIds ? selectedIds.has(a.id) : false} onChange={() => onToggleSelect && onToggleSelect(a.id)}
                  className="w-4 h-4 rounded border-amber-400 text-purple-600 focus:ring-purple-500 cursor-pointer" />
              </td>
              <td className="px-3 py-2.5 font-medium text-slate-800 whitespace-nowrap">{a.company}</td>
              <td className="px-3 py-2.5 text-slate-700 max-w-xs">
                {a.url ? <a href={a.url} target="_blank" rel="noreferrer" className="hover:text-purple-700 inline-flex items-center gap-1">{a.role}<ExternalLink className="w-3 h-3 opacity-60" /></a> : a.role}
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap"><span className={"text-[10px] px-1.5 py-0.5 rounded border " + (CATEGORY_COLORS[a._category] || "border-slate-300")}>{a._category}</span></td>
              <td className="px-3 py-2.5 text-slate-600 whitespace-nowrap">{a._level}</td>
              <td className="px-3 py-2.5 whitespace-nowrap">{a.tier ? <span className={"text-xs px-2 py-0.5 rounded border " + (TIER_COLORS[a.tier] || "border-slate-300")}>{a.tier}</span> : null}</td>
              <td className="px-3 py-2.5 whitespace-nowrap"><span className={"text-xs px-2 py-0.5 rounded border " + STATUS_COLORS[a.status]}>{a.status}</span></td>
              <td className="px-3 py-2.5 whitespace-nowrap"><span className={"text-xs px-2 py-0.5 rounded border " + SPONSOR_COLORS[a._sponsor]}>{a._sponsor}</span></td>
              <td className="px-3 py-2.5 whitespace-nowrap">
                {hasJd
                  ? <span className="text-xs text-emerald-700 flex items-center gap-1"><Check className="w-3 h-3" /> Yes</span>
                  : <button onClick={() => onStudio(a.id)} className="text-xs text-purple-700 hover:text-purple-900 flex items-center gap-1 underline"><MessageSquarePlus className="w-3 h-3" /> Paste</button>}
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap">
                <div className="flex gap-1">
                  <button onClick={() => onStudio(a.id)} title="Resume Studio" className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded transition"><Wand2 className="w-4 h-4" /></button>
                  <button onClick={() => onEdit(a)} title="Edit" className="p-1.5 text-slate-500 hover:text-purple-700 hover:bg-purple-50 rounded transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(a.id)} title="Delete" className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Applications({ applications, cvs, onAdd, onEdit, onDelete, onStatusChange, onUpdate, onStudio, onSeed, onPasteJd }) {
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState("cards");
  const [search, setSearch] = useState("");
  const [draftTier, setDraftTier] = useState("All");
  const [draftLevel, setDraftLevel] = useState("All");
  const [draftSponsor, setDraftSponsor] = useState("All");
  const [draftCategory, setDraftCategory] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [sponsorFilter, setSponsorFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [quickFilter, setQuickFilter] = useState(null);
  const [sortKey, setSortKey] = useState("_priority");
  const [sortDir, setSortDir] = useState("desc");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [recheckState, setRecheckState] = useState(null); // { current, total, errors, skipped }

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const clearSelection = () => setSelectedIds(new Set());

  const bulkRecheck = async () => {
    if (!cvs || cvs.length === 0) return;
    const selectedApps = applications.filter(a => selectedIds.has(a.id));
    const withJd = selectedApps.filter(a => a.jd && a.jd.trim());
    const skipped = selectedApps.filter(a => !a.jd || !a.jd.trim()).map(a => a.company + " - " + a.role);
    if (withJd.length === 0) {
      setRecheckState({ current: 0, total: 0, errors: [], skipped, done: true });
      setTimeout(() => setRecheckState(null), 5000);
      return;
    }
    setRecheckState({ current: 0, total: withJd.length, errors: [], skipped, done: false });
    const combinedProfile = cvs.map((cv, i) => "=== CV: " + cv.label + (cv.focus ? " (" + cv.focus + ")" : "") + " ===\n" + cv.text).join("\n\n");

    for (let i = 0; i < withJd.length; i++) {
      const a = withJd[i];
      setRecheckState(s => s ? { ...s, current: i + 1 } : s);
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 400,
            messages: [{
              role: "user",
              content: "You are a thoughtful, optimistic-but-honest hiring evaluator helping an MBA candidate prioritize where to invest application effort.\n\n" + HONEST_RUBRIC + "\n\nThe candidate may have multiple CV variants; consider whichever applies most.\n\nCANDIDATE:\n" + combinedProfile + "\n\nROLE: " + a.role + " at " + a.company + "\n\nJD:\n" + a.jd + "\n\nRespond with ONLY a JSON object (no markdown):\n{\n  \"fitScore\": <integer 1-10>,\n  \"fitRationale\": \"<one honest, optimistic-but-realistic sentence>\"\n}"
            }]
          })
        });
        const result = await response.json();
        let raw = (result.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(raw);
        if (typeof parsed.fitScore === "number") {
          onUpdate(a.id, { fitScore: parsed.fitScore, fitRationale: parsed.fitRationale });
        }
      } catch (e) {
        setRecheckState(s => s ? { ...s, errors: [...s.errors, a.company + " - " + a.role] } : s);
      }
    }
    setRecheckState(s => s ? { ...s, done: true } : s);
    setTimeout(() => setRecheckState(null), 8000);
  };

  const applyFilters = () => { setTierFilter(draftTier); setLevelFilter(draftLevel); setSponsorFilter(draftSponsor); setCategoryFilter(draftCategory); };
  const clearFilters = () => {
    setDraftTier("All"); setDraftLevel("All"); setDraftSponsor("All"); setDraftCategory("All");
    setTierFilter("All"); setLevelFilter("All"); setSponsorFilter("All"); setCategoryFilter("All");
    setQuickFilter(null); setSearch("");
  };
  const draftsDiffer = draftTier !== tierFilter || draftLevel !== levelFilter || draftSponsor !== sponsorFilter || draftCategory !== categoryFilter;
  const anyFilterActive = tierFilter !== "All" || levelFilter !== "All" || sponsorFilter !== "All" || categoryFilter !== "All" || quickFilter || search.trim() || filter !== "All";

  const existingUrls = new Set(applications.map(a => a.url).filter(Boolean));
  const existingKeys = new Set(applications.map(a => a.company + "|" + a.role));
  const newRolesCount = SEEDED_ROLES.filter(r => r.url ? !existingUrls.has(r.url) : !existingKeys.has(r.company + "|" + r.role)).length;

  const enriched = applications.map(a => {
    const sponsor = estimateSponsorship(a);
    return { ...a, _level: inferLevel(a), _sponsor: sponsor, _category: firmCategory(a.company), _priority: priorityScore(a, inferLevel(a), sponsor), _daysToDeadline: daysUntil(a.deadline) };
  });

  let filtered = enriched.filter(a => {
    if (filter !== "All") {
      const group = STATUS_GROUPS.find(g => g.label === filter);
      if (group && group.values && !group.values.includes(a.status)) return false;
    }
    if (tierFilter !== "All" && a.tier !== tierFilter) return false;
    if (levelFilter !== "All" && a._level !== levelFilter) return false;
    if (sponsorFilter !== "All" && a._sponsor !== sponsorFilter) return false;
    if (categoryFilter !== "All" && a._category !== categoryFilter) return false;
    if (quickFilter === "top" && a.tier !== "Strong fit" && a.tier !== "Stretch (referral helps)") return false;
    if (quickFilter === "week" && (a._daysToDeadline == null || a._daysToDeadline < 0 || a._daysToDeadline > 7)) return false;
    if (quickFilter === "verify-jd" && ((a.tier !== "Strong fit" && a.tier !== "Stretch (referral helps)") || a._sponsor === "Confirmed" || a._sponsor === "Unlikely")) return false;
    if (quickFilter === "tailor" && (a.studioData || (a.tier !== "Strong fit" && a.tier !== "Stretch (referral helps)"))) return false;
    if (quickFilter === "missed" && a.status !== "Missed to apply" && !(a.status === "Saved" && a._daysToDeadline != null && a._daysToDeadline < 0)) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const hay = (a.company + " " + a.role + " " + (a.tier || "") + " " + (a.notes || "")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  if (sortKey === "_priority") {
    filtered = [...filtered].sort((a, b) => sortDir === "asc" ? a._priority - b._priority : b._priority - a._priority);
  } else if (sortKey === "_daysToDeadline") {
    filtered = [...filtered].sort((a, b) => {
      const av = a._daysToDeadline == null ? 9999 : a._daysToDeadline;
      const bv = b._daysToDeadline == null ? 9999 : b._daysToDeadline;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  } else if (sortKey) {
    filtered = [...filtered].sort((a, b) => {
      const av = (a[sortKey] || "").toString().toLowerCase();
      const bv = (b[sortKey] || "").toString().toLowerCase();
      return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }

  const stats = {
    total: applications.length,
    confirmed: enriched.filter(a => a._sponsor === "Confirmed").length,
    likely: enriched.filter(a => a._sponsor === "Likely").length,
    firms: new Set(applications.map(a => a.company)).size,
  };

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const allTiers = ["All"].concat(Array.from(new Set(enriched.map(a => a.tier).filter(Boolean))));

  return (
    <div>
      {newRolesCount > 0 && (
        <div className="mb-5 bg-gradient-to-r from-yellow-100 via-amber-100 to-purple-100 border border-amber-300 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap shadow-sm">
          <div>
            <p className="font-semibold text-slate-800">Starter pack: {newRolesCount} UK firms</p>
            <p className="text-xs text-slate-600 mt-0.5">Major UK consulting, tech, and industry firms known to sponsor international MBA candidates. Add or remove as you go.</p>
          </div>
          <button onClick={onSeed} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-md transition whitespace-nowrap">
            <Plus className="w-4 h-4" /> Import roles
          </button>
        </div>
      )}

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-amber-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:border-purple-500 focus:outline-none text-slate-800"
          placeholder="Search firm, role, or practice area..." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <FilterSelect value={draftCategory} onChange={setDraftCategory} options={["All"].concat(CATEGORY_OPTIONS)} allLabel="All firm types" />
        <FilterSelect value={draftTier} onChange={setDraftTier} options={allTiers} allLabel="All tiers" />
        <FilterSelect value={draftLevel} onChange={setDraftLevel} options={["All"].concat(LEVEL_OPTIONS)} allLabel="All levels" />
        <FilterSelect value={draftSponsor} onChange={setDraftSponsor} options={["All", "Confirmed", "Likely", "Unknown", "Unlikely"]} allLabel="All sponsorship" />
      </div>
      <div className="flex items-center justify-end gap-2 mb-5">
        {anyFilterActive && <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-slate-800 px-3 py-1.5">Clear all</button>}
        <button onClick={applyFilters} disabled={!draftsDiffer}
          className={"flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition " + (draftsDiffer ? "bg-purple-600 text-white hover:bg-purple-700" : "bg-slate-100 text-slate-400 cursor-not-allowed")}>
          <Check className="w-4 h-4" /> Apply filters
        </button>
      </div>

      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1"><Filter className="w-3 h-3" /> Quick:</span>
          {[
            { id: "top", label: "Top picks", icon: Star },
            { id: "week", label: "Deadline this week", icon: AlertTriangle },
            { id: "verify-jd", label: "Verify visa", icon: Bell },
            { id: "tailor", label: "Needs tailoring", icon: Wand2 },
            { id: "missed", label: "Missed to apply", icon: Clock },
          ].map(q => {
            const active = quickFilter === q.id;
            return (
              <button key={q.id} onClick={() => setQuickFilter(active ? null : q.id)}
                className={"flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition " + (active ? "bg-purple-600 text-white border-purple-600" : "bg-white text-slate-700 border-amber-300 hover:border-purple-400")}>
                <q.icon className="w-3 h-3" /> {q.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 uppercase tracking-wider">Sort:</label>
          <select value={sortKey || ""} onChange={e => setSortKey(e.target.value || null)}
            className="bg-white border border-amber-300 rounded-lg px-2 py-1.5 text-xs focus:border-purple-500 focus:outline-none cursor-pointer text-slate-800">
            <option value="_priority">Priority (smart)</option>
            <option value="_daysToDeadline">Deadline (soonest)</option>
            <option value="company">Firm (A-Z)</option>
            <option value="role">Role (A-Z)</option>
            <option value="tier">Tier</option>
            <option value="_category">Category</option>
            <option value="status">Status</option>
          </select>
          <button onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
            className="bg-white border border-amber-300 hover:border-purple-400 text-slate-700 px-2 py-1.5 rounded-lg text-xs">
            {sortDir === "asc" ? "ASC" : "DESC"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <MiniStat value={stats.total} label="Total roles" />
        <MiniStat value={stats.confirmed} label="Confirmed visa" accent="text-emerald-600" />
        <MiniStat value={stats.likely} label="Likely visa" accent="text-purple-600" />
        <MiniStat value={stats.firms} label="Firms covered" />
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {STATUS_GROUPS.map(g => {
            const count = g.values ? applications.filter(a => g.values.includes(a.status)).length : applications.length;
            return (
              <button key={g.label} onClick={() => setFilter(g.label)}
                className={"px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1.5 " + (filter === g.label ? "bg-purple-600 text-white" : "bg-white border border-amber-300 text-slate-700 hover:border-purple-400")}>
                {g.label}<span className={"text-xs " + (filter === g.label ? "text-purple-200" : "text-slate-400")}>{count}</span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="flex bg-white border border-amber-300 rounded-lg p-0.5">
            <button onClick={() => setView("cards")} className={"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition " + (view === "cards" ? "bg-purple-600 text-white" : "text-slate-600")}><LayoutGrid className="w-4 h-4" /> Cards</button>
            <button onClick={() => setView("table")} className={"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition " + (view === "table" ? "bg-purple-600 text-white" : "text-slate-600")}><TableIcon className="w-4 h-4" /> Table</button>
          </div>
          <button onClick={onPasteJd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold rounded-lg hover:shadow-md transition">
            <MessageSquarePlus className="w-4 h-4" /> Paste JD
          </button>
          <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold rounded-lg hover:shadow-md transition">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="mb-4 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-2xl p-4 flex items-center justify-between gap-3 flex-wrap shadow-md">
          <div className="flex items-center gap-3 flex-wrap">
            <CheckCircle2 className="w-5 h-5" />
            <p className="font-semibold">{selectedIds.size} role{selectedIds.size === 1 ? "" : "s"} selected</p>
            {(!cvs || cvs.length === 0) && <span className="text-xs bg-amber-300 text-amber-900 px-2 py-0.5 rounded-full">Add a CV first to enable re-check</span>}
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={bulkRecheck} disabled={!cvs || cvs.length === 0 || (recheckState && !recheckState.done)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white text-purple-700 text-sm font-semibold rounded-lg hover:bg-purple-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {recheckState && !recheckState.done ? <><Loader className="w-4 h-4 animate-spin" /> Re-checking {recheckState.current}/{recheckState.total}...</> : <><Gauge className="w-4 h-4" /> Re-check fit</>}
            </button>
            <button onClick={clearSelection} className="px-3 py-1.5 bg-white/20 text-white text-sm font-medium rounded-lg hover:bg-white/30 transition">Clear</button>
          </div>
        </div>
      )}

      {/* Recheck result banner */}
      {recheckState && recheckState.done && (
        <div className="mb-4 bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-sm space-y-1">
          <div className="flex items-center gap-2 text-emerald-800 font-semibold"><Check className="w-4 h-4" /> Re-check complete</div>
          {recheckState.total > 0 && <p className="text-emerald-700 text-xs">Updated fit scores for {recheckState.total - recheckState.errors.length} role{recheckState.total - recheckState.errors.length === 1 ? "" : "s"}.</p>}
          {recheckState.skipped.length > 0 && (
            <p className="text-amber-700 text-xs">Skipped {recheckState.skipped.length} (no JD attached): {recheckState.skipped.slice(0, 3).join("; ")}{recheckState.skipped.length > 3 ? "..." : ""}</p>
          )}
          {recheckState.errors.length > 0 && (
            <p className="text-rose-700 text-xs">Errors on: {recheckState.errors.slice(0, 3).join("; ")}{recheckState.errors.length > 3 ? "..." : ""}</p>
          )}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-amber-200 rounded-2xl">
          <Briefcase className="w-12 h-12 text-amber-300 mx-auto mb-3" />
          <p className="text-slate-500">No roles match your filters.</p>
        </div>
      ) : view === "table" ? (
        <RoleTable rows={filtered} sortKey={sortKey} sortDir={sortDir} onSort={toggleSort} onEdit={onEdit} onDelete={onDelete} onStudio={onStudio} selectedIds={selectedIds} onToggleSelect={toggleSelect} />
      ) : (
        <div className="grid gap-3">
          {filtered.map(app => {
            const hasJd = app.jd && app.jd.trim().length > 0;
            const isSelected = selectedIds.has(app.id);
            return (
            <div key={app.id} className={"bg-white border rounded-2xl p-5 transition shadow-sm " + (isSelected ? "border-purple-500 ring-2 ring-purple-200" : "border-amber-200 hover:border-purple-300 hover:shadow-md")}>
              <div className="flex items-start gap-3">
                <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(app.id)}
                  className="mt-1.5 w-4 h-4 rounded border-amber-400 text-purple-600 focus:ring-purple-500 cursor-pointer shrink-0" />
                <div className="flex items-start justify-between gap-4 min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-3 flex-wrap">
                    <div className="min-w-0"><h3 className="font-semibold text-lg truncate text-slate-800">{app.role}</h3><p className="text-slate-500 text-sm">{app.company}</p></div>
                    <select value={app.status} onChange={(e) => onStatusChange(app.id, e.target.value)}
                      className={"text-xs px-2 py-1 rounded border cursor-pointer focus:outline-none " + STATUS_COLORS[app.status]}>
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {app.fitScore != null && (
                      <span className="text-xs px-2 py-1 rounded border border-amber-300 bg-amber-50 text-amber-800 flex items-center gap-1">
                        <Target className="w-3 h-3" /> Fit {app.fitScore}/10
                      </span>
                    )}
                    <span className="text-xs px-2 py-1 rounded border border-purple-300 bg-purple-50 text-purple-800 flex items-center gap-1">
                      <Star className="w-3 h-3" /> P{app._priority}
                    </span>
                    <span className={"text-xs px-2 py-1 rounded border " + (CATEGORY_COLORS[app._category] || "border-slate-300")}>{app._category}</span>
                    {app.tier && (
                      <span className={"text-xs px-2 py-1 rounded border " + (TIER_COLORS[app.tier] || "border-slate-300")}>{app.tier}</span>
                    )}
                    <span className={"text-xs px-2 py-1 rounded border " + SPONSOR_COLORS[app._sponsor]}>Visa: {app._sponsor}</span>
                    {!hasJd && (
                      <span className="text-xs px-2 py-1 rounded border border-rose-300 bg-rose-50 text-rose-800 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> No JD yet
                      </span>
                    )}
                    {app._daysToDeadline != null && app._daysToDeadline >= 0 && app._daysToDeadline <= 14 && (
                      <span className="text-xs px-2 py-1 rounded border border-rose-300 bg-rose-50 text-rose-800 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {app._daysToDeadline}d left
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-slate-500">
                    {app.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {app.location}</span>}
                    {app.salary && <span>Salary: {app.salary}</span>}
                    {app.source && <span>Source: {app.source}</span>}
                    {app.deadline && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {app.deadline}</span>}
                    {app.url && <a href={app.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-purple-600 hover:text-purple-800"><ExternalLink className="w-3 h-3" /> Link</a>}
                  </div>
                  {app.notes && <p className="text-sm text-slate-700 mt-3 bg-amber-50/60 p-3 rounded-lg border border-amber-200 whitespace-pre-wrap">{app.notes}</p>}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <button onClick={() => onStudio(app.id)}
                      className={"flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold hover:shadow-md transition " + (!hasJd ? "bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white" : "bg-gradient-to-r from-amber-500 to-purple-600 text-white")}>
                      {!hasJd ? <><MessageSquarePlus className="w-4 h-4" /> Paste JD & Analyze</> : <><Wand2 className="w-4 h-4" /> {app.studioData ? "Open Resume Studio" : "Tailor Resume"}</>}
                    </button>
                    <a href={linkedinSearchUrl(app.company)} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0A66C2] text-white text-sm font-semibold hover:bg-[#004182] transition">
                      <div className="w-4 h-4"><LinkedinIcon /></div> Find people
                    </a>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => onEdit(app)} className="p-2 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(app.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
                </div>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Contacts({ contacts, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h2 className="text-2xl font-bold text-slate-800">Networking Contacts</h2><p className="text-sm text-slate-500 mt-1">Keep track of people you have met or want to reach out to.</p></div>
        <button onClick={onAdd} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-md transition"><Plus className="w-4 h-4" /> Add Contact</button>
      </div>
      {contacts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-amber-200 rounded-2xl">
          <Users className="w-12 h-12 text-amber-300 mx-auto mb-3" /><p className="text-slate-500">No contacts yet. Start building your network!</p>
          <button onClick={onAdd} className="mt-4 text-purple-600 hover:text-purple-800 font-medium text-sm">+ Add your first contact</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          {contacts.map(c => (
            <div key={c.id} className="bg-white border border-amber-200 rounded-2xl p-5 hover:border-purple-300 hover:shadow-md transition shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">{c.name ? c.name.charAt(0).toUpperCase() : "?"}</div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold truncate text-slate-800">{c.name}</h3>
                    <p className="text-sm text-slate-500 truncate">{c.role} {c.firm ? "- " + c.firm : ""}</p>
                    {c.met && <p className="text-xs text-slate-500 mt-1">Met: {c.met}</p>}
                    {c.followUp && <p className="text-xs text-purple-600 mt-1">Follow up: {c.followUp}</p>}
                    {c.notes && <p className="text-sm text-slate-700 mt-2 line-clamp-3">{c.notes}</p>}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button onClick={() => onEdit(c)} className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded transition"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => onDelete(c.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============== PROFILE EDITOR (multi-CV) ==============
const MAX_CVS = 6;

// Heuristic CV scoring — runs locally, no AI required.
// 0–100 score with a breakdown of what's strong and what's missing.
function scoreCv(text) {
  if (!text || !text.trim()) return { score: 0, breakdown: [], summary: "Empty CV." };
  const t = text.toLowerCase();
  const words = text.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const lines = text.split(/\n/);
  const bulletLines = lines.filter(l => /^\s*[-•*–]/.test(l)).length;

  const checks = [
    { key: "length", label: "Length", weight: 10, pass: wordCount >= 250 && wordCount <= 1200, detail: wordCount < 250 ? "Too short (" + wordCount + " words) — aim for 400–800." : wordCount > 1200 ? "Too long (" + wordCount + " words) — trim to a focused 1 page." : wordCount + " words — good range." },
    { key: "bullets", label: "Bullet structure", weight: 10, pass: bulletLines >= 6, detail: bulletLines + " bullet lines detected" + (bulletLines < 6 ? " — use bullets, not paragraphs." : ".") },
    { key: "metrics", label: "Quantified impact", weight: 20, pass: (text.match(/(\$|£|€)[\d,.]+|\d+\s*(%|percent|x)|\d+,\d{3}|\d+\s*(years?|months?|customers?|users?|patients?|clients?)/gi) || []).length >= 4, detail: ((text.match(/(\$|£|€)[\d,.]+|\d+\s*(%|percent|x)|\d+,\d{3}|\d+\s*(years?|months?|customers?|users?|patients?|clients?)/gi) || []).length) + " quantified metrics found — aim for 6+." },
    { key: "actionVerbs", label: "Strong action verbs", weight: 15, pass: ["led", "delivered", "designed", "built", "launched", "drove", "scaled", "improved", "increased", "reduced", "saved", "managed", "architected", "implemented", "developed", "spearheaded", "transformed", "negotiated", "orchestrated"].filter(v => new RegExp("\\b" + v + "\\b", "i").test(text)).length >= 5, detail: ["led", "delivered", "designed", "built", "launched", "drove", "scaled", "improved", "increased", "reduced", "saved", "managed", "architected", "implemented", "developed"].filter(v => new RegExp("\\b" + v + "\\b", "i").test(text)).length + " distinct action verbs." },
    { key: "education", label: "Education section", weight: 10, pass: /\beducation\b|\bmba\b|\bbachelor\b|\bmaster\b|\bphd\b|\buniversity\b|\bschool\b|\bb\.tech\b|\bb\.eng\b/i.test(text), detail: "" },
    { key: "experience", label: "Experience section", weight: 10, pass: /\bexperience\b|\bemployment\b|\bwork history\b/i.test(text) || lines.filter(l => /\b\d{4}\s*[-–]\s*(\d{4}|present|current)/i.test(l)).length >= 1, detail: "" },
    { key: "skills", label: "Skills section", weight: 10, pass: /\bskills\b|\btechnical\b|\bcompetenc/i.test(text), detail: "" },
    { key: "dates", label: "Dates / timeline", weight: 5, pass: (text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{4}|\b\d{4}\b/gi) || []).length >= 4, detail: "" },
    { key: "contact", label: "Contact info", weight: 5, pass: /@/.test(text) || /\+\d/.test(text) || /linkedin/i.test(text), detail: "" },
    { key: "buzzwords", label: "Buzzword-light", weight: 5, pass: (text.match(/\b(synergy|synergies|leverage|holistic|paradigm|innovative|dynamic|proactive|results-oriented|team player|hardworking|detail-oriented|go-getter|guru|ninja|rockstar)\b/gi) || []).length <= 3, detail: "" },
  ];

  let score = 0;
  let maxScore = 0;
  const breakdown = checks.map(c => {
    maxScore += c.weight;
    if (c.pass) score += c.weight;
    return { label: c.label, pass: c.pass, weight: c.weight, detail: c.detail };
  });
  const finalScore = Math.round((score / maxScore) * 100);
  let summary;
  if (finalScore >= 85) summary = "Strong CV — well-structured, quantified, and ATS-friendly.";
  else if (finalScore >= 70) summary = "Solid CV — a few tweaks would tighten it further.";
  else if (finalScore >= 50) summary = "Decent base — needs more metrics and stronger structure.";
  else summary = "Needs work — add metrics, bullets, and clearer sections.";
  return { score: finalScore, breakdown, summary };
}

function ProfileEditor({ cvs, onSave }) {
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ label: "", focus: "", text: "" });
  const [savedFlash, setSavedFlash] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [scoringId, setScoringId] = useState(null);
  const isEmpty = cvs.length === 0;
  const atCap = cvs.length >= MAX_CVS;

  const startNew = () => { setDraft({ label: "", focus: "", text: "" }); setEditing("new"); };
  const startEdit = (cv) => { setDraft({ label: cv.label, focus: cv.focus || "", text: cv.text }); setEditing(cv.id); };
  const cancelEdit = () => { setEditing(null); setDraft({ label: "", focus: "", text: "" }); setUploadError(""); };

  const saveCv = async () => {
    if (!draft.text.trim() || !draft.label.trim()) return;
    let next;
    if (editing === "new") {
      next = [...cvs, { id: Date.now().toString(), label: draft.label.trim(), focus: draft.focus.trim(), text: draft.text, updatedAt: new Date().toISOString() }];
    } else {
      next = cvs.map(c => c.id === editing ? { ...c, label: draft.label.trim(), focus: draft.focus.trim(), text: draft.text, updatedAt: new Date().toISOString() } : c);
    }
    await onSave(next);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
    cancelEdit();
  };

  const deleteCv = async (id) => {
    if (!confirm("Delete this CV variant? This can't be undone.")) return;
    const next = cvs.filter(c => c.id !== id);
    await onSave(next);
  };

  const handleFileUpload = async (e) => {
    setUploadError("");
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const name = file.name.toLowerCase();
    const baseLabel = file.name.replace(/\.[^.]+$/, "");
    setUploading(true);
    try {
      if (name.endsWith(".docx")) {
        // Extract via mammoth (clean, runs locally in the browser)
        const buf = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: buf });
        const text = (result && result.value ? result.value : "").trim();
        if (!text) throw new Error("DOCX appeared empty.");
        setDraft(d => ({ ...d, text: d.text ? d.text + "\n\n" + text : text, label: d.label || baseLabel }));
      } else if (name.endsWith(".pdf")) {
        // Send PDF to the Anthropic API for text extraction
        const buf = await file.arrayBuffer();
        // Convert to base64 in chunks to avoid string-length issues
        const bytes = new Uint8Array(buf);
        let binary = "";
        const chunkSize = 0x8000;
        for (let i = 0; i < bytes.length; i += chunkSize) {
          binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize));
        }
        const base64 = btoa(binary);
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 4000,
            messages: [{
              role: "user",
              content: [
                { type: "document", source: { type: "base64", media_type: "application/pdf", data: base64 } },
                { type: "text", text: "Extract the full text content of this CV/resume verbatim. Preserve section headings, bullet points, dates, metrics, and structure. Do not summarize or paraphrase — output the raw text exactly as it appears. Do not add any commentary. Output only the extracted text." }
              ]
            }]
          })
        });
        const result = await response.json();
        const text = (result.content || []).filter(b => b.type === "text").map(b => b.text).join("\n").trim();
        if (!text) throw new Error("Could not extract text from PDF.");
        setDraft(d => ({ ...d, text: d.text ? d.text + "\n\n" + text : text, label: d.label || baseLabel }));
      } else if (name.endsWith(".doc")) {
        setUploadError(".doc (old Word format) isn't supported. Re-save as .docx, or copy-paste the text below.");
      } else if (name.endsWith(".txt") || name.endsWith(".md") || name.endsWith(".text")) {
        const text = await file.text();
        setDraft(d => ({ ...d, text: d.text ? d.text + "\n\n" + text : text, label: d.label || baseLabel }));
      } else {
        setUploadError("Unsupported file type. Use .pdf, .docx, .txt, or .md.");
      }
    } catch (err) {
      console.error(err);
      setUploadError("Couldn't process this file. Try copy-pasting the text directly.");
    }
    setUploading(false);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-bold mb-1 bg-gradient-to-r from-amber-600 to-purple-600 bg-clip-text text-transparent">Your CV Library</h2>
          <p className="text-slate-600">Store up to {MAX_CVS} tailored versions. The AI will pick the best-matching one (or you can choose) when tailoring for a role.</p>
        </div>
        {!editing && !atCap && (
          <button onClick={startNew} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-md transition shrink-0">
            <Plus className="w-4 h-4" /> Add CV variant
          </button>
        )}
      </div>

      {isEmpty && !editing && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm flex-1">
            <p className="font-medium text-amber-900">No CVs yet</p>
            <p className="text-amber-800 mt-0.5">Add at least one CV variant so Resume Studio and Paste JD can tailor outputs to your background.</p>
          </div>
        </div>
      )}

      {atCap && !editing && (
        <div className="bg-purple-50 border border-purple-300 rounded-xl p-4 text-sm text-purple-900">
          You've reached the {MAX_CVS}-version cap. Delete an old variant to add a new one.
        </div>
      )}

      {/* List of saved CVs */}
      {!editing && cvs.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3">
          {cvs.map(cv => {
            const sc = scoreCv(cv.text);
            const scoreColor = sc.score >= 85 ? "from-emerald-400 to-emerald-600" : sc.score >= 70 ? "from-amber-400 to-amber-600" : sc.score >= 50 ? "from-orange-400 to-orange-600" : "from-rose-400 to-rose-600";
            const isExpanded = scoringId === cv.id;
            return (
              <div key={cv.id} className="bg-white border border-amber-200 rounded-2xl p-5 hover:border-purple-300 hover:shadow-md transition shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-slate-800 truncate">{cv.label}</h3>
                    {cv.focus && <p className="text-xs text-purple-700 mt-0.5">{cv.focus}</p>}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => startEdit(cv)} className="p-1.5 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded transition" title="Edit"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => deleteCv(cv.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className={"w-12 h-12 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0 shadow-sm " + scoreColor}>
                    <span className="text-sm font-bold text-white">{sc.score}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1"><Gauge className="w-3 h-3" /> CV Score</p>
                    <p className="text-xs text-slate-700 mt-0.5">{sc.summary}</p>
                  </div>
                  <button onClick={() => setScoringId(isExpanded ? null : cv.id)} className="text-xs text-purple-700 hover:text-purple-900 underline whitespace-nowrap">{isExpanded ? "hide" : "details"}</button>
                </div>
                {isExpanded && (
                  <div className="bg-amber-50/60 border border-amber-200 rounded-lg p-3 mb-2 space-y-1.5">
                    {sc.breakdown.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs">
                        {b.pass ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" /> : <Circle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />}
                        <div className="min-w-0 flex-1">
                          <span className={"font-medium " + (b.pass ? "text-slate-700" : "text-rose-700")}>{b.label}</span>
                          <span className="text-slate-500 ml-1">(+{b.weight})</span>
                          {b.detail && <p className="text-slate-500 mt-0.5">{b.detail}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-slate-500">{cv.text.length} chars · {cv.text.trim().split(/\s+/).filter(Boolean).length} words · Updated {new Date(cv.updatedAt).toLocaleDateString()}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Editor */}
      {editing && (
        <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h3 className="text-lg font-semibold text-slate-800">{editing === "new" ? "New CV variant" : "Edit CV variant"}</h3>
            <button onClick={cancelEdit} className="text-sm text-slate-500 hover:text-slate-800">Cancel</button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Label *">
              <input value={draft.label} onChange={e => setDraft({ ...draft, label: e.target.value })} className={inputCls} placeholder="e.g. Salesforce Architect, Strategy, Product PM" maxLength={60} />
            </Field>
            <Field label="Best for / focus (optional)">
              <input value={draft.focus} onChange={e => setDraft({ ...draft, focus: e.target.value })} className={inputCls} placeholder="e.g. Tech delivery roles, MBB cases" maxLength={120} />
            </Field>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-purple-50 border border-amber-200 rounded-lg p-3">
            <label className={"text-sm font-medium text-slate-700 flex items-center gap-2 " + (uploading ? "" : "cursor-pointer")}>
              {uploading ? <Loader className="w-4 h-4 text-purple-600 animate-spin" /> : <Upload className="w-4 h-4 text-purple-600" />}
              <span>{uploading ? "Extracting text from your file..." : "Upload your CV (.pdf, .docx, .txt, .md)"}</span>
              <input type="file" accept=".pdf,.docx,.doc,.txt,.md,.text" onChange={handleFileUpload} disabled={uploading} className="hidden" />
              {!uploading && <span className="ml-auto text-xs text-purple-700 underline">browse...</span>}
            </label>
            <p className="text-xs text-slate-500 mt-1.5">DOCX is extracted locally. PDFs are sent to the Anthropic API for text extraction. You can also paste text directly below.</p>
            {uploadError && <p className="text-xs text-rose-600 mt-2">{uploadError}</p>}
          </div>

          <Field label="CV text *">
            <textarea value={draft.text} onChange={e => setDraft({ ...draft, text: e.target.value })} rows={18}
              className={inputCls + " resize-y font-mono text-xs leading-relaxed"}
              placeholder={"Paste your CV here. For example:\n\nEDUCATION\n- MBA, [School], [Year]\n\nEXPERIENCE\n[Role - Company - dates]\n- Key achievement with metrics\n- Another achievement\n\nSKILLS\n- Technical: [...]\n- Certifications: [...]"} />
          </Field>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-slate-500">{draft.text.length} characters · {draft.text.trim().split(/\s+/).filter(Boolean).length} words</p>
            <button onClick={saveCv} disabled={!draft.label.trim() || !draft.text.trim()}
              className={"flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition " + (draft.label.trim() && draft.text.trim() ? "bg-gradient-to-r from-amber-500 to-purple-600 text-white hover:shadow-md" : "bg-slate-100 text-slate-400 cursor-not-allowed")}>
              <Check className="w-4 h-4" /> Save CV
            </button>
          </div>
        </div>
      )}

      {savedFlash && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm font-medium z-50">
          <Check className="w-4 h-4" /> Saved
        </div>
      )}

      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-sm text-purple-900">
        <p className="font-medium mb-1 flex items-center gap-2"><Sparkles className="w-4 h-4" /> Privacy note</p>
        <p className="text-xs">Your CV variants are stored locally per user. When you run AI features, the selected CV is sent to the Anthropic API along with the job description, so the AI can tailor outputs to your background. Nothing else is stored or shared.</p>
      </div>
    </div>
  );
}

// ============== FORMS ==============
const inputCls = "w-full bg-white border border-amber-300 rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none text-slate-800";

function Field({ label, children }) {
  return <div><label className="text-sm font-medium text-slate-700 block mb-1">{label}</label>{children}</div>;
}

function AppForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { company: "", role: "", status: "Saved", location: "London, UK", salary: "", source: "", deadline: "", url: "", notes: "", tier: "", level: "", sponsorship: "" });
  const submit = () => { if (!form.company.trim() || !form.role.trim()) return; onSave(form); };
  return (
    <Modal onClose={onClose} title={initial ? "Edit Application" : "New Application"}>
      <div className="space-y-4">
        <Field label="Company *"><input list="firms" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} className={inputCls} placeholder="e.g. McKinsey & Company" /><datalist id="firms">{TOP_FIRMS.map(f => <option key={f} value={f} />)}</datalist></Field>
        <Field label="Role *"><input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={inputCls} placeholder="e.g. Associate, Digital Strategy" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Status"><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className={inputCls}>{STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}</select></Field>
          <Field label="Location"><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inputCls} /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Level"><select value={form.level || ""} onChange={e => setForm({ ...form, level: e.target.value })} className={inputCls}><option value="">Auto-detect</option>{LEVEL_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}</select></Field>
          <Field label="Visa sponsorship"><select value={form.sponsorship || ""} onChange={e => setForm({ ...form, sponsorship: e.target.value })} className={inputCls}><option value="">Auto-estimate</option><option value="Confirmed">Confirmed</option><option value="Likely">Likely</option><option value="Unknown">Unknown</option><option value="Unlikely">Unlikely</option></select></Field>
        </div>
        <Field label="Fit tier"><select value={form.tier || ""} onChange={e => setForm({ ...form, tier: e.target.value })} className={inputCls}><option value="">None</option>{Object.keys(TIER_COLORS).map(t => <option key={t} value={t}>{t}</option>)}</select></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Salary (GBP)"><input value={form.salary} onChange={e => setForm({ ...form, salary: e.target.value })} className={inputCls} placeholder="e.g. 85k - 100k" /></Field>
          <Field label="Source"><input value={form.source} onChange={e => setForm({ ...form, source: e.target.value })} className={inputCls} placeholder="LinkedIn, referral" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Deadline"><input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} className={inputCls} /></Field>
          <Field label="Job URL"><input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} className={inputCls} placeholder="https://..." /></Field>
        </div>
        <Field label="Notes"><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className={inputCls + " resize-none"} placeholder="Key points, prep tasks..." /></Field>
        <div className="flex gap-2 pt-2">
          <button onClick={submit} disabled={!form.company.trim() || !form.role.trim()} className="flex-1 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed">{initial ? "Save Changes" : "Add Application"}</button>
          <button onClick={onClose} className="px-4 py-2.5 bg-white border border-amber-300 text-slate-700 rounded-lg hover:border-purple-400 transition">Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

function ContactForm({ initial, onSave, onClose }: any) {
  const [form, setForm] = useState(initial || { name: "", firm: "", role: "", met: "", followUp: "", notes: "" });
  const submit = () => { if (!form.name.trim()) return; onSave(form); };
  return (
    <Modal onClose={onClose} title={initial ? "Edit Contact" : "New Contact"}>
      <div className="space-y-4">
        <Field label="Name *"><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Firm"><input list="firms2" value={form.firm} onChange={e => setForm({ ...form, firm: e.target.value })} className={inputCls} /><datalist id="firms2">{TOP_FIRMS.map(f => <option key={f} value={f} />)}</datalist></Field>
          <Field label="Role"><input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className={inputCls} placeholder="e.g. Senior Manager" /></Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="How met"><input value={form.met} onChange={e => setForm({ ...form, met: e.target.value })} className={inputCls} placeholder="Imperial event, referral" /></Field>
          <Field label="Follow-up date"><input type="date" value={form.followUp} onChange={e => setForm({ ...form, followUp: e.target.value })} className={inputCls} /></Field>
        </div>
        <Field label="Notes"><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} className={inputCls + " resize-none"} placeholder="Conversation highlights..." /></Field>
        <div className="flex gap-2 pt-2">
          <button onClick={submit} disabled={!form.name.trim()} className="flex-1 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed">{initial ? "Save Changes" : "Add Contact"}</button>
          <button onClick={onClose} className="px-4 py-2.5 bg-white border border-amber-300 text-slate-700 rounded-lg hover:border-purple-400 transition">Cancel</button>
        </div>
      </div>
    </Modal>
  );
}

// ============== RESUME STUDIO ==============
function ResumeStudio({ app, cvs, onClose, onSave, onGoToProfile }) {
  const [jd, setJd] = useState(app.jd || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(app.studioData || null);
  const [checked, setChecked] = useState(app.keywordChecks || {});
  const [activeTab, setActiveTab] = useState("fit");
  const [selectedCvId, setSelectedCvId] = useState(app.selectedCvId || "auto");
  const hasCv = cvs && cvs.length > 0;

  // Build the profile string to send to AI
  const buildProfileForAi = () => {
    if (selectedCvId === "auto" || !selectedCvId) {
      // Send all CVs and let the AI pick — labelled for clarity
      return cvs.map((cv, i) => "=== CV VARIANT " + (i + 1) + ": " + cv.label + (cv.focus ? " (" + cv.focus + ")" : "") + " ===\n" + cv.text).join("\n\n");
    }
    const chosen = cvs.find(c => c.id === selectedCvId);
    return chosen ? chosen.text : "";
  };

  const aiInstruction = selectedCvId === "auto"
    ? "The candidate has provided multiple CV variants below. FIRST decide which variant best matches the target role and JD, then tailor against that one. State your chosen variant in 'chosenCv' field."
    : "Tailor against the single CV provided.";

  const run = async () => {
    if (!jd.trim() || !hasCv) return;
    setLoading(true); setError("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          messages: [{
            role: "user",
            content: "You are a thoughtful, optimistic-but-honest hiring evaluator helping an MBA candidate prioritize where to invest application effort.\n\n" + HONEST_RUBRIC + "\n\n" + aiInstruction + "\n\nCANDIDATE PROFILE:\n" + buildProfileForAi() + "\n\nTARGET ROLE: " + app.role + " at " + app.company + "\n\nJOB DESCRIPTION:\n" + jd + "\n\nRespond with ONLY a valid JSON object (no markdown, no backticks, no preamble):\n{\n  \"chosenCv\": \"<which CV variant label was used; empty if only one provided>\",\n  \"fitScore\": <integer 1-10 — apply the rubric>,\n  \"fitRationale\": \"<one honest sentence: state the switch axes in play and what makes it possible>\",\n  \"switchAxes\": {\n    \"role\": \"<same|adjacent|different>\",\n    \"industry\": \"<same|adjacent|different>\",\n    \"location\": \"<same|adjacent|different>\"\n  },\n  \"transferableStrengths\": [\"<concrete experience from the CV that bridges into this role even if the surface doesn't match>\"],\n  \"mustHavesMet\": [\"<JD must-have clearly met, with evidence>\"],\n  \"mustHavesMissing\": [\"<JD must-have NOT clearly met, with what's missing AND how the candidate could bridge it>\"],\n  \"hardBlockers\": [\"<actual hard blocker like clearance/citizenship/mandatory cert with no path; empty array if none>\"],\n  \"realisticOutcome\": \"<one sentence: shortlist-likely / strong-cover-needed / referral-recommended / stretch-with-unique-angle / likely-auto-reject>\",\n  \"jdSummary\": [\"<key thing the role wants>\"],\n  \"strengths\": [\"<specific experience to emphasize in the application>\"],\n  \"gaps\": [\"<gap + specifically how to address it>\"],\n  \"keywords\": [{\"term\": \"<keyword>\", \"covered\": <true/false>, \"note\": \"<short tip>\"}],\n  \"bulletRewrites\": [{\"original\": \"<bullet>\", \"rewritten\": \"<retuned, but DO NOT fabricate experience the candidate does not have>\"}],\n  \"tailoredResume\": \"<a complete one-page tailored resume in plain text, using ONLY truthful information fro"
          }]
        })
      });
      const result = await response.json();
      let text = result.content.filter(b => b.type === "text").map(b => b.text).join("\n");
      text = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(text);
      setData(parsed);
      const initialChecks = {};
      (parsed.keywords || []).forEach((k, i) => { initialChecks[i] = k.covered; });
      setChecked(initialChecks);
      onSave({ jd, studioData: parsed, keywordChecks: initialChecks, fitScore: parsed.fitScore, selectedCvId });
      setActiveTab("fit");
    } catch (e) {
      setError("Something went wrong analyzing the JD. Please try again.");
    }
    setLoading(false);
  };

  const toggleCheck = (i) => {
    const next = { ...checked, [i]: !checked[i] };
    setChecked(next);
    onSave({ keywordChecks: next });
  };

  const coveredCount = data && data.keywords ? Object.values(checked).filter(Boolean).length : 0;
  const totalKeywords = data && data.keywords ? data.keywords.length : 0;

  const [coverLetter, setCoverLetter] = useState(app.coverLetter || "");
  const [coverLoading, setCoverLoading] = useState(false);
  const [coverError, setCoverError] = useState("");
  const [coverTone, setCoverTone] = useState("Professional");
  const [coverLength, setCoverLength] = useState("Standard (300-400 words)");
  const [coverHook, setCoverHook] = useState("");

  const generateCover = async () => {
    if (!jd.trim() || !hasCv) return;
    setCoverLoading(true); setCoverError("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: "Write a cover letter for the candidate, tailored to the role and JD.\n\nCANDIDATE CV:\n" + buildProfileForAi() + "\n\nROLE: " + app.role + " at " + app.company + "\n\nJD:\n" + jd + "\n\nTONE: " + coverTone + "\nLENGTH: " + coverLength + (coverHook.trim() ? "\nOPENING HOOK / PERSONAL ANGLE: " + coverHook : "") + "\n\nGUIDELINES:\n- Open with a specific hook tying the candidate's strongest evidence to the role, not generic 'I am writing to apply...'\n- Use 2-3 paragraphs of substance, each anchored to a concrete achievement with metrics from the CV.\n- Mirror the JD's language where it fits naturally (avoid keyword-stuffing).\n- Close with a confident, specific next step.\n- No platitudes ('passionate about', 'team player', 'detail-oriented').\n- Address by 'Dear Hiring Manager' unless a name is visible in the JD.\n- Output ONLY the letter text, ready to copy-paste. No commentary, no headers like 'Cover Letter:'."
          }]
        })
      });
      const result = await response.json();
      const text = result.content.filter(b => b.type === "text").map(b => b.text).join("\n").trim();
      setCoverLetter(text);
      onSave({ coverLetter: text });
    } catch (e) {
      setCoverError("Couldn't generate. Try again.");
    }
    setCoverLoading(false);
  };

  const tabs = [
    { id: "fit", label: "Fit Analysis" },
    { id: "keywords", label: "Keyword Gap (" + coveredCount + "/" + totalKeywords + ")" },
    { id: "bullets", label: "Bullet Rewrites" },
    { id: "resume", label: "Tailored Resume" },
    { id: "cover", label: "Cover Letter" },
  ];

  return (
    <Modal onClose={onClose} title={"Resume Studio - " + app.company} wide>
      {!hasCv && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm flex-1">
            <p className="font-medium text-amber-900">No CV uploaded yet</p>
            <p className="text-amber-800 mt-0.5 text-xs">Resume Studio needs at least one CV variant to tailor outputs. Open the Profile tab to add one.</p>
          </div>
          <button onClick={onGoToProfile} className="text-xs px-3 py-1.5 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 shrink-0">Go to Profile</button>
        </div>
      )}

      {hasCv && (
        <div className="mb-4">
          <label className="text-xs font-medium text-slate-600 uppercase tracking-wider block mb-1.5">Tailor against</label>
          <select value={selectedCvId} onChange={e => setSelectedCvId(e.target.value)} className={inputCls}>
            <option value="auto">Auto-pick best variant ({cvs.length} available)</option>
            {cvs.map(cv => <option key={cv.id} value={cv.id}>{cv.label}{cv.focus ? " - " + cv.focus : ""}</option>)}
          </select>
        </div>
      )}

      <p className="text-sm text-slate-600 mb-3">Paste the job description for <span className="text-purple-700 font-medium">{app.role}</span>.</p>
      <textarea value={jd} onChange={e => setJd(e.target.value)}
        onBlur={() => { if (jd !== (app.jd || "")) onSave({ jd }); }}
        rows={5}
        className={inputCls + " resize-none"} placeholder="Paste the full job description here..." />
      <button onClick={run} disabled={loading || !jd.trim() || !hasCv}
        className="mt-3 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed">
        {loading ? <span className="flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Analyzing...</span> : <span className="flex items-center gap-2"><Wand2 className="w-4 h-4" /> {data ? "Re-run Analysis" : "Evaluate & Tailor"}</span>}
      </button>
      {error && <p className="mt-3 text-sm text-rose-600">{error}</p>}

      {hasCv && (
        <div className="mt-5">
          <div className="flex gap-1 border-b border-amber-200 mb-4 overflow-x-auto">
            {tabs.map(t => {
              const disabled = !data && t.id !== "cover";
              return (
                <button key={t.id} onClick={() => !disabled && setActiveTab(t.id)} disabled={disabled}
                  className={"px-3 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition " + (activeTab === t.id ? "border-purple-600 text-purple-700" : "border-transparent " + (disabled ? "text-slate-300 cursor-not-allowed" : "text-slate-500 hover:text-slate-800"))}>{t.label}</button>
              );
            })}
          </div>
          {!data && activeTab !== "cover" && (
            <p className="text-xs text-slate-500 text-center py-4">Run the analysis above to populate Fit, Keywords, Bullets, and Tailored Resume. The <button onClick={() => setActiveTab("cover")} className="text-purple-700 underline font-medium">Cover Letter</button> tab works independently — just JD + CV.</p>
          )}

          {data && activeTab === "fit" && (
            <div className="space-y-4">
              {data.chosenCv && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span>Tailored against your <span className="font-semibold">{data.chosenCv}</span> variant.</span>
                </div>
              )}
              <div className="flex items-center gap-4 bg-gradient-to-r from-yellow-50 to-purple-50 border border-amber-200 rounded-lg p-4">
                <div className={"w-16 h-16 rounded-full flex items-center justify-center shrink-0 shadow-md bg-gradient-to-br " + (data.fitScore >= 8 ? "from-emerald-400 to-emerald-600" : data.fitScore >= 6 ? "from-amber-400 to-amber-600" : data.fitScore >= 4 ? "from-orange-400 to-orange-600" : "from-rose-400 to-rose-600")}>
                  <span className="text-2xl font-bold text-white">{data.fitScore}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500 uppercase tracking-wider">Honest Fit Score</p>
                  <p className="text-sm text-slate-800 mt-1">{data.fitRationale}</p>
                </div>
              </div>

              {data.realisticOutcome && (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Realistic outcome</p>
                  <p className="text-sm text-slate-800">{data.realisticOutcome}</p>
                </div>
              )}

              {data.switchAxes && (
                <div className="bg-white border border-amber-200 rounded-lg p-3">
                  <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Switch axes in play</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: "role", label: "Role" },
                      { key: "industry", label: "Industry" },
                      { key: "location", label: "Location" },
                    ].map(ax => {
                      const v = data.switchAxes[ax.key] || "—";
                      const cls = v === "same" ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : v === "adjacent" ? "border-amber-300 bg-amber-50 text-amber-800"
                        : v === "different" ? "border-orange-300 bg-orange-50 text-orange-800"
                        : "border-slate-300 bg-slate-50 text-slate-700";
                      return (
                        <div key={ax.key} className={"rounded-lg border px-2 py-2 text-center " + cls}>
                          <p className="text-[10px] uppercase tracking-wider opacity-70">{ax.label}</p>
                          <p className="text-sm font-semibold capitalize mt-0.5">{v}</p>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2 italic">Same = direct extension · Adjacent = partial switch (counts ~0.5) · Different = full switch axis</p>
                </div>
              )}

              {data.hardBlockers && data.hardBlockers.length > 0 && (
                <div className="bg-rose-50 border border-rose-300 rounded-lg p-3">
                  <p className="text-xs text-rose-700 uppercase tracking-wider mb-1 font-semibold flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Hard blockers</p>
                  <ul className="space-y-1">
                    {data.hardBlockers.map((b, i) => <li key={i} className="text-sm text-rose-900">• {b}</li>)}
                  </ul>
                </div>
              )}

              {data.transferableStrengths && data.transferableStrengths.length > 0 && (
                <Section title="Transferable strengths that bridge to this role" items={data.transferableStrengths} dot="bg-purple-500" />
              )}

              {data.mustHavesMet && data.mustHavesMet.length > 0 && (
                <Section title="Must-haves you clearly meet" items={data.mustHavesMet} dot="bg-emerald-500" />
              )}
              {data.mustHavesMissing && data.mustHavesMissing.length > 0 && (
                <Section title="Must-haves not yet met (and how to bridge)" items={data.mustHavesMissing} dot="bg-amber-500" />
              )}

              <Section title="What this role wants" items={data.jdSummary} dot="bg-purple-500" />
              <Section title="Your strengths to emphasize" items={data.strengths} dot="bg-emerald-500" />
              <Section title="Gaps to address" items={data.gaps} dot="bg-amber-500" />
            </div>
          )}

          {data && activeTab === "keywords" && (
            <div className="space-y-2">
              <p className="text-sm text-slate-600 mb-3">Tick off keywords as you work them into your resume.</p>
              {(data.keywords || []).map((k, i) => (
                <button key={i} onClick={() => toggleCheck(i)}
                  className="w-full flex items-start gap-3 text-left p-3 bg-white border border-amber-200 rounded-lg hover:border-purple-300 transition">
                  {checked[i] ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" /> : <Circle className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />}
                  <div className="min-w-0 flex-1">
                    <p className={"font-medium " + (checked[i] ? "text-slate-800" : "text-purple-700")}>{k.term}</p>
                    {k.note && <p className="text-xs text-slate-500 mt-0.5">{k.note}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}

          {data && activeTab === "bullets" && (
            <div className="space-y-4">
              {(data.bulletRewrites || []).map((b, i) => <BulletRewrite key={i} original={b.original} rewritten={b.rewritten} />)}
            </div>
          )}

          {data && activeTab === "resume" && data.tailoredResume && (
            <TailoredResume text={data.tailoredResume} company={app.company} />
          )}

          {activeTab === "cover" && (
            <CoverLetterStudio
              hasCv={hasCv}
              jd={jd}
              tone={coverTone} setTone={setCoverTone}
              length={coverLength} setLength={setCoverLength}
              hook={coverHook} setHook={setCoverHook}
              letter={coverLetter} setLetter={setCoverLetter}
              loading={coverLoading}
              error={coverError}
              onGenerate={generateCover}
              company={app.company}
              role={app.role}
            />
          )}
        </div>
      )}

      {!data && activeTab !== "cover" && hasCv && (
        <p className="mt-4 text-xs text-slate-500 text-center">Run the analysis above to populate the other tabs, or jump straight to <button onClick={() => setActiveTab("cover")} className="text-purple-700 underline font-medium">Cover Letter</button> — that works with just your CV and the JD.</p>
      )}

      {!data && activeTab === "cover" && (
        <div className="mt-5">
          <CoverLetterStudio
            hasCv={hasCv}
            jd={jd}
            tone={coverTone} setTone={setCoverTone}
            length={coverLength} setLength={setCoverLength}
            hook={coverHook} setHook={setCoverHook}
            letter={coverLetter} setLetter={setCoverLetter}
            loading={coverLoading}
            error={coverError}
            onGenerate={generateCover}
            company={app.company}
            role={app.role}
          />
        </div>
      )}
    </Modal>
  );
}

function CoverLetterStudio({ hasCv, jd, tone, setTone, length, setLength, hook, setHook, letter, setLetter, loading, error, onGenerate, company, role }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { if (navigator.clipboard) navigator.clipboard.writeText(letter); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const download = () => {
    const blob = new Blob([letter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "CoverLetter_" + (company || "role").replace(/[^a-z0-9]/gi, "_") + ".txt";
    a.click(); URL.revokeObjectURL(url);
  };
  const TONES = ["Professional", "Conversational", "Confident", "Warm"];
  const LENGTHS = ["Short (150-200 words)", "Standard (300-400 words)", "Detailed (450-600 words)"];

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-xs text-purple-900 flex items-start gap-2">
        <Mail className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <span>Generates a tailored cover letter for <span className="font-semibold">{role}</span> at <span className="font-semibold">{company}</span> using your CV and the JD above.</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Field label="Tone">
          <select value={tone} onChange={e => setTone(e.target.value)} className={inputCls}>
            {TONES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Length">
          <select value={length} onChange={e => setLength(e.target.value)} className={inputCls}>
            {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </Field>
      </div>

      <Field label="Opening hook / personal angle (optional)">
        <input value={hook} onChange={e => setHook(e.target.value)} className={inputCls} placeholder="e.g. Referral from X, a specific company moment, why this firm" />
      </Field>

      <button onClick={onGenerate} disabled={loading || !jd.trim() || !hasCv}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed">
        {loading ? <span className="flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Drafting...</span> : <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> {letter ? "Regenerate cover letter" : "Generate cover letter"}</span>}
      </button>
      {!jd.trim() && <p className="text-xs text-amber-700">Paste the JD in the textarea above first.</p>}
      {error && <p className="text-xs text-rose-600">{error}</p>}

      {letter && (
        <div className="space-y-3">
          <div className="flex gap-2">
            <button onClick={copy} className="flex items-center gap-2 px-3 py-2 bg-white border border-amber-300 text-slate-700 rounded-lg hover:border-purple-400 transition text-sm">
              {copied ? <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Copied</span> : <span className="flex items-center gap-2"><Copy className="w-4 h-4" /> Copy</span>}
            </button>
            <button onClick={download} className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-md transition text-sm">
              <Download className="w-4 h-4" /> Download
            </button>
          </div>
          <textarea value={letter} onChange={e => setLetter(e.target.value)} rows={18}
            className={inputCls + " resize-y font-sans leading-relaxed"} />
          <p className="text-xs text-slate-500">{letter.trim().split(/\s+/).filter(Boolean).length} words. Edit inline before copying.</p>
        </div>
      )}
    </div>
  );
}

function Section({ title, items, dot }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-slate-800 mb-2">{title}</h4>
      <ul className="space-y-1.5">
        {(items || []).map((it, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
            <span className={"w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 " + dot} />{it}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BulletRewrite({ original, rewritten }: any) {
  const [copied, setCopied] = useState(false);
  const copy = () => { if (navigator.clipboard) navigator.clipboard.writeText(rewritten); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  return (
    <div className="bg-white border border-amber-200 rounded-lg p-4">
      <p className="text-xs text-slate-500 mb-1">Original</p>
      <p className="text-sm text-slate-500 line-through decoration-slate-300 mb-3">{original}</p>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1"><p className="text-xs text-purple-700 mb-1 font-medium">Tailored</p><p className="text-sm text-slate-800">{rewritten}</p></div>
        <button onClick={copy} className="p-2 text-slate-400 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition shrink-0">
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function TailoredResume({ text, company }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { if (navigator.clipboard) navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "Resume_" + company.replace(/[^a-z0-9]/gi, "_") + ".txt";
    a.click(); URL.revokeObjectURL(url);
  };
  return (
    <div>
      <div className="flex gap-2 mb-3">
        <button onClick={copy} className="flex items-center gap-2 px-3 py-2 bg-white border border-amber-300 text-slate-700 rounded-lg hover:border-purple-400 transition text-sm">
          {copied ? <span className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Copied</span> : <span className="flex items-center gap-2"><Copy className="w-4 h-4" /> Copy</span>}
        </button>
        <button onClick={download} className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-md transition text-sm">
          <Download className="w-4 h-4" /> Download
        </button>
      </div>
      <pre className="text-sm text-slate-800 bg-amber-50 border border-amber-200 rounded-lg p-4 whitespace-pre-wrap font-sans leading-relaxed max-h-[400px] overflow-y-auto">{text}</pre>
    </div>
  );
}

// ============== JD PASTE ==============
function JdPasteModal({ profile, onAdd, onClose, onGoToProfile }) {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [parsed, setParsed] = useState(null);
  const hasProfile = profile && profile.trim().length > 0;

  const parse = async () => {
    if (!text.trim() || !hasProfile) return;
    setLoading(true); setError("");
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1500,
          messages: [{
            role: "user",
            content: "Extract key fields and assess fit for this candidate.\n\nCANDIDATE PROFILE:\n" + profile + "\n\n=== JOB DESCRIPTION ===\n" + text + "\n=== END ===\n\nRespond with ONLY a valid JSON object (no markdown, no backticks):\n{\n  \"company\": \"<firm>\",\n  \"role\": \"<title>\",\n  \"location\": \"<location, default London, UK>\",\n  \"salary\": \"<if stated, else empty>\",\n  \"deadline\": \"<YYYY-MM-DD if stated, else empty>\",\n  \"level\": \"<Intern|Analyst/BA|Associate|Consultant|Senior Consultant|Manager|Senior Manager|Director+|Other>\",\n  \"sponsorship\": \"<Confirmed|Unlikely|Unknown>\",\n  \"tier\": \"<Strong fit|Stretch (referral helps)|Reach|Worth a look|Low priority|Blocked (clearance)|Unclear>\",\n  \"notes\": \"<2-3 sentences>\"\n}"
          }]
        })
      });
      const result = await response.json();
      let raw = result.content.filter(b => b.type === "text").map(b => b.text).join("\n").replace(/```json|```/g, "").trim();
      const p = JSON.parse(raw);
      if (url.trim()) p.url = url.trim();
      p.jd = text; // Preserve the raw JD so the role isn't marked "No JD yet" after import
      setParsed(p);
    } catch (e) {
      setError("Could not parse. Try pasting more, or add the role manually.");
    }
    setLoading(false);
  };

  return (
    <Modal onClose={onClose} title="Paste a job description" wide>
      {!hasProfile && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm flex-1">
            <p className="font-medium text-amber-900">Set your profile first</p>
            <p className="text-amber-800 mt-0.5 text-xs">JD assessment needs your background to score fit. Open the Profile tab and paste it in.</p>
          </div>
          <button onClick={onGoToProfile} className="text-xs px-3 py-1.5 bg-amber-600 text-white font-semibold rounded hover:bg-amber-700 shrink-0">Go to Profile</button>
        </div>
      )}
      <p className="text-sm text-slate-600 mb-3">Paste the JD and I will extract everything and assess fit.</p>
      <div className="space-y-3">
        <input value={url} onChange={e => setUrl(e.target.value)} className={inputCls} placeholder="Job URL (optional)" />
        <textarea value={text} onChange={e => setText(e.target.value)} rows={8}
          className={inputCls + " resize-none"} placeholder="Paste the full job description here..." />
        <button onClick={parse} disabled={loading || !text.trim() || !hasProfile}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-semibold py-2.5 rounded-lg hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed">
          {loading ? <span className="flex items-center gap-2"><Loader className="w-4 h-4 animate-spin" /> Extracting...</span> : <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Parse and assess</span>}
        </button>
        {error && <p className="text-sm text-rose-600">{error}</p>}

        {parsed && (
          <div className="mt-4 bg-gradient-to-br from-yellow-50 to-purple-50 border border-amber-200 rounded-lg p-4 space-y-2">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">Company:</span> <span className="text-slate-800 font-medium">{parsed.company}</span></div>
              <div><span className="text-slate-500">Role:</span> <span className="text-slate-800 font-medium">{parsed.role}</span></div>
              <div><span className="text-slate-500">Location:</span> <span className="text-slate-800">{parsed.location}</span></div>
              <div><span className="text-slate-500">Level:</span> <span className="text-slate-800">{parsed.level}</span></div>
              {parsed.salary && <div><span className="text-slate-500">Salary:</span> <span className="text-slate-800">{parsed.salary}</span></div>}
              {parsed.deadline && <div><span className="text-slate-500">Deadline:</span> <span className="text-slate-800">{parsed.deadline}</span></div>}
            </div>
            <div className="flex gap-2 flex-wrap pt-1">
              {parsed.tier && <span className={"text-xs px-2 py-1 rounded border " + (TIER_COLORS[parsed.tier] || "border-slate-300")}>{parsed.tier}</span>}
              {parsed.sponsorship && <span className={"text-xs px-2 py-1 rounded border " + SPONSOR_COLORS[parsed.sponsorship]}>Visa: {parsed.sponsorship}</span>}
            </div>
            {parsed.notes && <p className="text-sm text-slate-700 bg-white/60 p-3 rounded border border-amber-200">{parsed.notes}</p>}
            <button onClick={() => onAdd(parsed)} className="w-full mt-2 bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold py-2 rounded-lg hover:shadow-md transition flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add to tracker
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ============== MODAL ==============
function Modal({ children, onClose, title, wide }: any) {
  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div className={"bg-white border border-amber-200 rounded-2xl shadow-2xl w-full flex flex-col my-auto " + (wide ? "max-w-2xl" : "max-w-lg") + " max-h-[calc(100vh-1rem)] sm:max-h-[90vh]"} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-amber-200 bg-gradient-to-r from-yellow-50 to-purple-50 rounded-t-2xl shrink-0">
          <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-1 text-slate-500 hover:text-slate-800 hover:bg-amber-100 rounded transition"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
