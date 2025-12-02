import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Bookmark {
  id: string;
  materialId: string;
  name: string;
  subject: string;
  url: string;
  addedAt: number;
  tags: string[];
  notes?: string;
}

export interface BookmarkCollection {
  id: string;
  name: string;
  color: string;
  bookmarkIds: string[];
  createdAt: number;
}

interface BookmarkContextType {
  bookmarks: Bookmark[];
  collections: BookmarkCollection[];
  addBookmark: (bookmark: Omit<Bookmark, 'id' | 'addedAt'>) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (materialId: string) => boolean;
  getBookmark: (materialId: string) => Bookmark | undefined;
  addCollection: (name: string, color: string) => void;
  removeCollection: (id: string) => void;
  addToCollection: (bookmarkId: string, collectionId: string) => void;
  removeFromCollection: (bookmarkId: string, collectionId: string) => void;
  updateBookmarkNotes: (id: string, notes: string) => void;
  exportBookmarks: () => string;
  importBookmarks: (data: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) throw new Error('useBookmarks must be used within BookmarkProvider');
  return context;
};

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [collections, setCollections] = useState<BookmarkCollection[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('klmaterial_bookmarks');
    const savedCollections = localStorage.getItem('klmaterial_collections');
    
    if (savedBookmarks) {
      try {
        setBookmarks(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error('Failed to load bookmarks:', e);
      }
    }

    if (savedCollections) {
      try {
        setCollections(JSON.parse(savedCollections));
      } catch (e) {
        console.error('Failed to load collections:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('klmaterial_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('klmaterial_collections', JSON.stringify(collections));
  }, [collections]);

  const addBookmark = (bookmark: Omit<Bookmark, 'id' | 'addedAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: Date.now().toString(),
      addedAt: Date.now(),
    };
    setBookmarks((prev) => [...prev, newBookmark]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
    // Remove from all collections
    setCollections((prev) =>
      prev.map((col) => ({
        ...col,
        bookmarkIds: col.bookmarkIds.filter((bid) => bid !== id),
      }))
    );
  };

  const isBookmarked = (materialId: string) => {
    return bookmarks.some((b) => b.materialId === materialId);
  };

  const getBookmark = (materialId: string) => {
    return bookmarks.find((b) => b.materialId === materialId);
  };

  const addCollection = (name: string, color: string) => {
    const newCollection: BookmarkCollection = {
      id: Date.now().toString(),
      name,
      color,
      bookmarkIds: [],
      createdAt: Date.now(),
    };
    setCollections((prev) => [...prev, newCollection]);
  };

  const removeCollection = (id: string) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
  };

  const addToCollection = (bookmarkId: string, collectionId: string) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId && !col.bookmarkIds.includes(bookmarkId)
          ? { ...col, bookmarkIds: [...col.bookmarkIds, bookmarkId] }
          : col
      )
    );
  };

  const removeFromCollection = (bookmarkId: string, collectionId: string) => {
    setCollections((prev) =>
      prev.map((col) =>
        col.id === collectionId
          ? { ...col, bookmarkIds: col.bookmarkIds.filter((id) => id !== bookmarkId) }
          : col
      )
    );
  };

  const updateBookmarkNotes = (id: string, notes: string) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, notes } : b))
    );
  };

  const exportBookmarks = () => {
    return JSON.stringify({ bookmarks, collections }, null, 2);
  };

  const importBookmarks = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.bookmarks && parsed.collections) {
        setBookmarks(parsed.bookmarks);
        setCollections(parsed.collections);
        return true;
      }
      return false;
    } catch (e) {
      console.error('Failed to import bookmarks:', e);
      return false;
    }
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        collections,
        addBookmark,
        removeBookmark,
        isBookmarked,
        getBookmark,
        addCollection,
        removeCollection,
        addToCollection,
        removeFromCollection,
        updateBookmarkNotes,
        exportBookmarks,
        importBookmarks,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};
