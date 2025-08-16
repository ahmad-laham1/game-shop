import { Link } from "react-router-dom";
import { formatPrice } from "../utils/format";
import Card from "../components/Card";

export default function ProductCard({ product, className = "" }) {
  return (
    <Link to={`/products/${product.id}`} className="product-link">
      <Card variant="product" className={`product-card ${className}`}>
        <div className="product-card-content">
          <h3 className="product-card-title">{product.title}</h3>
          <p className="product-card-description">{product.description}</p>
          <div className="product-card-details">
            <div className="product-card-price">
              Price: {formatPrice(product.price, product.location)}
            </div>
            <div className="product-card-location">
              Location: {product.location}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
