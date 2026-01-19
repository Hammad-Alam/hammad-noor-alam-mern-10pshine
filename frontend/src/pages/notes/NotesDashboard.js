import React, { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { Plus, Edit, Trash2, Pin, ChevronDown, Check } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Pagination from "../../components/Pagination";
import api from "../../services/api";
import Loading from "../../components/Loading";

function NotesDashboard(props) {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [expandedNotes, setExpandedNotes] = useState(new Set());

  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    isPinned: "",
  });

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 6;

  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/api/note/`);
        setNotes(response.data.data);
      } catch (error) {
        console.error("Fetch notes error:", error);
        const errorMessage =
          error.response?.data?.message ||
          "Failed to fetch notes. Please try again.";
        props.handleAlert(errorMessage, "danger");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [refresh]);

  // Filtered notes based on current filters
  const filteredNotes = notes?.filter((note) => {
    // Search filter - check title and tags
    const matchesSearch =
      !filters.search ||
      note.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(filters.search.toLowerCase())
      );

    // Category filter
    const matchesCategory =
      !filters.category || note.category === filters.category;

    // Pinned filter
    const matchesPinned =
      filters.isPinned === "" || note.isPinned.toString() === filters.isPinned;

    return matchesSearch && matchesCategory && matchesPinned;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredNotes?.length / notesPerPage);
  const startIndex = (currentPage - 1) * notesPerPage;
  const endIndex = startIndex + notesPerPage;
  const paginatedNotes = filteredNotes?.slice(startIndex, endIndex) || [];

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Get unique categories for filter options
  const categories = [...new Set(notes.map((note) => note.category))];

  const toggleExpanded = (noteId) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  };

  const truncateText = (text, maxLength = 40) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const deleteNote = async (noteId) => {
    try {
      const response = await api.delete(`/api/note/${noteId}`);
      if (response.data.status === "success") {
        setRefresh(!refresh); // toggle refresh
        props.handleAlert("Note deleted successfully.", "success");
      }
    } catch (error) {
      console.error("Deleting note error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error deleting note. Please try again.";
      props.handleAlert(errorMessage, "danger");
    }
  };

  const toggleNote = async (noteId) => {
    try {
      const response = await api.patch(`/api/note/${noteId}/toggle-note`);
      if (response.data.status === "success") {
        setRefresh(!refresh); // toggle refresh
        props.handleAlert("Note pinned state toggle successfully.", "success");
      }
    } catch (error) {
      console.error("Pinned state toggle error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Error pinning state toggle note. Please try again.";
      props.handleAlert(errorMessage, "danger");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header handleAlert={props.handleAlert} />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Notes</h2>
            <button
              onClick={() => navigate("/notes/create")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm transition duration-150 ease-in-out"
            >
              <Plus className="mr-2" size={18} />
              Add New Note
            </button>
          </div>

          {/* Enhanced Filters Section */}
          <div className="bg-white p-6 rounded-xl shadow mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1 max-w-md">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search notes by title or tags..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out hover:border-indigo-400"
                  />
                </div>
              </div>

              <div className="flex flex-row gap-3">
                <div className="w-2/3 relative">
                  <Listbox
                    value={filters.category}
                    onChange={(value) => handleFilterChange("category", value)}
                  >
                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-gray-300 shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                      <span className="block truncate">
                        {filters.category || "All Categories"}
                      </span>
                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </span>
                    </Listbox.Button>

                    <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 shadow-lg ring-1 ring-black/10 focus:outline-none">
                      <Listbox.Option
                        value=""
                        className={({ active }) =>
                          `cursor-pointer select-none text-sm px-4 py-2 ${
                            active
                              ? "bg-indigo-100 text-indigo-700"
                              : "text-gray-700"
                          }`
                        }
                      >
                        All Categories
                      </Listbox.Option>

                      {categories.map((category) => (
                        <Listbox.Option
                          key={category}
                          value={category}
                          className={({ active }) =>
                            `cursor-pointer select-none text-sm px-4 py-2 rounded-md mx-2 ${
                              active
                                ? "bg-indigo-500 text-white"
                                : "text-gray-700"
                            }`
                          }
                        >
                          <div className="flex justify-between items-center">
                            <span className="capitalize">{category}</span>
                            <Check className="h-4 w-4 opacity-0 ui-selected:opacity-100" />
                          </div>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Listbox>
                </div>

                <div className="w-1/2 relative">
                  <Listbox
                    value={filters.isPinned}
                    onChange={(value) => handleFilterChange("isPinned", value)}
                  >
                    <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left border border-gray-300 shadow-sm hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition">
                      <span className="block truncate">
                        {filters.isPinned === ""
                          ? "All Notes"
                          : filters.isPinned === "true"
                          ? "Pinned Only"
                          : "Unpinned Only"}
                      </span>

                      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      </span>
                    </Listbox.Button>

                    <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 shadow-lg ring-1 ring-black/10 focus:outline-none">
                      <Listbox.Option
                        value=""
                        className={({ active }) =>
                          `cursor-pointer select-none px-4 py-2 mx-2 rounded-md ${
                            active
                              ? "bg-indigo-100 text-indigo-700"
                              : "text-gray-700"
                          }`
                        }
                      >
                        <div className="flex justify-between text-sm items-center">
                          <span>All Notes</span>
                          {filters.isPinned === "" && (
                            <Check className="h-4 w-4 text-indigo-600" />
                          )}
                        </div>
                      </Listbox.Option>

                      <Listbox.Option
                        value="true"
                        className={({ active }) =>
                          `cursor-pointer select-none px-4 py-2 mx-2 rounded-md ${
                            active
                              ? "bg-indigo-500 text-white"
                              : "text-gray-700"
                          }`
                        }
                      >
                        <div className="flex justify-between text-sm items-center">
                          <span>Pinned Only</span>
                          {filters.isPinned === "true" && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                      </Listbox.Option>

                      <Listbox.Option
                        value="false"
                        className={({ active }) =>
                          `cursor-pointer select-none px-4 py-2 mx-2 rounded-md ${
                            active
                              ? "bg-indigo-500 text-white"
                              : "text-gray-700"
                          }`
                        }
                      >
                        <div className="flex justify-between text-sm items-center">
                          <span>Unpinned Only</span>
                          {filters.isPinned === "false" && (
                            <Check className="h-4 w-4" />
                          )}
                        </div>
                      </Listbox.Option>
                    </Listbox.Options>
                  </Listbox>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Grid */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            {loading ? (
              <div className="py-12">
                <Loading message="Loading notes..." />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {paginatedNotes.length > 0 ? (
                    paginatedNotes.map((note) => (
                      <div
                        key={note._id}
                        className={`bg-white rounded-xl shadow-md border-l-4 ${
                          note.isPinned
                            ? "border-yellow-400 bg-yellow-50"
                            : "border-indigo-500"
                        } overflow-hidden transition-all duration-200 hover:shadow-lg h-full flex flex-col`}
                      >
                        <div className="p-5 flex-grow">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {note.title}
                            </h3>
                            <div className="flex space-x-1">
                              <button
                                className="text-gray-400 hover:text-indigo-600 transition-colors duration-150"
                                onClick={() => toggleNote(note._id)}
                              >
                                <Pin size={18} />
                              </button>
                              <button className="text-gray-400 hover:text-indigo-600 transition-colors duration-150">
                                <Edit
                                  size={18}
                                  onClick={() =>
                                    navigate(`/notes/edit/${note._id}`)
                                  }
                                />
                              </button>
                              <button
                                className="text-gray-400 hover:text-red-600 transition-colors duration-150"
                                onClick={() => deleteNote(note._id)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div
                              className="text-gray-600 text-sm line-clamp-3 cursor-pointer"
                              onClick={() => toggleExpanded(note._id)}
                              dangerouslySetInnerHTML={{ 
                                __html: DOMPurify.sanitize(
                                  expandedNotes.has(note._id) 
                                    ? note.description 
                                    : truncateText(note.description, 120)
                                ) 
                              }}
                            />
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {note.category.charAt(0).toUpperCase() +
                                note.category.slice(1)}
                            </span>
                            {note.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex justify-between items-center text-xs text-gray-500 mt-auto pt-3">
                            <span>
                              Updated {new Date(note.updatedAt).toLocaleDateString()}
                            </span>
                            <span>
                              {new Date(note.updatedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-12 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <h3 className="mt-2 text-sm font-medium text-gray-900">
                        No notes found
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Get started by creating a new note.
                      </p>
                    </div>
                  )}
                </div>
                
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotesDashboard;
