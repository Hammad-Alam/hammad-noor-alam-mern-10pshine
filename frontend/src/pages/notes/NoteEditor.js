import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  X,
  Pin,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  Minus,
  LogOut,
} from "lucide-react";
import api from "../../services/api";

function NoteEditor(props) {
  const navigate = useNavigate();
  const { noteId } = useParams();

  const editorRef = useRef(null);

  // State for the note
  const [noteData, setNoteData] = useState({
    title: "",
    description: "",
    category: "general",
    tags: [],
    isPinned: false,
  });

  // State for rich text editor
  const [editorContent, setEditorContent] = useState("");
  const [newTag, setNewTag] = useState("");

  // Mock existing note data
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await api.get(`/api/note/${noteId}`);
        const note = response.data.data;

        setNoteData({
          title: note.title,
          category: note.category || "general",
          tags: note.tags || [],
          isPinned: note.isPinned || false,
        });

        setEditorContent(note.description || "");
      } catch (error) {
        console.error("Fetch note error:", error);
        const errorMessage =
          error?.response?.data?.message || "Failed to load note";
        props.handleAlert(errorMessage, "danger");
        navigate("/notes");
      }
    };

    if (noteId) {
      fetchNote();
    }
  }, [noteId]);

  const handleInputChange = (field, value) => {
    setNoteData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !noteData.tags.includes(newTag.trim())) {
      setNoteData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNoteData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSaveNote = async () => {
    if (!noteData.title.trim()) {
      props.handleAlert("Title is required", "danger");
    }

    const contentHtml = editorRef.current.innerHTML; // get final content

    const payload = {
      title: noteData.title,
      description: contentHtml,
      category: noteData.category,
      tags: noteData.tags,
      isPinned: noteData.isPinned,
    };

    try {
      if (noteId) {
        await api.patch(`/api/note/${noteId}`, payload);
        props.handleAlert("Note updated successfully", "success");
      } else {
        await api.post(`/api/note/create`, payload);
        props.handleAlert("Note created successfully", "success");
      }

      navigate("/notes");
    } catch (error) {
      console.error("Save note error:", error);
      const errorMessage =
        error?.response?.data?.message || "Failed to save note";
      props.handleAlert(errorMessage, "danger");
    }
  };

  const handleCancel = () => {
    navigate("/notes");
  };

  const handleFormatText = (command) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus(); // make sure the editor is focused

    switch (command) {
      case "bold":
      case "italic":
      case "underline":
      case "justifyLeft":
      case "justifyCenter":
      case "justifyRight":
        document.execCommand(command, false, null);
        break;
      case "unorderedList":
        document.execCommand("insertUnorderedList", false, null);
        break;
      case "orderedList":
        document.execCommand("insertOrderedList", false, null);
        break;
      case "horizontalRule":
        document.execCommand("insertHorizontalRule", false, null);
        break;
      default:
        break;
    }
  };

  const handleEditorInput = (e) => {};

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {noteId ? "Edit Note" : "Create New Note"}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/notes")}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowLeft className="mr-2" size={18} />
                Back to Notes
              </button>
              <button
                onClick={async () => {
                  try {
                    await api.post(`/api/auth/logout`, {});
                    navigate("/login");
                    props.handleAlert("Logged out successfully.", "success");
                  } catch (error) {
                    console.error("Logout error:", error);
                    props.handleAlert(
                      "Error logging out. Please try again.",
                      "danger"
                    );
                  }
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="mr-2" size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
            <div className="mb-6">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Note Title
              </label>
              <input
                type="text"
                id="title"
                value={noteData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Give your note a descriptive title..."
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
              />
            </div>

            {/* Advanced Rich Text Editor Toolbar */}
            <div className="mb-4 flex flex-wrap gap-1 p-3 border border-gray-200 rounded-lg bg-gray-50 shadow-inner">
              <button
                type="button"
                onClick={() => handleFormatText("bold")}
                className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Bold"
              >
                <Bold size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleFormatText("italic")}
                className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Italic"
              >
                <Italic size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleFormatText("underline")}
                className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Underline"
              >
                <Underline size={18} />
              </button>
              <div className="border-t border-gray-200 w-px h-8 mx-1"></div>
              <button
                type="button"
                onClick={() => handleFormatText("unorderedList")}
                className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Bullet List"
              >
                <List size={18} />
              </button>
              <button
                type="button"
                onClick={() => handleFormatText("orderedList")}
                className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Numbered List"
              >
                <ListOrdered size={18} />
              </button>
              <div className="border-t border-gray-200 w-px h-8 mx-1"></div>
              <button
                type="button"
                onClick={() => document.execCommand("justifyLeft", false, null)}
                className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Align Left"
              >
                <AlignLeft size={18} />
              </button>
              <button
                type="button"
                onClick={() =>
                  document.execCommand("justifyCenter", false, null)
                }
                className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Align Center"
              >
                <AlignCenter size={18} />
              </button>
              <button
                type="button"
                onClick={() =>
                  document.execCommand("justifyRight", false, null)
                }
                className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Align Right"
              >
                <AlignRight size={18} />
              </button>
              <div className="border-t border-gray-200 w-px h-8 mx-1"></div>
              <button
                type="button"
                onClick={() => {
                  const url = prompt("Enter URL:");
                  if (url) {
                    document.execCommand("createLink", false, url);
                    setTimeout(() => {
                      const editorElement =
                        document.getElementById("editor-content");
                      if (editorElement) {
                        setEditorContent(editorElement.innerHTML);
                      }
                    }, 0);
                  }
                }}
                className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Insert Link"
              >
                <Link size={18} />
              </button>
              <button
                type="button"
                onClick={() =>
                  document.execCommand("insertHorizontalRule", false, null)
                }
                className="p-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Separator"
              >
                <Minus size={18} />
              </button>
            </div>

            {/* Enhanced Rich Text Editor */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <div
                id="editor-content"
                contentEditable
                ref={editorRef}
                className="min-h-[300px] w-full px-4 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm bg-white"
                dangerouslySetInnerHTML={{ __html: editorContent }}
                onInput={handleEditorInput}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={noteData.category}
                  onChange={(e) =>
                    handleInputChange("category", e.target.value)
                  }
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white transition duration-150 ease-in-out appearance-none pr-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: "right 1rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.5em 1.5em",
                  }}
                >
                  <option value="general">General</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="ideas">Ideas</option>
                  <option value="reading">Reading</option>
                  <option value="shopping">Shopping</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), handleAddTag())
                    }
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    Add
                  </button>
                </div>

                {/* Display existing tags */}
                <div className="mt-3 flex flex-wrap gap-2">
                  {noteData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      #{tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 inline-flex text-indigo-600 hover:text-indigo-800"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    checked={noteData.isPinned}
                    onChange={(e) =>
                      handleInputChange("isPinned", e.target.checked)
                    }
                    className="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label className="font-medium text-gray-700 flex items-center">
                    <Pin className="mr-2 text-yellow-500" size={18} />
                    Pin this note
                  </label>
                  <p className="text-gray-500">
                    Pinned notes appear at the top of your list
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNote}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="mr-2" size={18} />
                {noteId ? "Update Note" : "Create Note"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NoteEditor;
