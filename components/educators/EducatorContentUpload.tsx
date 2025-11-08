"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  Download,
  Plus,
  Trash2,
  Eye,
  Upload,
  File,
  FileVideo,
  FileImage,
  X,
  Loader2,
} from "lucide-react"
import { toast } from "react-hot-toast"
import { UploadDropzone } from "@/lib/uploadthing"
import { useRouter } from "next/navigation"

interface SharedMaterial {
  id: string
  title: string
  description: string | null
  fileUrl: string
  fileName: string
  fileType: string
  fileSize: number | null
  category: string | null
  tags: string | null
  downloads: number
  createdAt: Date
}

interface EducatorContentUploadProps {
  educatorId: string
  materials: SharedMaterial[]
  canEdit: boolean
}

export default function EducatorContentUpload({
  educatorId,
  materials,
  canEdit,
}: EducatorContentUploadProps) {
  const router = useRouter()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null)

  const [newMaterial, setNewMaterial] = useState({
    title: "",
    description: "",
    fileUrl: "",
    fileName: "",
    fileType: "",
    fileSize: 0,
    category: "Lecture Notes",
    tags: "",
  })

  const handleUploadComplete = (res: any) => {
    if (res && res[0]) {
      const file = res[0]
      setNewMaterial({
        ...newMaterial,
        fileUrl: file.url,
        fileName: file.name,
        fileType: file.name.split(".").pop()?.toUpperCase() || "FILE",
        fileSize: file.size,
      })
      toast.success("File uploaded successfully!")
      setUploadProgress(100)
    }
  }

  const handleAddMaterial = async () => {
    if (!newMaterial.title || !newMaterial.fileUrl) {
      toast.error("Title and file are required")
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
        setNewMaterial({
          title: "",
          description: "",
          fileUrl: "",
          fileName: "",
          fileType: "",
          fileSize: 0,
          category: "Lecture Notes",
          tags: "",
        })
        setUploadProgress(0)
        router.refresh()
      } else {
        const error = await response.json()
        toast.error(error.message || "Failed to add material")
      }
    } catch (error) {
      console.error("Error adding material:", error)
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteMaterial = async (materialId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/educators/${educatorId}/materials/${materialId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Material deleted successfully!")
        setMaterialToDelete(null)
        router.refresh()
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

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return "Unknown size"
    const kb = bytes / 1024
    const mb = kb / 1024
    if (mb >= 1) return `${mb.toFixed(2)} MB`
    return `${kb.toFixed(2)} KB`
  }

  const getFileIcon = (type: string) => {
    const upperType = type.toUpperCase()
    if (upperType.includes("PDF")) return <FileText className="w-5 h-5" />
    if (upperType.includes("VIDEO") || upperType.includes("MP4") || upperType.includes("AVI"))
      return <FileVideo className="w-5 h-5" />
    if (upperType.includes("IMAGE") || upperType.includes("PNG") || upperType.includes("JPG"))
      return <FileImage className="w-5 h-5" />
    return <File className="w-5 h-5" />
  }

  const getFileTypeColor = (type: string) => {
    const upperType = type.toUpperCase()
    if (upperType.includes("PDF"))
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    if (upperType.includes("PPT") || upperType.includes("PPTX"))
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
    if (upperType.includes("VIDEO") || upperType.includes("MP4"))
      return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
    if (upperType.includes("IMAGE") || upperType.includes("PNG") || upperType.includes("JPG"))
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
  }

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "Lecture Notes":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "Research Paper":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "Tutorial":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      case "Assignment":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Shared Materials</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {materials.length} {materials.length === 1 ? "file" : "files"} shared
            </p>
          </div>
        </div>
        {canEdit && (
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Material
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Upload Shared Material</DialogTitle>
                <DialogDescription>
                  Share lecture notes, slides, research papers, or tutorials with students
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 mt-4">
                {/* File Upload */}
                <div className="border-2 border-dashed rounded-lg p-6 bg-gray-50 dark:bg-gray-900">
                  {!newMaterial.fileUrl ? (
                    <>
                      <UploadDropzone
                        endpoint="educatorMaterial"
                        onClientUploadComplete={handleUploadComplete}
                        onUploadError={(error: Error) => {
                          toast.error(`Upload failed: ${error.message}`)
                        }}
                        onUploadProgress={(progress) => {
                          setUploadProgress(progress)
                        }}
                        appearance={{
                          button: "bg-blue-600 hover:bg-blue-700",
                          container: "border-none",
                        }}
                      />
                      {uploadProgress > 0 && uploadProgress < 100 && (
                        <div className="mt-4">
                          <Progress value={uploadProgress} className="h-2" />
                          <p className="text-sm text-center mt-2 text-gray-600">
                            Uploading... {uploadProgress}%
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFileIcon(newMaterial.fileType)}
                        <div>
                          <p className="font-medium">{newMaterial.fileName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatFileSize(newMaterial.fileSize)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setNewMaterial({
                            ...newMaterial,
                            fileUrl: "",
                            fileName: "",
                            fileType: "",
                            fileSize: 0,
                          })
                          setUploadProgress(0)
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Material Details */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="e.g., Week 5 Lecture Notes - Data Structures"
                        value={newMaterial.title}
                        onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Brief description of the material content..."
                        value={newMaterial.description}
                        onChange={(e) =>
                          setNewMaterial({ ...newMaterial, description: e.target.value })
                        }
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newMaterial.category}
                        onValueChange={(value) =>
                          setNewMaterial({ ...newMaterial, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lecture Notes">Lecture Notes</SelectItem>
                          <SelectItem value="Research Paper">Research Paper</SelectItem>
                          <SelectItem value="Tutorial">Tutorial</SelectItem>
                          <SelectItem value="Assignment">Assignment</SelectItem>
                          <SelectItem value="Study Material">Study Material</SelectItem>
                          <SelectItem value="Reference">Reference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags (comma-separated)</Label>
                      <Input
                        id="tags"
                        placeholder="e.g., algorithms, sorting, complexity"
                        value={newMaterial.tags}
                        onChange={(e) => setNewMaterial({ ...newMaterial, tags: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleAddMaterial}
                    disabled={isLoading || !newMaterial.fileUrl || !newMaterial.title}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Add Material
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isLoading}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Materials Grid */}
      {materials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {materials.map((material) => {
            const tags = material.tags ? JSON.parse(material.tags) : []
            return (
              <Card key={material.id} className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`p-2 rounded-lg ${getFileTypeColor(material.fileType)}`}>
                      {getFileIcon(material.fileType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm mb-1 truncate">{material.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <Badge variant="secondary" className={getCategoryColor(material.category)}>
                          {material.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {material.fileType}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {formatFileSize(material.fileSize)} • {material.downloads} downloads
                      </p>
                    </div>
                  </div>
                  {canEdit && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMaterialToDelete(material.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                {material.description && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 line-clamp-2">
                    {material.description}
                  </p>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <a href={material.fileUrl} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </a>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    asChild
                  >
                    <a href={material.fileUrl} download>
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </a>
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-2">No materials shared yet</p>
          {canEdit && (
            <p className="text-sm text-gray-500">
              Click "Add Material" to upload your first shared resource
            </p>
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!materialToDelete} onOpenChange={() => setMaterialToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Material?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the material from your
              profile.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => materialToDelete && handleDeleteMaterial(materialToDelete)}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
