import { useOthers, useSelf } from '@/lib/collaboration';

export function PresenceAvatars() {
  const others = useOthers();
  const self = useSelf();

  const people = [
    ...(self ? [{ id: 'self', info: self.info, isSelf: true }] : []),
    ...others.map((other) => ({ id: other.connectionId, info: other.info })),
  ];

  if (people.length === 0) return null;

  return (
    <div className="flex items-center -space-x-2">
      {people.map((person) => (
        <div
          key={person.id}
          title={person.isSelf ? `${person.info?.name || 'You'} (you)` : person.info?.name}
          className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-background bg-primary text-xs font-medium text-primary-foreground"
        >
          {person.info?.avatar ? (
            <img src={person.info.avatar} alt={person.info?.name || ''} className="h-full w-full object-cover" />
          ) : (
            (person.info?.name || '?').charAt(0).toUpperCase()
          )}
        </div>
      ))}
    </div>
  );
}
