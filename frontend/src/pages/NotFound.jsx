import { Link } from "react-router-dom";
import PageHeader from "../components/PageHeader";

export default function NotFound({ message = "Not found." }) {
  return (
    <div className="not-found-page">
      <PageHeader title="404" subtitle={message} />

      <div className="not-found-actions">
        <Link to="/products" className="btn btn-primary">
          ← Back
        </Link>
      </div>
    </div>
  );
}
