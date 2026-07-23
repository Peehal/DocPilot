import Template from '../models/Template.js';

const heading = (level, text) => ({
  type: 'heading',
  attrs: { level },
  content: [{ type: 'text', text }],
});

const paragraph = (text) => ({
  type: 'paragraph',
  content: text ? [{ type: 'text', text }] : [],
});

const bulletList = (items) => ({
  type: 'bulletList',
  content: items.map((text) => ({
    type: 'listItem',
    content: [paragraph(text)],
  })),
});

const doc = (content) => ({ type: 'doc', content });

const SEED_TEMPLATES = [
  {
    name: 'Meeting notes',
    description: 'Agenda, attendees, and action items.',
    category: 'Work',
    contentJSON: doc([
      heading(1, 'Meeting Notes'),
      paragraph('Date: '),
      paragraph('Attendees: '),
      heading(2, 'Agenda'),
      bulletList(['Topic one', 'Topic two', 'Topic three']),
      heading(2, 'Action items'),
      bulletList(['Action item 1', 'Action item 2']),
    ]),
  },
  {
    name: 'Project proposal',
    description: 'Overview, goals, timeline, and budget.',
    category: 'Work',
    contentJSON: doc([
      heading(1, 'Project Proposal'),
      heading(2, 'Overview'),
      paragraph('Describe the project here.'),
      heading(2, 'Goals'),
      bulletList(['Goal one', 'Goal two']),
      heading(2, 'Timeline'),
      paragraph('Outline the project timeline here.'),
      heading(2, 'Budget'),
      paragraph('Outline the budget here.'),
    ]),
  },
  {
    name: 'Resume',
    description: 'A simple starting point for a resume.',
    category: 'Personal',
    contentJSON: doc([
      heading(1, 'Your Name'),
      paragraph('Email · Phone · Location'),
      heading(2, 'Experience'),
      paragraph('Job Title, Company — Dates'),
      bulletList(['Achievement one', 'Achievement two']),
      heading(2, 'Education'),
      paragraph('Degree, School — Dates'),
      heading(2, 'Skills'),
      paragraph('List your skills here.'),
    ]),
  },
];

export async function seedTemplates() {
  // One-time cleanup for databases seeded before "Blank document" was removed
  // from the starter set (a plain "New document" button already covers it).
  await Template.deleteOne({ name: 'Blank document' });

  const count = await Template.countDocuments();
  if (count > 0) return;

  await Template.insertMany(SEED_TEMPLATES);
  console.log(`[seed] Inserted ${SEED_TEMPLATES.length} starter templates`);
}
