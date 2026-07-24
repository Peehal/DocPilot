import Dashboard from './Dashboard';

// Same underlying data as "My Documents" (already sorted by most recently
// updated) — there's no separate "last opened" tracking yet, so this is an
// honest alias rather than a distinctly different data set.
export default function Recent() {
  return <Dashboard scope="recent" />;
}
