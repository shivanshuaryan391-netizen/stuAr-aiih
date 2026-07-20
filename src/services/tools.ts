import type { ToolDef } from '@/types'

const EDU_SYSTEM = `You are StuAr AI's education engine. Produce accurate, well-structured, syllabus-aware content in clean markdown. Use headings, numbered steps, bold key terms, tables for comparisons, and $...$ for math. Always include a short "Quick check" or "Common mistakes" section where it adds value.`

const WRITER_SYSTEM = `You are StuAr AI's writing studio. Produce polished, publication-ready text in clean markdown. Match the requested tone exactly. No filler, no cliches.`

const CODE_SYSTEM = `You are StuAr AI's coding engine. Produce correct, idiomatic, well-commented code in fenced code blocks with language tags. Explain key decisions briefly. Mention complexity and edge cases when relevant.`

const BIZ_SYSTEM = `You are StuAr AI's business studio. Produce practical, specific, professional output in clean markdown with tables where useful. Avoid generic advice — be concrete.`

export const CATEGORIES = ['Education', 'Writing', 'Coding', 'Business', 'Productivity', 'Design'] as const

export const TOOLS: ToolDef[] = [
  // ---------------- Education ----------------
  {
    id: 'ai-tutor',
    name: 'AI Tutor',
    category: 'Education',
    icon: 'GraduationCap',
    tagline: 'Any topic, taught your way',
    description: 'A patient personal tutor that explains any concept at your level with examples, analogies and practice checks.',
    fields: [
      { name: 'topic', label: 'What do you want to learn?', type: 'text', placeholder: 'e.g. Integration by parts', required: true },
      { name: 'level', label: 'Your level', type: 'select', options: ['Middle school', 'High school', 'Undergraduate', 'Graduate', 'Self-taught beginner'], required: true },
      { name: 'question', label: 'Specific question (optional)', type: 'textarea', placeholder: 'What exactly confuses you?', rows: 3 },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Teach me "${v.topic}" for a ${v.level} learner. Structure: 1) intuition with a real-world analogy, 2) the core idea step by step, 3) one worked example, 4) common mistakes, 5) a 3-question quick check with answers hidden in a details-style summary.${v.question ? ` Focus especially on this doubt: ${v.question}` : ''}`,
  },
  {
    id: 'homework-solver',
    name: 'Homework Solver',
    category: 'Education',
    icon: 'BookOpen',
    tagline: 'Step-by-step homework help',
    description: 'Paste any homework question and get a fully worked, explained solution — not just the final answer.',
    fields: [
      { name: 'subject', label: 'Subject', type: 'select', options: ['Math', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Economics', 'Other'], required: true },
      { name: 'question', label: 'Your question', type: 'textarea', placeholder: 'Paste the full homework question here…', rows: 5, required: true },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Solve this ${v.subject} homework problem step by step. First restate what is being asked, then show the method, then the full worked solution, then verify the answer, and finish with one similar practice problem (with its answer at the very end).\n\nProblem:\n${v.question}`,
  },
  {
    id: 'math-solver',
    name: 'Math Solver',
    category: 'Education',
    icon: 'Calculator',
    tagline: 'From algebra to calculus',
    description: 'Solves equations, calculus, linear algebra and more — with every step justified and formulas rendered.',
    fields: [
      { name: 'problem', label: 'Math problem', type: 'textarea', placeholder: 'e.g. Solve x² − 5x + 6 = 0, or ∫ x·eˣ dx', rows: 4, required: true },
      { name: 'level', label: 'Level', type: 'select', options: ['School', 'High school', 'College', 'Competition'], required: true },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Solve this ${v.level}-level math problem with rigorous steps. Use $...$ notation for every formula, justify each transformation, box the final answer, and add a "common mistake" warning.\n\nProblem:\n${v.problem}`,
  },
  {
    id: 'physics-solver',
    name: 'Physics Solver',
    category: 'Education',
    icon: 'Atom',
    tagline: 'Concepts + calculations',
    description: 'Mechanics to modern physics: free-body reasoning, formula selection, unit checks and worked solutions.',
    fields: [
      { name: 'topic', label: 'Topic', type: 'select', options: ['Mechanics', 'Waves & Optics', 'Electricity & Magnetism', 'Thermodynamics', 'Modern Physics', 'Other'], required: true },
      { name: 'problem', label: 'Problem', type: 'textarea', placeholder: 'Describe the problem with all given values…', rows: 5, required: true },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Solve this ${v.topic} physics problem. Structure: given data with units, relevant principles/formulas, free-body or concept reasoning, step-by-step calculation with unit tracking, final answer with significant figures, and a sanity check.\n\nProblem:\n${v.problem}`,
  },
  {
    id: 'chemistry-solver',
    name: 'Chemistry Solver',
    category: 'Education',
    icon: 'FlaskConical',
    tagline: 'Reactions made clear',
    description: 'Stoichiometry, organic mechanisms, equilibrium and more — balanced, explained and verified.',
    fields: [
      { name: 'topic', label: 'Area', type: 'select', options: ['Physical', 'Organic', 'Inorganic', 'Analytical', 'Biochemistry'], required: true },
      { name: 'problem', label: 'Problem', type: 'textarea', placeholder: 'e.g. Balance the redox reaction… / Find the pH of…', rows: 5, required: true },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Solve this ${v.topic} chemistry problem. Balance any equations, show mole/stoichiometry work, explain the underlying concept, give the final answer with units, and flag common exam mistakes.\n\nProblem:\n${v.problem}`,
  },
  {
    id: 'biology-tutor',
    name: 'Biology Tutor',
    category: 'Education',
    icon: 'Dna',
    tagline: 'Life science, visualized in words',
    description: 'From cell biology to ecology — clear explanations with process flows, diagrams-in-text and memory hooks.',
    fields: [
      { name: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. Photosynthesis, DNA replication, nephron', required: true },
      { name: 'question', label: 'Your question', type: 'textarea', placeholder: 'What do you want to understand?', rows: 4, required: true },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Explain this biology topic (${v.topic}) thoroughly: definition, the process as a numbered flow, key terms in bold, a comparison table if relevant, one mnemonic, and 3 likely exam questions with one-line answers.\n\nQuestion: ${v.question}`,
  },
  {
    id: 'notes-generator',
    name: 'Notes Generator',
    category: 'Education',
    icon: 'NotebookPen',
    tagline: 'Beautiful notes in seconds',
    description: 'Turn any topic or raw text into crisp, structured revision notes with tables, bullets and key highlights.',
    fields: [
      { name: 'topic', label: 'Topic or title', type: 'text', placeholder: 'e.g. The French Revolution', required: true },
      { name: 'source', label: 'Source text (optional)', type: 'textarea', placeholder: 'Paste textbook text or lecture transcript to compress…', rows: 5 },
      { name: 'style', label: 'Note style', type: 'select', options: ['Cornell', 'Bullet outline', 'Exam cram sheet', 'Detailed summary'], required: true },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Create ${v.style} study notes on "${v.topic}". Include: key definitions, a comparison or facts table, bullet hierarchies, bold must-remember facts, and a 5-line "last-minute recap".${v.source ? ` Base them on this source text:\n${v.source}` : ''}`,
  },
  {
    id: 'mcq-generator',
    name: 'MCQ Generator',
    category: 'Education',
    icon: 'ListChecks',
    tagline: 'Exam-grade questions',
    description: 'Generate multiple-choice questions with plausible distractors and full answer explanations.',
    fields: [
      { name: 'topic', label: 'Topic', type: 'text', placeholder: 'e.g. Thermodynamics', required: true },
      { name: 'count', label: 'Number of questions', type: 'number', min: 3, max: 25, placeholder: '10', required: true },
      { name: 'difficulty', label: 'Difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard', 'Mixed'], required: true },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Create ${v.count} ${v.difficulty} multiple-choice questions on "${v.topic}". For each: the question, 4 options (A–D) with realistic distractors, the correct answer letter, and a 2-line explanation. Number every question. Put all answers in a collapsible-style "Answer key" section at the end.`,
  },
  {
    id: 'quiz-generator',
    name: 'Quiz Generator',
    category: 'Education',
    icon: 'ClipboardList',
    tagline: 'Interactive practice quizzes',
    description: 'Generate an interactive quiz, answer it right here, and get instant scoring with explanations.',
    custom: 'quiz',
    fields: [],
  },
  {
    id: 'flashcards',
    name: 'Flashcards',
    category: 'Education',
    icon: 'Layers',
    tagline: 'Smart decks that stick',
    description: 'Generate flip-card decks on any topic, review them interactively, and save them to your library.',
    custom: 'flashcards',
    fields: [],
  },
  {
    id: 'mind-map-generator',
    name: 'Mind Map Generator',
    category: 'Education',
    icon: 'BrainCircuit',
    tagline: 'See the whole picture',
    description: 'Turn a topic into a hierarchical mind map you can copy into any mapping tool or study from directly.',
    fields: [
      { name: 'topic', label: 'Central topic', type: 'text', placeholder: 'e.g. World War II', required: true },
      { name: 'depth', label: 'Detail level', type: 'select', options: ['Overview (2 levels)', 'Standard (3 levels)', 'Deep dive (4 levels)'], required: true },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Build a ${v.depth} mind map for "${v.topic}" as an indented text tree using markdown. Central node first, then branches as nested bullets with emojis for each main branch. End with a "connections" list of 5 cross-links between branches, and a Mermaid mindmap code block.`,
  },
  {
    id: 'study-planner',
    name: 'Study Planner',
    category: 'Education',
    icon: 'CalendarClock',
    tagline: 'Your week, optimized',
    description: 'A personalized day-by-day study schedule built around your subjects, hours and goals.',
    fields: [
      { name: 'subjects', label: 'Subjects / topics', type: 'text', placeholder: 'e.g. Math, Physics, English', required: true },
      { name: 'hours', label: 'Hours per day', type: 'number', min: 1, max: 14, placeholder: '4', required: true },
      { name: 'days', label: 'Plan length (days)', type: 'number', min: 3, max: 30, placeholder: '7', required: true },
      { name: 'goal', label: 'Goal', type: 'text', placeholder: 'e.g. Finish calculus unit, prepare midterms' },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Build a ${v.days}-day study plan for these subjects: ${v.subjects}. Available: ${v.hours} hours/day.${v.goal ? ` Goal: ${v.goal}.` : ''} Output a markdown table per day with time blocks, subject, activity (learn / practice / review / test), and resources hint. Apply spaced repetition and interleaving. Add daily targets and one rest/catch-up slot.`,
  },
  {
    id: 'exam-planner',
    name: 'Exam Planner',
    category: 'Education',
    icon: 'CalendarRange',
    tagline: 'Countdown to confidence',
    description: 'Reverse-engineer your exam date into a milestone-driven preparation plan.',
    fields: [
      { name: 'exam', label: 'Exam name', type: 'text', placeholder: 'e.g. JEE Main, SAT, Biology final', required: true },
      { name: 'date', label: 'Exam date', type: 'text', placeholder: 'e.g. 2026-09-15 or "in 6 weeks"', required: true },
      { name: 'syllabus', label: 'Syllabus / units', type: 'textarea', placeholder: 'List the units or chapters to cover…', rows: 4, required: true },
      { name: 'hours', label: 'Study hours per day', type: 'number', min: 1, max: 14, placeholder: '5', required: true },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Create an exam preparation plan for "${v.exam}" on ${v.date}, studying ${v.hours}h/day. Syllabus:\n${v.syllabus}\n\nPhases: coverage → practice → mocks → revision. Output: phase overview table, week-by-week milestones, daily slot template, mock-test schedule, and a final-week strategy. Be realistic about pacing.`,
  },
  {
    id: 'revision-planner',
    name: 'Revision Planner',
    category: 'Education',
    icon: 'Repeat',
    tagline: 'Never forget what you learned',
    description: 'A spaced-repetition revision schedule that tells you exactly what to review each day.',
    fields: [
      { name: 'topics', label: 'Topics to revise', type: 'textarea', placeholder: 'One topic per line…', rows: 5, required: true },
      { name: 'days', label: 'Revision window (days)', type: 'number', min: 3, max: 60, placeholder: '14', required: true },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Create a ${v.days}-day spaced-repetition revision plan for these topics:\n${v.topics}\n\nUse intervals of 1-3-7-14 days. Output a day-by-day table: Day | New reviews | Repeat reviews | Active-recall task | Self-test question. Keep daily load balanced.`,
  },
  {
    id: 'pdf-summarizer',
    name: 'PDF Summarizer',
    category: 'Education',
    icon: 'FileText',
    tagline: 'Long docs, short answers',
    description: 'Paste document text and get layered summaries: TL;DR, key points, glossary and quiz questions.',
    fields: [
      { name: 'text', label: 'Document text', type: 'textarea', placeholder: 'Paste the text of your PDF, article or chapter here…', rows: 10, required: true },
      { name: 'length', label: 'Summary depth', type: 'select', options: ['TL;DR only', 'Standard', 'Comprehensive'], required: true },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Summarize this document at "${v.length}" depth. Output: 1) 3-sentence TL;DR, 2) key points as bullets, 3) important terms glossary table, 4) 5 self-test questions with answers, 5) one-paragraph "why this matters".\n\nDocument:\n${v.text}`,
  },
  {
    id: 'ocr-notes-scanner',
    name: 'OCR Notes Scanner',
    category: 'Education',
    icon: 'ScanLine',
    tagline: 'Handwriting → clean notes',
    description: 'Upload a photo of handwritten or printed notes and get them transcribed, cleaned and structured.',
    image: true,
    fields: [
      { name: 'instructions', label: 'What should I do with the notes?', type: 'select', options: ['Transcribe + structure', 'Transcribe + summarize', 'Transcribe + make quiz', 'Transcribe only'], required: true },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Read the text in this image (OCR) and then: ${v.instructions}. Output clean markdown. If any word is illegible, mark it as [?] and continue.`,
  },
  {
    id: 'interview-prep',
    name: 'Interview Prep',
    category: 'Education',
    icon: 'Users',
    tagline: 'Walk in ready',
    description: 'Likely questions, strong sample answers and a practice plan for your specific exam or interview.',
    fields: [
      { name: 'role', label: 'Role / exam', type: 'text', placeholder: 'e.g. Software intern, medical school viva', required: true },
      { name: 'focus', label: 'Focus areas', type: 'textarea', placeholder: 'Topics, skills or subjects to emphasize…', rows: 3 },
    ],
    system: EDU_SYSTEM,
    buildPrompt: (v) =>
      `Prepare me for "${v.role}"${v.focus ? ` focusing on: ${v.focus}` : ''}. Output: 10 likely questions (mix technical + behavioral), a model answer framework for each, 5 smart questions I should ask, and a 3-day prep plan.`,
  },

  // ---------------- Writing ----------------
  {
    id: 'essay-writer',
    name: 'Essay Writer',
    category: 'Writing',
    icon: 'PenLine',
    tagline: 'Structured, original essays',
    description: 'Generate well-argued essays with thesis, structure and flow — then learn from how they’re built.',
    fields: [
      { name: 'topic', label: 'Essay topic', type: 'text', placeholder: 'e.g. The impact of social media on attention', required: true },
      { name: 'type', label: 'Essay type', type: 'select', options: ['Argumentative', 'Expository', 'Narrative', 'Descriptive', 'Compare & contrast'], required: true },
      { name: 'words', label: 'Word count', type: 'number', min: 150, max: 3000, placeholder: '800', required: true },
      { name: 'tone', label: 'Tone', type: 'select', options: ['Academic', 'Conversational', 'Persuasive', 'Formal'], required: true },
    ],
    system: WRITER_SYSTEM,
    buildPrompt: (v) =>
      `Write a ${v.words}-word ${v.type} essay on "${v.topic}" in a ${v.tone} tone. Requirements: a bolded thesis statement, clear paragraph structure with topic sentences, one counterargument addressed, and a memorable conclusion. Add a final "How this essay works" box with 3 craft notes.`,
  },
  {
    id: 'grammar-checker',
    name: 'Grammar Checker',
    category: 'Writing',
    icon: 'SpellCheck',
    tagline: 'Polish every sentence',
    description: 'Fix grammar, spelling and style — with explanations so you improve, not just correct.',
    fields: [
      { name: 'text', label: 'Your text', type: 'textarea', placeholder: 'Paste the text to check…', rows: 7, required: true },
    ],
    system: WRITER_SYSTEM,
    buildPrompt: (v) =>
      `Proofread this text. Output: 1) the corrected version, 2) a numbered table of every change (original → fixed → rule), 3) a style score out of 10 with two improvement tips.\n\nText:\n${v.text}`,
  },
  {
    id: 'resume-builder',
    name: 'Resume Builder',
    category: 'Writing',
    icon: 'Briefcase',
    tagline: 'Resumes that get callbacks',
    description: 'Turn your raw experience into an ATS-friendly, achievement-driven resume in markdown.',
    fields: [
      { name: 'name', label: 'Full name', type: 'text', placeholder: 'Alex Morgan', required: true },
      { name: 'role', label: 'Target role', type: 'text', placeholder: 'e.g. Junior Data Analyst', required: true },
      { name: 'experience', label: 'Experience & education', type: 'textarea', placeholder: 'Paste your work history, projects, education…', rows: 6, required: true },
      { name: 'skills', label: 'Key skills', type: 'text', placeholder: 'e.g. Python, Excel, public speaking' },
    ],
    system: WRITER_SYSTEM,
    buildPrompt: (v) =>
      `Build a one-page ATS-friendly resume for ${v.name}, targeting "${v.role}". Raw material:\n${v.experience}\nSkills: ${v.skills || 'infer from experience'}\n\nRules: strong action verbs, quantified achievements (add realistic placeholders like [X%] where numbers are missing), sections: Summary, Experience, Projects, Education, Skills. Output clean markdown, then 3 tailoring tips.`,
  },
  {
    id: 'email-writer',
    name: 'Email Writer',
    category: 'Writing',
    icon: 'Mail',
    tagline: 'The right words, instantly',
    description: 'Professional, friendly or persuasive emails drafted from a few bullet points.',
    fields: [
      { name: 'purpose', label: 'Purpose', type: 'text', placeholder: 'e.g. Ask professor for a recommendation letter', required: true },
      { name: 'recipient', label: 'Recipient', type: 'text', placeholder: 'e.g. Prof. Rao, my physics teacher' },
      { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Friendly', 'Persuasive', 'Apologetic', 'Formal'], required: true },
      { name: 'points', label: 'Key points', type: 'textarea', placeholder: 'What must the email say?', rows: 4, required: true },
    ],
    system: WRITER_SYSTEM,
    buildPrompt: (v) =>
      `Write a ${v.tone} email${v.recipient ? ` to ${v.recipient}` : ''}. Purpose: ${v.purpose}. Must include:\n${v.points}\n\nProvide a subject line, the email body, and one shorter alternative version.`,
  },
  {
    id: 'translator',
    name: 'Translator',
    category: 'Writing',
    icon: 'Languages',
    tagline: 'Fluent in 50+ languages',
    description: 'Natural, context-aware translation with tone options and romanization when helpful.',
    fields: [
      { name: 'text', label: 'Text to translate', type: 'textarea', placeholder: 'Paste or type text…', rows: 5, required: true },
      { name: 'target', label: 'Translate to', type: 'select', options: ['Hindi', 'Spanish', 'French', 'German', 'Portuguese', 'Japanese', 'Korean', 'Chinese (Simplified)', 'Arabic', 'English'], required: true },
      { name: 'register', label: 'Register', type: 'select', options: ['Neutral', 'Formal', 'Casual'], required: true },
    ],
    system: WRITER_SYSTEM,
    buildPrompt: (v) =>
      `Translate this text into ${v.target} (${v.register} register). Output: the translation, a romanized pronunciation line if the script is non-Latin, and 2 notes on any idioms or nuance.\n\nText:\n${v.text}`,
  },
  {
    id: 'cover-letter',
    name: 'Cover Letter Writer',
    category: 'Writing',
    icon: 'SquarePen',
    tagline: 'Stand out in one page',
    description: 'A tailored cover letter that connects your story to the role — no generic filler.',
    fields: [
      { name: 'role', label: 'Role & company', type: 'text', placeholder: 'e.g. Marketing intern at Zylo', required: true },
      { name: 'background', label: 'Your background', type: 'textarea', placeholder: 'Relevant experience, projects, why you…', rows: 5, required: true },
    ],
    system: WRITER_SYSTEM,
    buildPrompt: (v) =>
      `Write a compelling one-page cover letter for "${v.role}" based on:\n${v.background}\n\nHook in the first line, map 3 achievements to the role's needs, show genuine motivation, close with a confident call to action. Then list 3 ways to personalize it further.`,
  },

  // ---------------- Coding ----------------
  {
    id: 'code-generator',
    name: 'Code Generator',
    category: 'Coding',
    icon: 'Code',
    tagline: 'Idea to working code',
    description: 'Describe what you need and get clean, commented, production-quality code in any language.',
    fields: [
      { name: 'language', label: 'Language', type: 'select', options: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C', 'Go', 'Rust', 'SQL', 'HTML/CSS'], required: true },
      { name: 'task', label: 'What should the code do?', type: 'textarea', placeholder: 'e.g. A function that merges two sorted arrays', rows: 4, required: true },
    ],
    system: CODE_SYSTEM,
    buildPrompt: (v) =>
      `Write ${v.language} code that: ${v.task}. Requirements: production-quality, commented at key steps, example usage at the bottom, brief explanation of approach and time/space complexity.`,
  },
  {
    id: 'code-debugger',
    name: 'Code Debugger',
    category: 'Coding',
    icon: 'Bug',
    tagline: 'Find it. Fix it. Learn it.',
    description: 'Paste broken code and the error — get the root cause, the fix, and how to avoid it next time.',
    fields: [
      { name: 'language', label: 'Language', type: 'select', options: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C', 'Go', 'Rust', 'Other'], required: true },
      { name: 'code', label: 'Your code', type: 'textarea', placeholder: 'Paste the buggy code…', rows: 7, required: true },
      { name: 'error', label: 'Error message / wrong behavior', type: 'textarea', placeholder: 'Paste the error or describe what goes wrong…', rows: 3 },
    ],
    system: CODE_SYSTEM,
    buildPrompt: (v) =>
      `Debug this ${v.language} code. Output: 1) root cause explained simply, 2) the fixed code in one block, 3) a diff-style list of changes, 4) a "how to avoid this" tip.\n\nCode:\n\`\`\`\n${v.code}\n\`\`\`\n${v.error ? `Error/behavior:\n${v.error}` : ''}`,
  },
  {
    id: 'code-explainer',
    name: 'Code Explainer',
    category: 'Coding',
    icon: 'ScanSearch',
    tagline: 'Understand any code',
    description: 'Line-by-line walkthroughs of unfamiliar code — what it does, how, and why.',
    fields: [
      { name: 'code', label: 'Code to explain', type: 'textarea', placeholder: 'Paste any code snippet…', rows: 8, required: true },
      { name: 'depth', label: 'Explanation depth', type: 'select', options: ['ELI5', 'Standard', 'Deep technical'], required: true },
    ],
    system: CODE_SYSTEM,
    buildPrompt: (v) =>
      `Explain this code at "${v.depth}" depth. Output: one-line summary, walkthrough by section, key concepts used, time/space complexity, and one possible improvement.\n\n\`\`\`\n${v.code}\n\`\`\``,
  },
  {
    id: 'sql-generator',
    name: 'SQL Generator',
    category: 'Coding',
    icon: 'Database',
    tagline: 'English in, SQL out',
    description: 'Describe your schema and question — get optimized SQL with an explanation of every clause.',
    fields: [
      { name: 'schema', label: 'Table schema', type: 'textarea', placeholder: 'e.g. users(id, name, email), orders(id, user_id, total, created_at)', rows: 4, required: true },
      { name: 'question', label: 'What do you want to query?', type: 'textarea', placeholder: 'e.g. Top 5 customers by revenue last month', rows: 3, required: true },
      { name: 'dialect', label: 'SQL dialect', type: 'select', options: ['PostgreSQL', 'MySQL', 'SQLite', 'SQL Server', 'BigQuery'], required: true },
    ],
    system: CODE_SYSTEM,
    buildPrompt: (v) =>
      `Write a ${v.dialect} query. Schema:\n${v.schema}\n\nNeed: ${v.question}\n\nOutput: the SQL in one code block, a clause-by-clause explanation, and a note on indexing if the tables are large.`,
  },
  {
    id: 'regex-generator',
    name: 'Regex Generator',
    category: 'Coding',
    icon: 'Regex',
    tagline: 'Patterns without pain',
    description: 'Describe what to match — get a tested regex with a token-by-token breakdown.',
    fields: [
      { name: 'description', label: 'What should it match?', type: 'textarea', placeholder: 'e.g. Indian phone numbers with optional +91', rows: 3, required: true },
      { name: 'examples', label: 'Examples (match / not match)', type: 'textarea', placeholder: 'match: +91 98765 43210\nno match: 12345', rows: 3 },
    ],
    system: CODE_SYSTEM,
    buildPrompt: (v) =>
      `Create a regex that matches: ${v.description}.${v.examples ? `\nExamples:\n${v.examples}` : ''}\n\nOutput: the pattern in a code block, a token-by-token explanation table, test results against the examples, and common gotchas.`,
  },

  // ---------------- Business ----------------
  {
    id: 'business-plan',
    name: 'Business Plan',
    category: 'Business',
    icon: 'TrendingUp',
    tagline: 'Idea → investor-ready outline',
    description: 'A structured business plan: market, model, go-to-market, and realistic financial skeleton.',
    fields: [
      { name: 'idea', label: 'Business idea', type: 'textarea', placeholder: 'Describe your idea in a few sentences…', rows: 4, required: true },
      { name: 'market', label: 'Target market', type: 'text', placeholder: 'e.g. Indian college students' },
      { name: 'budget', label: 'Starting budget', type: 'text', placeholder: 'e.g. $2,000 / ₹1.5L' },
    ],
    system: BIZ_SYSTEM,
    buildPrompt: (v) =>
      `Draft a lean business plan for: ${v.idea}. Target market: ${v.market || 'define and justify one'}. Budget: ${v.budget || 'bootstrap'}. Sections: Executive summary, Problem & solution, Market size (TAM/SAM/SOM with estimates), Business model, Go-to-market (first 90 days), Competitive edge, Financial skeleton table, Top 3 risks + mitigations.`,
  },
  {
    id: 'marketing-copy',
    name: 'Marketing Copy',
    category: 'Business',
    icon: 'Megaphone',
    tagline: 'Words that convert',
    description: 'Headlines, ads and landing copy tuned to your audience and platform.',
    fields: [
      { name: 'product', label: 'Product / offer', type: 'text', placeholder: 'e.g. Online chess coaching for kids', required: true },
      { name: 'audience', label: 'Audience', type: 'text', placeholder: 'e.g. Parents of 8–12 year olds', required: true },
      { name: 'platform', label: 'Platform', type: 'select', options: ['Landing page', 'Instagram ad', 'Google ad', 'Email campaign', 'LinkedIn post'], required: true },
      { name: 'tone', label: 'Tone', type: 'select', options: ['Bold', 'Friendly', 'Premium', 'Urgent', 'Playful'], required: true },
    ],
    system: BIZ_SYSTEM,
    buildPrompt: (v) =>
      `Write ${v.tone} marketing copy for "${v.product}" aimed at ${v.audience}, for a ${v.platform}. Output: 5 headline options, primary copy, 3 CTA variants, and a one-line positioning statement. Respect platform norms and character limits.`,
  },
  {
    id: 'invoice-generator',
    name: 'Invoice Generator',
    category: 'Business',
    icon: 'Receipt',
    tagline: 'Clean invoices in seconds',
    description: 'Generate a professional itemized invoice in markdown you can copy into any doc.',
    fields: [
      { name: 'from', label: 'Your name / business', type: 'text', placeholder: 'Acme Studio', required: true },
      { name: 'client', label: 'Client', type: 'text', placeholder: 'Client name & details', required: true },
      { name: 'items', label: 'Line items', type: 'textarea', placeholder: 'Logo design — 2 — $150\nRevisions — 1 — $40', rows: 5, required: true },
      { name: 'notes', label: 'Notes (tax, terms, due date)', type: 'text', placeholder: 'e.g. 18% GST, due in 14 days' },
    ],
    system: BIZ_SYSTEM,
    buildPrompt: (v) =>
      `Create a professional invoice from ${v.from} to ${v.client}. Line items (description — qty — unit price):\n${v.items}\nNotes: ${v.notes || 'none'}\n\nOutput a markdown invoice: header with invoice number and dates, itemized table, subtotal, taxes, total in bold, payment terms, and a thank-you line.`,
  },
  {
    id: 'social-media-generator',
    name: 'Social Media Generator',
    category: 'Business',
    icon: 'Share2',
    tagline: 'A week of content, done',
    description: 'Platform-native posts with hooks, hashtags and CTAs — batched in one run.',
    fields: [
      { name: 'topic', label: 'Topic / campaign', type: 'text', placeholder: 'e.g. Launch of our study app', required: true },
      { name: 'platform', label: 'Platform', type: 'select', options: ['Instagram', 'X / Twitter', 'LinkedIn', 'YouTube community', 'Multi-platform'], required: true },
      { name: 'count', label: 'Number of posts', type: 'number', min: 1, max: 14, placeholder: '7', required: true },
      { name: 'tone', label: 'Tone', type: 'select', options: ['Energetic', 'Professional', 'Witty', 'Inspirational'], required: true },
    ],
    system: BIZ_SYSTEM,
    buildPrompt: (v) =>
      `Create ${v.count} ${v.tone} posts for ${v.platform} about: ${v.topic}. Each post: hook first line, body, CTA, and 3–5 hashtags. Vary formats (tip, story, question, list, myth-bust). Add a mini content calendar table.`,
  },

  // ---------------- Productivity (custom) ----------------
  {
    id: 'todo',
    name: 'Todo',
    category: 'Productivity',
    icon: 'ListTodo',
    tagline: 'Tasks with momentum',
    description: 'A fast, prioritized task list that feeds your XP and streak. Every check-off counts.',
    custom: 'todo',
    fields: [],
  },
  {
    id: 'notes',
    name: 'Notes',
    category: 'Productivity',
    icon: 'StickyNote',
    tagline: 'Your second brain',
    description: 'Markdown notes with instant save and search — synced to your dashboard activity.',
    custom: 'notes',
    fields: [],
  },
  {
    id: 'calendar',
    name: 'Calendar',
    category: 'Productivity',
    icon: 'Calendar',
    tagline: 'Deadlines at a glance',
    description: 'A month view of your exams, task due-dates and study activity.',
    custom: 'calendar',
    fields: [],
  },
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    category: 'Productivity',
    icon: 'Repeat',
    tagline: 'Build unbreakable routines',
    description: 'Weekly check-in grid for your habits with automatic streak math.',
    custom: 'habits',
    fields: [],
  },
  {
    id: 'pomodoro',
    name: 'Pomodoro Timer',
    category: 'Productivity',
    icon: 'Timer',
    tagline: 'Deep focus, on rails',
    description: 'Customizable focus/break cycles with session stats and XP rewards.',
    custom: 'pomodoro',
    fields: [],
  },

  // ---------------- Design ----------------
  {
    id: 'prompt-generator',
    name: 'Prompt Generator',
    category: 'Design',
    icon: 'Wand2',
    tagline: 'Prompts like a pro',
    description: 'Turn a rough idea into a precision prompt for image models, code models or writing.',
    fields: [
      { name: 'goal', label: 'What do you want to create?', type: 'textarea', placeholder: 'e.g. A poster for a hackathon', rows: 3, required: true },
      { name: 'kind', label: 'Prompt type', type: 'select', options: ['Image generation', 'Code generation', 'Writing', 'General AI'], required: true },
      { name: 'style', label: 'Style / constraints', type: 'text', placeholder: 'e.g. cyberpunk, minimal, for beginners' },
    ],
    system: WRITER_SYSTEM,
    buildPrompt: (v) =>
      `Craft 3 ${v.kind} prompts for: ${v.goal}.${v.style ? ` Style/constraints: ${v.style}.` : ''} For each: the prompt in a code block, why it works (1 line), and a variation knob to tweak. End with a "prompt anatomy" cheat-sheet.`,
  },
  {
    id: 'color-palette-generator',
    name: 'Color Palette Generator',
    category: 'Design',
    icon: 'Palette',
    tagline: 'Palettes with purpose',
    description: 'Mood-to-palette generation with hex codes, usage roles and accessibility notes.',
    fields: [
      { name: 'mood', label: 'Mood / theme', type: 'text', placeholder: 'e.g. Calm study app, retro synthwave', required: true },
      { name: 'count', label: 'Colors', type: 'number', min: 3, max: 8, placeholder: '5', required: true },
    ],
    system: WRITER_SYSTEM,
    buildPrompt: (v) =>
      `Design a ${v.count}-color palette for: ${v.mood}. Output: a markdown table with swatch name, hex code, role (primary/background/accent/text), and pairing advice. Include a dark and light variant suggestion and contrast/accessibility notes.`,
  },
  {
    id: 'logo-idea-generator',
    name: 'Logo Idea Generator',
    category: 'Design',
    icon: 'Shapes',
    tagline: 'Concepts before pixels',
    description: 'Five distinct logo directions with rationale, typography and color guidance.',
    fields: [
      { name: 'brand', label: 'Brand name', type: 'text', placeholder: 'e.g. StuAr AI', required: true },
      { name: 'industry', label: 'Industry / vibe', type: 'text', placeholder: 'e.g. EdTech, modern, trustworthy' },
    ],
    system: WRITER_SYSTEM,
    buildPrompt: (v) =>
      `Generate 5 distinct logo concepts for "${v.brand}" (${v.industry || 'modern brand'}). For each: concept name, visual description, why it fits, suggested typography, and a color pair with hex codes. Rank them for memorability and explain the winner.`,
  },
]

export const TOOL_MAP: Record<string, ToolDef> = Object.fromEntries(TOOLS.map((t) => [t.id, t]))

export function toolsByCategory(category: string): ToolDef[] {
  return TOOLS.filter((t) => t.category === category)
}
