import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Save,
  X,
  Pin,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Minus,
} from "lucide-react";
import { Listbox, Transition } from "@headlessui/react";
import Loading from "../../components/Loading";
import { Check, ChevronDown } from "lucide-react";
import api from "../../services/api";
import Header from "../../components/layout/Header";

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
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(false);

  useEffect(() => {
    if (noteId) {
      const fetchNote = async () => {
        setInitialLoad(true);
        setLoading(true);
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
        } finally {
          setLoading(false);
          setInitialLoad(false);
        }
      };

      fetchNote();
    } else {
      // For new notes, set initial load to false
      setInitialLoad(false);
    }
  }, [noteId, navigate]);

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
    if (loading) return; // Prevent multiple submissions
    setLoading(true);
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
    } finally {
      setLoading(false);
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
      {initialLoad ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <Loading message="Loading note..." />
        </div>
      ) : (
        <>
          <Header handleAlert={props.handleAlert} showBackButton={true} />
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
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Listbox
                  value={noteData.category}
                  onChange={(value) => handleInputChange("category", value)}
                >
                  <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-gray-300 shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                    <span className="block truncate capitalize">
                      {noteData.category}
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    </span>
                  </Listbox.Button>
                  <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 shadow-lg ring-1 ring-black/10 focus:outline-none left-0">
                      {["general", "work", "personal", "ideas", "reading", "shopping"].map(
                        (category) => (
                          <Listbox.Option
                            key={category}
                            value={category}
                            className={({ active }) =>
                              `cursor-pointer select-none text-sm px-4 py-2 rounded-md ${
                                active
                                  ? "bg-indigo-500 text-white"
                                  : "text-gray-700"
                              }`
                            }
                          >
                            <div className="flex justify-between items-center">
                              <span className="capitalize">{category}</span>
                              {noteData.category === category && (
                                <Check className="h-4 w-4" />
                              )}
                            </div>
                          </Listbox.Option>
                        )
                      )}
                    </Listbox.Options>
                  </Transition>
                </Listbox>
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
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {noteId ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    <Save className="mr-2" size={18} />
                    {noteId ? "Update Note" : "Create Note"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
      </>
    )}
  </div>
  );
}

export default NoteEditor;
