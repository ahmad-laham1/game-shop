import { useEffect, useState } from "react";
import client from "../api/client";
import PageHeader from "../components/PageHeader";
import Select from "../components/Select";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";

export default function ProductList() {
  const [data, setData] = useState({ results: [], next: null, previous: null });
  const [page, setPage] = useState(1);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const locationOptions = [
    { value: "JO", label: "Jordan" },
    { value: "SA", label: "Saudi Arabia" },
  ];

  async function load() {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("page_size", 12);
      if (location) params.set("location", location);
      const { data } = await client.get(`/api/products/?${params.toString()}`);
      setData(data);
    } catch (e) {
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, location]);

  const handleLocationChange = (e) => {
    setPage(1);
    setLocation(e.target.value);
  };

  return (
    <div className="product-list-page">
      <PageHeader
        title="Products"
        actions={
          <Select
            label="Filter by location"
            value={location}
            onChange={handleLocationChange}
            options={locationOptions}
            placeholder="All locations"
            className="location-filter"
          />
        }
      />

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && data.results.length === 0 && (
        <div className="empty-state">
          No products found{location ? ` for ${location}` : ""}.
        </div>
      )}

      {!loading && !error && data.results.length > 0 && (
        <div className="product-grid">
          {data.results.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <Pagination
          currentPage={page}
          hasNext={!!data.next}
          hasPrevious={!!data.previous}
          onPageChange={setPage}
          className="product-list-pagination"
        />
      )}
    </div>
  );
}
