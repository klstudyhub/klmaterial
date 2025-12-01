import { useState } from 'react';
import { useGitHubMaterials } from '../hooks/useGitHubMaterials';
import './Materials.css';

const Materials = () => {
  const { materials, loading, error } = useGitHubMaterials();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['BEEC', 'DM', 'PSC', 'DSD'];

  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || material.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedMaterials = filteredMaterials.reduce((acc, material) => {
    const category = material.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(material);
    return acc;
  }, {} as Record<string, typeof materials>);

  return (
    <div className="materials-page page-content">
      <div className="materials-container">
        <header className="materials-header fade-in">
          <h1>Study Materials</h1>
          <p>Access comprehensive CSE course materials</p>
        </header>

        {/* Search Bar */}
        <div className="search-container fade-in">
          <input
            type="text"
            placeholder="Search materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>

        {/* Category Filters */}
        <div className="filter-buttons fade-in">
          <button
            className={`filter-btn ${!selectedCategory ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
          >
            All Materials
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading materials...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-container">
            <p className="error-message">{error}</p>
          </div>
        )}

        {/* Materials Grid */}
        {!loading && !error && (
          <div className="materials-content">
            {Object.entries(groupedMaterials).map(([category, items]) => (
              <div key={category} className="category-section fade-in">
                <h2 className="category-title">{category}</h2>
                <div className="materials-grid">
                  {items.map((material) => (
                    <div key={material.name} className="material-card">
                      <div className="material-icon">
                        <i className="fas fa-file-pdf"></i>
                      </div>
                      <div className="material-info">
                        <h3 className="material-name">{material.displayName}</h3>
                        <p className="material-size">{material.size}</p>
                      </div>
                      <a
                        href={material.download_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-btn"
                      >
                        <i className="fas fa-download"></i>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredMaterials.length === 0 && (
              <div className="no-results">
                <i className="fas fa-search"></i>
                <p>No materials found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Materials;
