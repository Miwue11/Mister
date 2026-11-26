export const Card = ({ title, children, className = "" }) => (
  <section className={`card ${className}`}>
    {title && <h2>{title}</h2>}
    {children}
  </section>
);

export const Empty = ({ children }) => <div className="card empty">{children}</div>;
