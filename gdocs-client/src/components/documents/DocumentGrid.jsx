export function DocumentGrid({ documents, onOpen, renderActions, dateLabel = 'Updated', dateField = 'updatedAt' }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
      {documents.map((doc) => (
        <div key={doc._id} className="group cursor-pointer" onClick={() => onOpen(doc)}>
          <div className="relative aspect-3/4 overflow-hidden rounded-md border bg-white shadow-sm transition-shadow group-hover:shadow-md">
            <div className="absolute inset-0 flex flex-col gap-1 p-2.5">
              <div className="h-1.5 w-3/4 rounded-full bg-neutral-200" />
              <div className="h-1.5 w-full rounded-full bg-neutral-100" />
              <div className="h-1.5 w-full rounded-full bg-neutral-100" />
              <div className="h-1.5 w-5/6 rounded-full bg-neutral-100" />
              <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-100" />
              <div className="h-1.5 w-2/3 rounded-full bg-neutral-100" />
            </div>

            {renderActions && (
              <div
                className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
              >
                {renderActions(doc)}
              </div>
            )}
          </div>

          <div className="mt-2 space-y-0.5">
            <p className="truncate text-sm font-medium">{doc.title}</p>
            <p className="text-xs text-muted-foreground">
              {dateLabel} {new Date(doc[dateField]).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
