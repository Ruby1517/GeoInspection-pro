import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCategories } from "../api/categories";
import { getInspectionById, updateInspection } from "../api/inspections";
import { EditableInspectionMap } from "../components/EditableInspectionMap";
import { Navbar } from "../components/Navbar";
import type { Category } from "../types/category";

export function InspectionDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState<number>(1);
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [status, setStatus] = useState<"open" | "in_review" | "assigned" | "in_progress" | "resolved" | "closed">("open");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState(36.7378);
  const [longitude, setLongitude] = useState(-119.7871);
  const [assignedTo, setAssignedTo] = useState<number | "">("");

  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        const [inspection, categoryData] = await Promise.all([
          getInspectionById(Number(id)),
          getCategories(),
        ]);

        setCategories(categoryData);
        setTitle(inspection.title);
        setDescription(inspection.description ?? "");
        setCategoryId(inspection.category_id);
        setPriority(inspection.priority);
        setStatus(inspection.status);
        setAddress(inspection.address ?? "");
        setLatitude(Number(inspection.latitude));
        setLongitude(Number(inspection.longitude));
        setAssignedTo(inspection.assigned_to ?? "");
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Failed to load inspection.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  function handleLocationChange(lat: number, lng: number) {
    setLatitude(Number(lat.toFixed(6)));
    setLongitude(Number(lng.toFixed(6)));
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    if (!id) return;

    try {
      const updated = await updateInspection(Number(id), {
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

      setSuccessMessage(`Inspection updated: ${updated.inspection_number}`);
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to update inspection.");
      setSuccessMessage("");
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "1rem" }}>Loading inspection...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "1rem", maxWidth: 800 }}>
        <button onClick={() => navigate("/inspections")}>Back to Inspections</button>
        <h1>Edit Inspection</h1>
        <p>Click the map to move the inspection location.</p>

        <EditableInspectionMap
          latitude={latitude}
          longitude={longitude}
          onLocationChange={handleLocationChange}
        />

        <form onSubmit={handleSave} style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />

          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

          <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
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

          <input value={address} onChange={(e) => setAddress(e.target.value)} />

          <input
            type="number"
            step="0.000001"
            value={latitude}
            onChange={(e) => setLatitude(Number(e.target.value))}
          />

          <input
            type="number"
            step="0.000001"
            value={longitude}
            onChange={(e) => setLongitude(Number(e.target.value))}
          />

          <input
            type="number"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="Assigned user id"
          />

          <button type="submit">Save Changes</button>
        </form>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      </div>
    </>
  );
}