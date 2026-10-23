const STORAGE_KEY = "tumo-ai-adventure-books";

export function getBooks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const books = stored ? JSON.parse(stored) : [];
        return Array.isArray(books) ? books : [];
    } catch {
        return [];
    }
}

export function saveBook(book) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([book, ...getBooks()]));
}