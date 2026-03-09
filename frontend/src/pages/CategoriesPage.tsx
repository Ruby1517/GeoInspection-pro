import { useEffect, useState } from "react";
import { createCategory, getCategories } from "../api/categories";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../auth/AuthContext";
import type { Category } from "../types/category";

export function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      setError("Failed to load categories.");
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  async function handleCreate(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    try {
      await createCategory({ name, description });
      setName("");
      setDescription("");
      await loadCategories();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "Failed to create category.");
    }
  }

  const canManageCategories =
    user?.role === "admin" || user?.role === "supervisor";

  return (
    <>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <h1>Categories</h1>

        {canManageCategories && (
          <form onSubmit={handleCreate} style={{ display: "grid", gap: "1rem", maxWidth: 500 }}>
            <input
              placeholder="Category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Create Category</button>
          </form>
        )}

        {error && <p style={{ color: "red" }}>{error}</p>}

        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <strong>{category.name}</strong> — {category.description}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}