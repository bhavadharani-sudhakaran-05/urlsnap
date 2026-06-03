export default function PageHeader({ title, description, action }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="animate-fade-in-up">
        <h1 className="page-title">{title}</h1>
        {description && (
          <p className="page-description mt-1.5 max-w-2xl truncate" title={description}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="animate-fade-in-up anim-delay-1 shrink-0">{action}</div>
      )}
    </div>
  );
}
