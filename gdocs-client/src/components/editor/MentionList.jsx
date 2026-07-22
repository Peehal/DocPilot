export function MentionList({ users, onSelect }) {
  if (!users || users.length === 0) return null;

  return (
    <div className="absolute z-20 mt-1 w-56 rounded-md border bg-popover p-1 shadow-md">
      {users.map((user) => (
        <button
          key={user.clerkId}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(user);
          }}
          className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-muted"
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-5 w-5 rounded-full object-cover" />
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
              {(user.name || user.email || '?').charAt(0).toUpperCase()}
            </span>
          )}
          <span className="truncate">{user.name || user.email}</span>
        </button>
      ))}
    </div>
  );
}
