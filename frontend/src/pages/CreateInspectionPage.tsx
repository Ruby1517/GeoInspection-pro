import { useEffect, useState } from "react";
import { getCategories } from "../api/categories";
import { createInspection } from "../api/inspections";
import { LocationPickerMap } from "../components/LocationPickerMap";
import { Navbar } from "../components/Navbar";
import type { Category } from "../types/category";

export function CreateInspectionPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("high");
  const [status, setStatus] = useState<
    "open" | "in_review" | "assigned" | "in_progress" | "resolved" | "closed"
  >("open");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(36.7378);
  const [longitude, setLongitude] = useState(-119.7871);
  const [assignedTo, setAssignedTo] = useState<number | "">("");

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
        if (data.length > 0) {
          setCategoryId(data[0].id);
        }
      } catch {
        setError("Failed to load categories.");
      }
    }

    loadCategories();
  }, []);

  function handleLocationSelect(lat: number, lng: number) {
    setLatitude(Number(lat.toFixed(6)));
    setLongitude(Number(lng.toFixed(6)));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const inspection = await createInspection({
        title,
        description,
        category_id: categoryId,
        priority,
        status,
        address,
        latitude,
        longitude,
        assigned_to: assignedTo === "" ? null : Number(assignedTo),
      });

      setSuccessMessage(`Inspection created: ${inspection.inspection_number}`);
      setTitle("");
      setDescription("");
      setAddress("");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create inspection.");
    }
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "1rem", maxWidth: 800 }}>
        <h1>Create Inspection</h1>
        <p>Click on the map to choose the inspection location.</p>

        <LocationPickerMap
          latitude={latitude}
          longitude={longitude}
          onLocationSelect={handleLocationSelect}
        />

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select value={priority} onChange={(e) => setPriority(e.target.value as any)}>
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
            <option value="critical">critical</option>
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="open">open</option>
            <option value="in_review">in_review</option>
            <option value="assigned">assigned</option>
            <option value="in_progress">in_progress</option>
            <option value="resolved">resolved</option>
            <option value="closed">closed</option>
          </select>

          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            type="number"
            step="0.000001"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(Number(e.target.value))}
          />

          <input
            type="number"
            step="0.000001"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Assigned To User ID (optional)"
            value={assignedTo}
            onChange={(e) =>
              setAssignedTo(e.target.value === "" ? "" : Number(e.target.value))
            }
          />

          <button type="submit">Create Inspection</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </>
  );
}