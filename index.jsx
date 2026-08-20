export function Button({ variant = 'soil', size = 'md', block, children, className = '', ...props }) {
  const cls = ['btn', `btn-${variant}`, size === 'sm' ? 'btn-sm' : '', block ? 'btn-block' : '', className].filter(Boolean).join(' ');
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}

export function Field({ label, children, hint }) {
  return (
    <div className="form-row">
      {label && <label>{label}</label>}
      {children}
      {hint && <div className="field-hint">{hint}</div>}
    </div>
  );
}

export function Input(props) {
  return <input {...props} />;
}

export function Select({ children, ...props }) {
  return <select {...props}>{children}</select>;
}

export function TextArea(props) {
  return <textarea {...props} />;
}

export function Badge({ tone = 'default', children }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function DemoBadge({ children }) {
  return <span className="demo-badge">{children}</span>;
}

export function ErrorText({ children }) {
  if (!children) return null;
  return <div className="error-text">⚠️ {children}</div>;
}

export function SuccessText({ children }) {
  if (!children) return null;
  return <div className="success-text">✅ {children}</div>;
}

export function Spinner() {
  return <div className="spinner" aria-label="loading" />;
}

export function StarRatingDisplay({ rating, count }) {
  const full = Math.round(rating || 0);
  return (
    <span className="stars">
      {'★'.repeat(full)}
      {'☆'.repeat(5 - full)}
      {typeof count === 'number' ? ` (${count})` : rating ? ` ${rating.toFixed(1)}` : ''}
    </span>
  );
}

export function StarRatingInput({ value, onChange }) {
  return (
    <div className="star-input">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          type="button"
          key={n}
          className={n <= value ? 'star-on' : 'star-off'}
          onClick={() => onChange(n)}
          aria-label={`${n} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {title && <h3>{title}</h3>}
        {children}
      </div>
    </div>
  );
}

export function EmptyState({ children }) {
  return <div className="empty-note">{children}</div>;
}
