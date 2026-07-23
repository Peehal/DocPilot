import { Plus } from 'lucide-react';

// Mini decorative mockups per template, mirroring the Dashboard's page-thumbnail
// style but shaped to actually hint at each template's layout (like Google
// Docs' template gallery), instead of a single generic file icon for all of them.
function BlankMockup() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Plus size={22} className="text-neutral-300" />
    </div>
  );
}

function MeetingNotesMockup() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-3">
      <div className="h-2 w-2/3 rounded-full bg-neutral-800" />
      <div className="h-1.5 w-1/3 rounded-full bg-neutral-200" />
      <div className="h-1.5 w-1/2 rounded-full bg-neutral-200" />
      <div className="mt-2 h-1.5 w-1/3 rounded-full bg-neutral-400" />
      <div className="ml-2 h-1.5 w-4/5 rounded-full bg-neutral-100" />
      <div className="ml-2 h-1.5 w-3/5 rounded-full bg-neutral-100" />
      <div className="ml-2 h-1.5 w-4/5 rounded-full bg-neutral-100" />
      <div className="mt-2 h-1.5 w-1/3 rounded-full bg-neutral-400" />
      <div className="ml-2 h-1.5 w-2/3 rounded-full bg-neutral-100" />
    </div>
  );
}

function ProjectProposalMockup() {
  return (
    <div className="flex h-full w-full flex-col gap-1.5 p-3">
      <div className="h-2 w-3/4 rounded-full bg-neutral-800" />
      <div className="mt-2 h-1.5 w-1/2 rounded-full bg-neutral-400" />
      <div className="h-1.5 w-full rounded-full bg-neutral-100" />
      <div className="h-1.5 w-4/5 rounded-full bg-neutral-100" />
      <div className="mt-2 h-1.5 w-1/2 rounded-full bg-neutral-400" />
      <div className="ml-2 h-1.5 w-3/5 rounded-full bg-neutral-100" />
      <div className="ml-2 h-1.5 w-3/5 rounded-full bg-neutral-100" />
      <div className="mt-2 h-1.5 w-1/3 rounded-full bg-neutral-400" />
      <div className="h-1.5 w-full rounded-full bg-neutral-100" />
    </div>
  );
}

function ResumeMockup() {
  return (
    <div className="flex h-full w-full flex-col items-center gap-1 p-3">
      <div className="h-2.5 w-1/2 rounded-full bg-neutral-800" />
      <div className="h-1.5 w-2/3 rounded-full bg-neutral-200" />
      <div className="mt-2 h-px w-full bg-neutral-200" />
      <div className="mt-2 w-full space-y-1.5">
        <div className="h-1.5 w-1/3 rounded-full bg-neutral-400" />
        <div className="ml-1 h-1.5 w-4/5 rounded-full bg-neutral-100" />
        <div className="ml-1 h-1.5 w-3/5 rounded-full bg-neutral-100" />
        <div className="mt-2 h-1.5 w-1/3 rounded-full bg-neutral-400" />
        <div className="ml-1 h-1.5 w-2/3 rounded-full bg-neutral-100" />
      </div>
    </div>
  );
}

const MOCKUPS = {
  'Blank document': BlankMockup,
  'Meeting notes': MeetingNotesMockup,
  'Project proposal': ProjectProposalMockup,
  Resume: ResumeMockup,
};

export function TemplateThumbnail({ name }) {
  const Mockup = MOCKUPS[name] || BlankMockup;
  return <Mockup />;
}
