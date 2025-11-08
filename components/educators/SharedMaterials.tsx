"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Plus, Trash2, Edit, ExternalLink } from "lucide-react"
import { toast } from "react-hot-toast"

interface SharedMaterial {
  id: string
  title: string
  description: string | null
  fileUrl: string
  fileType: string
  createdAt: Date
}

interface SharedMaterialsProps {
  educatorId: string
  materials: SharedMaterial[]
  canEdit: boolean
}

export default function SharedMaterials({ educatorId, materials, canEdit }: SharedMaterialsProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    fileUrl: "",
    fileType: "PDF",
  })

  const handleAddMaterial = async () => {
    if (!newMaterial.title || !newMaterial.fileUrl) {
      toast.error("Title and file URL are required")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/educators/${educatorId}/materials`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMaterial),
      })

      if (response.ok) {
        toast.success("Material added successfully!")
        setIsAddDialogOpen(false)
        setNewMaterial({ title: "", description: "", fileUrl: "", fileType: "PDF" })
        // Refresh the page to show new material
        window.location.reload()
      } else {
        toast.error("Failed to add material")
      }
    } catch (error) {
      console.error("Error adding material:", error)
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMaterial = async (materialId: string) => {
    if (!confirm("Are you sure you want to delete this material?")) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/educators/${educatorId}/materials/${materialId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Material deleted successfully!")
        window.location.reload()
      } else {
        toast.error("Failed to delete material")
      }
    } catch (error) {
      console.error("Error deleting material:", error)
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getFileTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case "PDF":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "SLIDES":
      case "PPT":
      case "PPTX":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
      case "PAPER":
      case "RESEARCH":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "VIDEO":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h3 className="text-2xl font-bold">Shared Materials</h3>
        </div>
        {canEdit && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Shared Material</DialogTitle>
                <DialogDescription>
                  Share lecture notes, slides, or research papers with students
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Week 5 Lecture Notes"
                    value={newMaterial.title}
                    onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Brief description of the material..."
                    value={newMaterial.description}
                    onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="fileUrl">File URL *</Label>
                  <Input
                    id="fileUrl"
                    placeholder="https://..."
                    value={newMaterial.fileUrl}
                    onChange={(e) => setNewMaterial({ ...newMaterial, fileUrl: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="fileType">File Type</Label>
                  <Input
                    id="fileType"
                    placeholder="e.g., PDF, Slides, Research Paper"
                    value={newMaterial.fileType}
                    onChange={(e) => setNewMaterial({ ...newMaterial, fileType: e.target.value })}
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleAddMaterial}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isLoading ? "Adding..." : "Add Material"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {materials.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            {canEdit ? "You haven't shared any materials yet" : "No materials shared yet"}
          </p>
          {canEdit && (
            <p className="text-sm text-gray-400 mt-2">
              Click "Add Material" to share lecture notes, slides, or research papers
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((material) => (
            <Card key={material.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg mb-1 line-clamp-2">
                      {material.title}
                    </h4>
                    {material.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {material.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className={getFileTypeColor(material.fileType)}>
                        {material.fileType}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(material.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteMaterial(material.id)}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <a
                  href={material.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </a>
                <a
                  href={material.fileUrl}
                  download
                  className="flex-1"
                >
                  <Button variant="outline" size="sm" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Card>
  )
}
