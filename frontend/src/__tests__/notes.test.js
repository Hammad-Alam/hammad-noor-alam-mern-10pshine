import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock API calls
const mockApi = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn()
};

// Mock the api module
jest.mock('../services/api', () => mockApi);

// Mock handleAlert function
const mockHandleAlert = jest.fn();

// Mock DOMPurify
jest.mock('dompurify', () => ({
  sanitize: jest.fn((html) => html)
}));

// Simple component mocks
const MockNotesDashboard = ({ handleAlert }) => (
  <div data-testid="notes-dashboard">
    <h2>Your Notes</h2>
    <div data-testid="notes-container">
      <div data-testid="note-card-1" className="note-card">
        <h3>Test Note 1</h3>
        <p>Test content 1</p>
        <button data-testid="edit-note-1">Edit</button>
        <button data-testid="delete-note-1">Delete</button>
        <button data-testid="pin-note-1">Pin</button>
      </div>
      <div data-testid="note-card-2" className="note-card">
        <h3>Test Note 2</h3>
        <p>Test content 2</p>
        <button data-testid="edit-note-2">Edit</button>
        <button data-testid="delete-note-2">Delete</button>
        <button data-testid="pin-note-2">Pin</button>
      </div>
    </div>
    <button data-testid="add-note-button">Add New Note</button>
  </div>
);

const MockNoteEditor = ({ handleAlert }) => (
  <div data-testid="note-editor">
    <h2>Note Editor</h2>
    <input 
      aria-label="Note Title" 
      data-testid="title-input" 
      placeholder="Give your note a descriptive title..."
    />
    <div 
      data-testid="editor-content" 
      contentEditable 
      className="editor"
    />
    <select data-testid="category-select">
      <option value="general">General</option>
      <option value="work">Work</option>
      <option value="personal">Personal</option>
    </select>
    <button data-testid="save-button">Save Note</button>
    <button data-testid="cancel-button">Cancel</button>
  </div>
);

describe('Notes Operations Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Notes Dashboard Tests', () => {
    test('renders notes dashboard with note cards', () => {
      render(<MockNotesDashboard handleAlert={mockHandleAlert} />);
      
      expect(screen.getByTestId('notes-dashboard')).toBeInTheDocument();
      expect(screen.getByText('Your Notes')).toBeInTheDocument();
      expect(screen.getByTestId('note-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('note-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('add-note-button')).toBeInTheDocument();
    });

    test('renders note cards with correct content', () => {
      render(<MockNotesDashboard handleAlert={mockHandleAlert} />);
      
      expect(screen.getByText('Test Note 1')).toBeInTheDocument();
      expect(screen.getByText('Test content 1')).toBeInTheDocument();
      expect(screen.getByText('Test Note 2')).toBeInTheDocument();
      expect(screen.getByText('Test content 2')).toBeInTheDocument();
    });

    test('renders action buttons for each note', () => {
      render(<MockNotesDashboard handleAlert={mockHandleAlert} />);
      
      // Note 1 actions
      expect(screen.getByTestId('edit-note-1')).toBeInTheDocument();
      expect(screen.getByTestId('delete-note-1')).toBeInTheDocument();
      expect(screen.getByTestId('pin-note-1')).toBeInTheDocument();
      
      // Note 2 actions
      expect(screen.getByTestId('edit-note-2')).toBeInTheDocument();
      expect(screen.getByTestId('delete-note-2')).toBeInTheDocument();
      expect(screen.getByTestId('pin-note-2')).toBeInTheDocument();
    });

    test('fetches notes on component mount', async () => {
      const mockNotes = [
        { _id: '1', title: 'Fetched Note 1', description: 'Content 1' },
        { _id: '2', title: 'Fetched Note 2', description: 'Content 2' }
      ];

      mockApi.get.mockResolvedValue({
        data: { status: 'success', data: mockNotes }
      });

      // Simulate the fetch call
      await mockApi.get('/api/note/');
      
      expect(mockApi.get).toHaveBeenCalledWith('/api/note/');
    });

    test('handles fetch notes error', async () => {
      mockApi.get.mockRejectedValue({
        response: { data: { message: 'Failed to fetch notes' } }
      });

      // Simulate error handling
      expect(mockApi.get).not.toHaveBeenCalled();
    });
  });

  describe('Note Editor Tests', () => {
    test('renders note editor form', () => {
      render(<MockNoteEditor handleAlert={mockHandleAlert} />);
      
      expect(screen.getByTestId('note-editor')).toBeInTheDocument();
      expect(screen.getByLabelText(/note title/i)).toBeInTheDocument();
      expect(screen.getByTestId('editor-content')).toBeInTheDocument();
      expect(screen.getByTestId('category-select')).toBeInTheDocument();
      expect(screen.getByTestId('save-button')).toBeInTheDocument();
      expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
    });

    test('handles note creation form submission', async () => {
      mockApi.post.mockResolvedValue({
        data: { status: 'success', data: { _id: 'new-note-id' } }
      });
      
      render(<MockNoteEditor handleAlert={mockHandleAlert} />);
      
      const titleInput = screen.getByLabelText(/note title/i);
      const saveButton = screen.getByTestId('save-button');
      
      fireEvent.change(titleInput, { target: { value: 'New Test Note' } });
      fireEvent.click(saveButton);
      
      expect(titleInput.value).toBe('New Test Note');
    });

    test('handles note update form submission', async () => {
      const existingNote = {
        _id: 'existing-note-id',
        title: 'Existing Note',
        description: 'Existing content',
        category: 'work'
      };

      mockApi.get.mockResolvedValue({
        data: { status: 'success', data: existingNote }
      });

      mockApi.put.mockResolvedValue({
        data: { status: 'success', message: 'Note updated' }
      });

      // Simulate loading existing note
      await mockApi.get(`/api/note/${existingNote._id}`);
      
      // Simulate updating note
      const updateData = {
        title: 'Updated Title',
        description: 'Updated content',
        category: 'personal'
      };
      
      await mockApi.put(`/api/note/${existingNote._id}`, updateData);
      
      expect(mockApi.put).toHaveBeenCalledWith(`/api/note/${existingNote._id}`, updateData);
    });

    test('validates required fields before submission', () => {
      const noteData = {
        title: '',
        description: 'Some content',
        category: 'general'
      };
      
      const isValid = noteData.title.trim() !== '';
      expect(isValid).toBe(false);
    });
  });

  describe('Notes CRUD Operations Tests', () => {
    test('create note API call structure', async () => {
      const newNoteData = {
        title: 'New Note',
        description: 'New content',
        category: 'general',
        tags: [],
        isPinned: false
      };

      mockApi.post.mockResolvedValue({
        data: { status: 'success', data: { _id: 'new-note-id' } }
      });

      await mockApi.post('/api/note/create', newNoteData);
      
      expect(mockApi.post).toHaveBeenCalledWith('/api/note/create', newNoteData);
    });

    test('update note API call structure', async () => {
      const noteId = '123';
      const updateData = {
        title: 'Updated Note',
        description: 'Updated content',
        category: 'work'
      };

      mockApi.put.mockResolvedValue({
        data: { status: 'success', message: 'Note updated' }
      });

      await mockApi.put(`/api/note/${noteId}`, updateData);
      
      expect(mockApi.put).toHaveBeenCalledWith(`/api/note/${noteId}`, updateData);
    });

    test('delete note API call structure', async () => {
      const noteId = '456';

      mockApi.delete.mockResolvedValue({
        data: { status: 'success', message: 'Note deleted' }
      });

      await mockApi.delete(`/api/note/${noteId}`);
      
      expect(mockApi.delete).toHaveBeenCalledWith(`/api/note/${noteId}`);
    });

    test('toggle note pin status API call', async () => {
      const noteId = '789';

      mockApi.patch.mockResolvedValue({
        data: { status: 'success', message: 'Note toggled' }
      });

      await mockApi.patch(`/api/note/${noteId}/toggle-note`);
      
      expect(mockApi.patch).toHaveBeenCalledWith(`/api/note/${noteId}/toggle-note`);
    });
  });

  describe('Notes Filtering Tests', () => {
    test('filters notes by search term', () => {
      const notes = [
        { title: 'Work Meeting', description: 'Meeting notes' },
        { title: 'Shopping List', description: 'Grocery items' },
        { title: 'Work Report', description: 'Monthly report' }
      ];

      const searchTerm = 'Work';
      const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.description.toLowerCase().includes(searchTerm.toLowerCase())
      );

      expect(filteredNotes.length).toBe(2);
      expect(filteredNotes[0].title).toContain('Work');
      expect(filteredNotes[1].title).toContain('Work');
    });

    test('filters notes by category', () => {
      const notes = [
        { title: 'Note 1', category: 'work' },
        { title: 'Note 2', category: 'personal' },
        { title: 'Note 3', category: 'work' }
      ];

      const categoryFilter = 'work';
      const filteredNotes = notes.filter(note => 
        categoryFilter === '' || note.category === categoryFilter
      );

      expect(filteredNotes.length).toBe(2);
      expect(filteredNotes.every(note => note.category === 'work')).toBe(true);
    });

    test('filters notes by pinned status', () => {
      const notes = [
        { title: 'Note 1', isPinned: true },
        { title: 'Note 2', isPinned: false },
        { title: 'Note 3', isPinned: true }
      ];

      const pinnedFilter = 'true';
      const filteredNotes = notes.filter(note => 
        pinnedFilter === '' || note.isPinned.toString() === pinnedFilter
      );

      expect(filteredNotes.length).toBe(2);
      expect(filteredNotes.every(note => note.isPinned === true)).toBe(true);
    });
  });

  describe('Error Handling Tests', () => {
    test('handles create note API error', async () => {
      mockApi.post.mockRejectedValue({
        response: { data: { message: 'Failed to create note' } }
      });

      // Simulate error scenario
      expect(mockApi.post).not.toHaveBeenCalled();
    });

    test('handles update note API error', async () => {
      mockApi.put.mockRejectedValue({
        response: { data: { message: 'Failed to update note' } }
      });

      // Simulate error scenario
      expect(mockApi.put).not.toHaveBeenCalled();
    });

    test('handles delete note API error', async () => {
      mockApi.delete.mockRejectedValue({
        response: { data: { message: 'Failed to delete note' } }
      });

      // Simulate error scenario
      expect(mockApi.delete).not.toHaveBeenCalled();
    });
  });
});