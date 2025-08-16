import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import client from "../api/client";
import { formatPrice } from "../utils/format";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";

export default function Receipt() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [order, setOrder] = useState(state?.order || null);
  const [loading, setLoading] = useState(!state?.order);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      if (order) return;
      try {
        setLoading(true);
        const { data } = await client.get(`/api/orders/${id}/`);
        if (active) setOrder(data);
      } catch (e) {
        if (active) setError("Failed to load receipt.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id, order]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!order) return <ErrorMessage message="Receipt not found." />;

  const { reference, product, price_at_purchase, created_at } = order;

  return (
    <div className="receipt-page">
      <PageHeader
        title="Receipt"
        actions={
          <Button variant="secondary" onClick={() => navigate(-1)}>
            ← Back
          </Button>
        }
      />

      <Card className="receipt-details">
        <div className="receipt-details-content">
          <div className="receipt-details-item">
            <strong>Reference:</strong> {reference}
          </div>
          <div className="receipt-details-item">
            <strong>Product:</strong> {product?.title}
          </div>
          <div className="receipt-details-item">
            <strong>Price paid:</strong>{" "}
            {formatPrice(price_at_purchase, product?.location)}
          </div>
          <div className="receipt-details-item">
            <strong>Time:</strong> {new Date(created_at).toLocaleString()}
          </div>
        </div>
      </Card>

      <div className="receipt-actions">
        <Button  className="btn btn-secondary" onClick={() => navigate("/products")}>
          ← Back to products
        </Button>
      </div>
    </div>
  );
}
