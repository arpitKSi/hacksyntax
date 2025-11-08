"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GripVertical, Plus, Trash2, Edit } from "lucide-react";
import toast from "react-hot-toast";

interface Module {
  id: string;
  title: string;
  position: number;
  sections: Section[];
}

interface Section {
  id: string;
  title: string;
  position: number;
  contentType: string;
}

interface ModuleBuilderProps {
  courseId: string;
  initialModules: Module[];
}

export default function ModuleBuilder({ courseId, initialModules }: ModuleBuilderProps) {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update positions
    const updatedModules = items.map((item, index) => ({
      ...item,
      position: index,
    }));

    setModules(updatedModules);
    saveModuleOrder(updatedModules);
  };

  const saveModuleOrder = async (updatedModules: Module[]) => {
    try {
      await fetch(`/api/courses/${courseId}/modules/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          modules: updatedModules.map((m) => ({ id: m.id, position: m.position })),
        }),
      });
      toast.success("Module order updated");
    } catch (error) {
      toast.error("Failed to update order");
    }
  };

  const addModule = async () => {
    if (!newModuleTitle.trim()) return;

    try {
      const response = await fetch(`/api/courses/${courseId}/modules`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newModuleTitle,
          position: modules.length,
        }),
      });

      const newModule = await response.json();
      setModules([...modules, newModule]);
      setNewModuleTitle("");
      setIsAddingModule(false);
      toast.success("Module added!");
    } catch (error) {
      toast.error("Failed to add module");
    }
  };

  const deleteModule = async (moduleId: string) => {
    if (!confirm("Delete this module and all its content?")) return;

    try {
      await fetch(`/api/courses/${courseId}/modules/${moduleId}`, {
        method: "DELETE",
      });
      setModules(modules.filter((m) => m.id !== moduleId));
      toast.success("Module deleted");
    } catch (error) {
      toast.error("Failed to delete module");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Modules</h2>
        <Button
          onClick={() => setIsAddingModule(true)}
          className="bg-[#FDAB04] hover:bg-[#FDAB04]/80"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Module
        </Button>
      </div>

      {isAddingModule && (
        <div className="bg-white p-4 rounded-lg border">
          <Input
            placeholder="Module title..."
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addModule()}
            className="mb-2"
          />
          <div className="flex gap-2">
            <Button onClick={addModule} size="sm">Save</Button>
            <Button
              onClick={() => {
                setIsAddingModule(false);
                setNewModuleTitle("");
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="modules">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
              {modules.map((module, index) => (
                <Draggable key={module.id} draggableId={module.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="bg-white p-4 rounded-lg border"
                    >
                      <div className="flex items-center gap-3">
                        <div {...provided.dragHandleProps}>
                          <GripVertical className="w-5 h-5 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{module.title}</h3>
                          <p className="text-sm text-gray-500">
                            {module.sections.length} sections
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteModule(module.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </div>

                      {/* Sections list */}
                      {module.sections.length > 0 && (
                        <div className="mt-4 ml-8 space-y-2">
                          {module.sections.map((section) => (
                            <div
                              key={section.id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded"
                            >
                              <span className="text-sm">{section.title}</span>
                              <span className="text-xs text-gray-500">
                                {section.contentType}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {modules.length === 0 && !isAddingModule && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No modules yet. Add your first module to get started!</p>
        </div>
      )}
    </div>
  );
}
