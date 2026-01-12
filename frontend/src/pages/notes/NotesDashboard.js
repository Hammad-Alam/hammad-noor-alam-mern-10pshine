import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Pin, ChevronDown, Check } from "lucide-react";
import { Listbox } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";

function NotesDashboard(props) {
  const navigate = useNavigate();

  // State for filters
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    isPinned: "",
  });

  // Mock data for notes - will be replaced with API call later
  const [notes, setNotes] = useState([
    {
      _id: "1",
      title: "Meeting Notes",
      description:
        "Discussed project timeline and deliverables for Q1 2024. Key stakeholders agreed on the proposed approach.",
      category: "work",
      tags: ["meeting", "timeline", "q1"],
      isPinned: true,
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
    },
    {
      _id: "2",
      title: "Shopping List",
      description:
        "Milk, eggs, bread, fruits, vegetables, chicken, rice, pasta sauce",
      category: "personal",
      tags: ["shopping", "groceries"],
      isPinned: false,
      createdAt: "2024-01-14T08:15:00Z",
      updatedAt: "2024-01-14T08:15:00Z",
    },
    {
      _id: "3",
      title: "Project Ideas",
      description:
        "Brainstormed new project ideas for the upcoming hackathon. Focus on sustainability and social impact themes.",
      category: "ideas",
      tags: ["brainstorm", "hackathon", "sustainability"],
      isPinned: false,
      createdAt: "2024-01-13T14:20:00Z",
      updatedAt: "2024-01-13T14:20:00Z",
    },
    {
      _id: "4",
      title: "Book Recommendations",
      description:
        "The Alchemist, Atomic Habits, Deep Work, Sapiens - all great reads for personal development.",
      category: "reading",
      tags: ["books", "recommendations", "personal development"],
      isPinned: true,
      createdAt: "2024-01-12T16:45:00Z",
      updatedAt: "2024-01-12T16:45:00Z",
    },
  ]);

  // Filtered notes based on current filters
  const filteredNotes = notes.filter((note) => {
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

  const handleFilterChange = (filterName, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Get unique categories for filter options
  const categories = [...new Set(notes.map((note) => note.category))];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div
                  key={note._id}
                  className={`bg-white rounded-xl shadow-md border-l-4 ${
                    note.isPinned
                      ? "border-yellow-400 bg-yellow-50"
                      : "border-indigo-500"
                  } overflow-hidden transition-all duration-200 hover:shadow-lg`}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {note.title}
                      </h3>
                      <div className="flex space-x-1">
                        {note.isPinned && (
                          <Pin
                            className="text-yellow-500 flex-shrink-0"
                            size={18}
                          />
                        )}
                        <button className="text-gray-400 hover:text-indigo-600 transition-colors duration-150">
                          <Edit size={18} />
                        </button>
                        <button className="text-gray-400 hover:text-red-600 transition-colors duration-150">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {note.description}
                      </p>
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

                    <div className="flex justify-between items-center text-xs text-gray-500">
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
        </div>
      </main>
    </div>
  );
}

export default NotesDashboard;
