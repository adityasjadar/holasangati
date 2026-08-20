import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return (
    <section className="section"><div className="wrap" style={{ textAlign: 'center' }}>
      <h2>404</h2>
      <Link to="/">← Home</Link>
    </div></section>
  );
}
