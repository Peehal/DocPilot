import { useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Loader } from '@/components/shared/Loader';
import { EmptyState } from '@/components/shared/EmptyState';
import { TemplateThumbnail } from '@/components/shared/TemplateThumbnail';
import { useTemplates } from '@/hooks/useTemplates';
import { useCreateDocument } from '@/hooks/useDocuments';

export default function Templates() {
  const navigate = useNavigate();
  const { data: templates, isLoading, isError, error } = useTemplates();
  const createDocument = useCreateDocument();

  const handleUseTemplate = async (template) => {
    try {
      const doc = await createDocument.mutateAsync({ templateId: template._id });
      navigate(`/documents/${doc._id}`);
    } catch (err) {
      console.error('Failed to create document from template:', err.response?.data || err.message);
    }
  };

  const grouped = (templates || []).reduce((acc, t) => {
    (acc[t.category] ||= []).push(t);
    return acc;
  }, {});

  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />

        <div className="min-w-0 flex-1 p-4 sm:p-8">
          <h1 className="mb-6 text-2xl font-semibold">Templates</h1>

          {isLoading && <Loader />}

          {isError && (
            <p className="text-sm text-red-500">
              Failed to load templates: {error.response?.data?.error || error.message}
            </p>
          )}

          {!isLoading && !isError && templates?.length === 0 && (
            <EmptyState
              title="No templates available"
              description="Check back later, or start from a blank document."
            />
          )}

          {!isLoading &&
            !isError &&
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-8">
                <h2 className="mb-3 text-sm font-medium text-muted-foreground">{category}</h2>
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                  {items.map((template) => (
                    <button
                      key={template._id}
                      type="button"
                      disabled={createDocument.isPending}
                      onClick={() => handleUseTemplate(template)}
                      className="group text-left disabled:opacity-60"
                    >
                      <div className="aspect-3/4 overflow-hidden rounded-md border bg-white shadow-sm transition-shadow group-hover:shadow-md">
                        <TemplateThumbnail name={template.name} />
                      </div>
                      <div className="mt-2 space-y-0.5">
                        <p className="truncate text-sm font-medium">{template.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {template.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
