import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CommandPalette.css';

interface Command {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  keywords: string[];
}

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const commands: Command[] = [
    {
      id: 'home',
      label: 'Go to Home',
      icon: '🏠',
      action: () => navigate('/'),
      keywords: ['home', 'dashboard', 'main'],
    },
    {
      id: 'materials',
      label: 'Browse Materials',
      icon: '📚',
      action: () => navigate('/materials'),
      keywords: ['materials', 'study', 'pdfs', 'documents'],
    },
    {
      id: 'roadmap',
      label: 'View Roadmap',
      icon: '🗺️',
      action: () => navigate('/roadmap'),
      keywords: ['roadmap', 'career', 'path', 'guidance'],
    },
    {
      id: 'about',
      label: 'About Us',
      icon: '📖',
      action: () => navigate('/about'),
      keywords: ['about', 'info', 'information'],
    },
    {
      id: 'contact',
      label: 'Contact',
      icon: '📧',
      action: () => navigate('/contact'),
      keywords: ['contact', 'email', 'reach'],
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.keywords.some((kw) => kw.includes(search.toLowerCase()))
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K to open
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearch('');
        setSelectedIndex(0);
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
      }

      if (!isOpen) return;

      // Arrow navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      }

      // Enter to execute
      if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        setIsOpen(false);
        setSearch('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  return (
    <>
      <div className="command-palette-overlay" onClick={() => setIsOpen(false)} />
      <div className="command-palette">
        <div className="command-palette-header">
          <span className="command-palette-icon">⌘</span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="command-palette-input"
          />
          <kbd className="command-palette-kbd">ESC</kbd>
        </div>

        <div className="command-palette-results">
          {filteredCommands.length === 0 ? (
            <div className="command-palette-empty">
              <p>No commands found</p>
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                className={`command-palette-item ${
                  index === selectedIndex ? 'selected' : ''
                }`}
                onClick={() => {
                  cmd.action();
                  setIsOpen(false);
                  setSearch('');
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="command-icon">{cmd.icon}</span>
                <span className="command-label">{cmd.label}</span>
              </button>
            ))
          )}
        </div>

        <div className="command-palette-footer">
          <div className="command-palette-hint">
            <kbd>↑</kbd>
            <kbd>↓</kbd>
            <span>Navigate</span>
          </div>
          <div className="command-palette-hint">
            <kbd>↵</kbd>
            <span>Select</span>
          </div>
          <div className="command-palette-hint">
            <kbd>ESC</kbd>
            <span>Close</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommandPalette;
