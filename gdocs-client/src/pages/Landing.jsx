import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import {
  FileText,
  Users2,
  MessageSquare,
  LayoutTemplate,
  Download,
  Sparkles,
  Bold,
  Italic,
  Underline,
  Table as TableIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import './landing.css';

const CREATE_POINTS = [
  {
    title: 'Start from a template',
    description: 'Jump-start with Meeting Notes, a Resume, or a Project Proposal instead of a blank page.',
  },
  {
    title: 'Format with a full toolbar',
    description: 'Headings, lists, tables, images, links, and checklists — everything you need to write.',
  },
  {
    title: 'See changes as they happen',
    description: 'Live cursors and instant sync mean everyone is always looking at the same page.',
  },
  {
    title: 'Comment without breaking your flow',
    description: 'Highlight any text, leave a threaded comment, and @mention teammates to loop them in.',
  },
];

const FEATURES = [
  {
    icon: Users2,
    title: 'Real-time collaboration',
    description: 'Edit the same document with your team, live — see cursors and changes as they happen.',
  },
  {
    icon: MessageSquare,
    title: 'Comments & mentions',
    description: 'Leave feedback right on the text, reply in threads, and @mention teammates to loop them in.',
  },
  {
    icon: LayoutTemplate,
    title: 'Templates',
    description: 'Start from a resume, meeting notes, or project proposal instead of a blank page.',
  },
  {
    icon: Download,
    title: 'Export anywhere',
    description: 'Download any document as PDF, HTML, plain text, or JSON in one click.',
  },
];

function TiltMockup() {
  const ref = useRef(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setStyle({
      transform: `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) scale(1.02)`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({ transform: 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)' });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="landing-tilt-card relative rounded-xl border bg-card p-4 shadow-2xl"
      style={style}
    >
      <div className="flex items-center gap-2 border-b pb-3">
        <FileText size={16} className="text-muted-foreground" />
        <div className="h-2 w-32 rounded-full bg-muted" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-2 w-3/4 rounded-full bg-muted" />
        <div className="h-2 w-full rounded-full bg-muted" />
        <div className="h-2 w-5/6 rounded-full bg-muted" />
        <div className="h-2 w-2/3 rounded-full bg-muted" />
      </div>
      <div className="landing-float absolute -right-4 -top-4 flex items-center gap-2 rounded-lg border bg-popover px-3 py-2 shadow-md">
        <div className="h-6 w-6 rounded-full bg-primary" />
        <div className="h-2 w-16 rounded-full bg-muted" />
      </div>
    </div>
  );
}

function EditorMockup() {
  return (
    <div className="rounded-xl border bg-card p-0 shadow-2xl">
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <FileText size={16} className="text-muted-foreground" />
        <div className="h-2 w-28 rounded-full bg-muted" />
        <div className="ml-auto flex items-center gap-1 text-muted-foreground">
          <Bold size={14} />
          <Italic size={14} />
          <Underline size={14} />
          <TableIcon size={14} />
        </div>
      </div>
      <div className="space-y-2.5 p-6">
        <div className="h-2.5 w-2/3 rounded-full bg-muted" />
        <div className="h-2 w-full rounded-full bg-muted/70" />
        <div className="h-2 w-5/6 rounded-full bg-muted/70" />
        <div className="h-2 w-full rounded-full bg-muted/70" />
        <div className="mt-4 h-2 w-1/2 rounded-full bg-muted" />
        <div className="h-2 w-4/5 rounded-full bg-muted/70" />
        <div className="h-2 w-2/3 rounded-full bg-muted/70" />
      </div>
    </div>
  );
}

function EffortlesslyCreateSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((i) => (i + 1) % CREATE_POINTS.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="border-t px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-semibold">Effortlessly create documents</h2>
        <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
          Never start from scratch — templates and a full toolbar get you to a polished document
          fast.
        </p>

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2">
          <div>
            {CREATE_POINTS.map((point, i) => (
              <button
                key={point.title}
                type="button"
                onClick={() => setActive(i)}
                className={cn(
                  'block w-full border-l-2 py-3 pl-4 text-left transition-colors',
                  i === active ? 'border-primary' : 'border-transparent'
                )}
              >
                <h3
                  className={cn(
                    'font-medium transition-colors',
                    i === active ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {point.title}
                </h3>
                {i === active && (
                  <p className="landing-fade-up mt-1 text-sm text-muted-foreground">
                    {point.description}
                  </p>
                )}
              </button>
            ))}
          </div>

          <EditorMockup />
        </div>
      </div>
    </section>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen overflow-hidden">
      <header className="relative z-10 flex items-center justify-between border-b px-6 py-4">
        <span className="text-lg font-semibold">DocPilot</span>
        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <Button variant="ghost">Sign in</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button>Get started</Button>
          </SignUpButton>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2">
        <div className="landing-blob left-[-10%] top-0 h-72 w-72 bg-violet-600" />
        <div className="landing-blob right-[-5%] top-20 h-72 w-72 bg-blue-600" style={{ animationDelay: '3s' }} />

        <div className="relative">
          <div
            className="landing-fade-up mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs text-muted-foreground"
          >
            <Sparkles size={12} />
            Real-time, collaborative documents
          </div>
          <h1
            className="landing-fade-up text-4xl font-semibold tracking-tight sm:text-5xl"
            style={{ animationDelay: '0.1s' }}
          >
            Online, collaborative documents
          </h1>
          <p
            className="landing-fade-up mt-4 max-w-md text-lg text-muted-foreground"
            style={{ animationDelay: '0.2s' }}
          >
            Write, format, and edit documents together in real time — with comments, templates,
            and export built in.
          </p>
          <div className="landing-fade-up mt-8 flex items-center gap-3" style={{ animationDelay: '0.3s' }}>
            <SignUpButton mode="modal">
              <Button size="lg">Get started for free</Button>
            </SignUpButton>
            <SignInButton mode="modal">
              <Button size="lg" variant="outline">
                Sign in
              </Button>
            </SignInButton>
          </div>
        </div>

        <div className="landing-fade-up relative" style={{ animationDelay: '0.2s' }}>
          <TiltMockup />
        </div>
      </section>

      <EffortlesslyCreateSection />

      <section className="border-t px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-semibold">Everything you need to write together</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature, i) => (
              <div
                key={feature.title}
                className="landing-feature-card landing-fade-up rounded-xl border p-5"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-muted">
                  <feature.icon size={18} />
                </div>
                <h3 className="mt-4 font-medium">{feature.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t px-6 py-20 text-center">
        <h2 className="text-3xl font-semibold">Start writing in seconds</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">
          No credit card, no setup — sign up and create your first document right away.
        </p>
        <SignUpButton mode="modal">
          <Button size="lg" className="mt-8">
            Get started for free
          </Button>
        </SignUpButton>
      </section>

      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        <Link to="/" className="font-medium text-foreground">
          DocPilot
        </Link>{' '}
        — built by Peehal.
      </footer>
    </div>
  );
}
