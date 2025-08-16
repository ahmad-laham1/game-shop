import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import client from "../api/client";
import { formatPrice } from "../utils/format";
import Button from "../components/Button";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import ConfirmDialog from "../components/ConfirmDialog";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prod, setProd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        setLoading(true);
        const { data } = await client.get(`/api/products/${id}/`);
        if (active) setProd(data);
      } catch (e) {
        if (e?.response?.status === 404) {
          setError("404");
        } else {
          setError("Failed to load product.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [id]);

  const handleBuyClick = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmPurchase = async () => {
    setShowConfirmDialog(false);
    setPurchasing(true);
    
    try {
      const { data } = await client.post("/api/orders/", {
        product_id: Number(id),
      });
      
      navigate(`/receipt/${data.id}`, { state: { order: data } });
    } catch (e) {
      console.error("Purchase error:", e);
      
      let errorMessage = "Purchase failed. Please try again.";
      
      if (e?.response?.data?.error) {
        errorMessage = e.response.data.error;
      } else if (e?.response?.status === 400) {
        errorMessage = "Invalid request. Please try again.";
      } else if (e?.response?.status === 401) {
        errorMessage = "Please log in to make a purchase.";
        navigate("/login");
        return;
      } else if (e?.response?.status === 404) {
        errorMessage = "Product not found or no longer available.";
      } else if (e?.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      }
      
      setError(errorMessage);
    } finally {
      setPurchasing(false);
    }
  };

  const handleBackClick = () => {
    navigate("/products");
  };

  if (loading) return <LoadingSpinner />;

  if (error === "404") {
    return (
      <div className="not-found-page">
        <PageHeader 
          title="Product not found" 
          subtitle={`We couldn't find a product with ID ${id}.`}
        />
        
        <Card className="error-card">
          <ul className="error-list">
            <li>The product may have been removed or its ID changed.</li>
            <li>Double-check the URL or go back to the products list.</li>
          </ul>
          
          <div className="error-actions">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              ← Go back
            </Button>
            <Button variant="outline" onClick={() => navigate("/products")}>
              Back to products
            </Button>
            <Button variant="outline" onClick={() => navigate(0)}>
              Refresh
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (error) return <ErrorMessage message={error} />;
  if (!prod) return <ErrorMessage message="Product not found." />;

  return (
    <div className="product-details-page">
      <PageHeader 
        title={prod.title}
        actions={
          <Button 
            variant="outline" 
            onClick={handleBackClick}
            className="back-button"
          >
            ← Back to Products
          </Button>
        }
      />

      <Card className="product-details">
        <div className="product-details-content">
          <p className="product-details-description">
            {prod.description || "No description."}
          </p>
          
          <div className="product-details-info">
            <div className="product-details-price">
              <strong>Price:</strong> {formatPrice(prod.price, prod.location)}
            </div>
            <div className="product-details-location">
              <strong>Location:</strong> {prod.location}
            </div>
          </div>

          <Button 
            onClick={handleBuyClick} 
            className="product-details-buy-btn"
            disabled={purchasing}
            loading={purchasing}
          >
            {purchasing ? "Processing..." : "Buy Now"}
          </Button>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmPurchase}
        title="Confirm Purchase"
        message={`Are you sure you want to purchase "${prod.title}" for ${formatPrice(prod.price, prod.location)}?`}
        confirmText="Yes, Purchase"
        cancelText="Cancel"
        variant="success"
        loading={purchasing}
      />
    </div>
  );
}
