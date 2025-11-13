import { useState } from "react";
import { useData } from "@Contexts/DataContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@Components/Shadcn/dialog";
import { Button } from "@Components/Shadcn/button";
import { Input } from "@Components/Shadcn/input";
import { Label } from "@Components/Shadcn/label";
import { Trash2, Plus, Pencil, Check, X } from "lucide-react";
import { Category } from "@Types/index";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const colors = [
  "#3b82f6",
  "#ef4444",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#06b6d4",
  "#84cc16",
];

export function CategoryDialog({ open, onOpenChange }: CategoryDialogProps) {
  const { categories, addCategory, deleteCategory, updateCategory } = useData();
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editColor, setEditColor] = useState("");

  const handleAdd = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      await addCategory(name.trim(), selectedColor);
      setName("");
      setSelectedColor(colors[0]);
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Error adding category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, categoryName: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${categoryName}"? Tasks will be moved to General category.`
      )
    ) {
      try {
        setLoading(true);
        await deleteCategory(id);
      } catch (error: any) {
        console.error("Error deleting category:", error);
        alert(error.message || "Error deleting category. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditColor(category.color);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditColor("");
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;

    try {
      setLoading(true);
      await updateCategory(id, {
        name: editName.trim(),
        color: editColor,
      });
      setEditingId(null);
      setEditName("");
      setEditColor("");
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Error updating category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] glass-card border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white">Manage Categories</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">New Category</Label>
            <div className="flex gap-2">
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Category name"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !name.trim()}
                size="icon"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor:
                      selectedColor === color ? "white" : "transparent",
                  }}
                />
              ))}
            </div>
          </div>
        </form>

        <div className="space-y-2 pt-4 border-t border-white/10">
          <Label>Your Categories</Label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                {editingId === category.id ? (
                  // Edit Mode
                  <>
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex gap-1">
                        {colors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setEditColor(color)}
                            className="w-5 h-5 rounded-full border transition-all hover:scale-110"
                            style={{
                              backgroundColor: color,
                              borderColor:
                                editColor === color ? "white" : "transparent",
                              borderWidth: editColor === color ? "2px" : "1px",
                            }}
                          />
                        ))}
                      </div>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1"
                        placeholder="Category name"
                        disabled={loading}
                      />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdate(category.id)}
                        disabled={loading || !editName.trim()}
                        className="h-8 w-8 p-0 text-green-400 hover:text-green-300"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={cancelEdit}
                        disabled={loading}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  // View Mode
                  <>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-white truncate">
                        {category.name}
                      </span>
                      {category.is_default && (
                        <span className="text-xs text-gray-500">(Default)</span>
                      )}
                    </div>
                    {!category.is_default && (
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEdit(category)}
                          disabled={loading}
                          className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleDelete(category.id, category.name)
                          }
                          disabled={loading}
                          className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}