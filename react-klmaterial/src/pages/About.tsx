import './About.css';

const About = () => {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-title fade-in">About KL Material</h1>
          <p className="about-subtitle fade-in-delay-1">
            Empowering students with quality education resources
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-icon">🎯</div>
            <h2>Our Mission</h2>
            <p className="mission-text">
              To provide students with easy access to comprehensive, high-quality study materials
              and career guidance, enabling them to excel in their Computer Science Engineering journey.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <h2>Our Story</h2>
              <p>
                KL Material was born from a simple observation: students needed a centralized,
                organized platform to access their study materials and understand their career path.
              </p>
              <p>
                What started as a collection of notes has grown into a comprehensive study hub,
                serving hundreds of students with materials, roadmaps, and guidance.
              </p>
              <div className="story-stats">
                <div className="story-stat">
                  <div className="stat-value">500+</div>
                  <div className="stat-label">Study Materials</div>
                </div>
                <div className="story-stat">
                  <div className="stat-value">1000+</div>
                  <div className="stat-label">Students Helped</div>
                </div>
                <div className="story-stat">
                  <div className="stat-value">100%</div>
                  <div className="stat-label">Free Access</div>
                </div>
              </div>
            </div>
            <div className="story-image">
              <div className="image-placeholder">
                <i className="fas fa-graduation-cap"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="about-features">
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          <div className="features-grid">
            <div className="about-feature-card">
              <div className="feature-icon-wrapper">
                <i className="fas fa-book"></i>
              </div>
              <h3>Comprehensive Materials</h3>
              <p>
                Organized study materials for BEEC, DM, PSC, DSD, and more.
                All resources categorized and easily searchable.
              </p>
            </div>
            
            <div className="about-feature-card">
              <div className="feature-icon-wrapper">
                <i className="fas fa-route"></i>
              </div>
              <h3>Career Roadmap</h3>
              <p>
                Complete 4-year B.Tech roadmap with semester-wise guidance
                and curated learning resource recommendations.
              </p>
            </div>
            
            <div className="about-feature-card">
              <div className="feature-icon-wrapper">
                <i className="fas fa-link"></i>
              </div>
              <h3>Resource Hub</h3>
              <p>
                Curated links to tutorials, documentation, and practice
                platforms for continuous skill development.
              </p>
            </div>
            
            <div className="about-feature-card">
              <div className="feature-icon-wrapper">
                <i className="fas fa-search"></i>
              </div>
              <h3>Smart Search</h3>
              <p>
                Find exactly what you need with our advanced search
                and filtering system across all materials.
              </p>
            </div>
            
            <div className="about-feature-card">
              <div className="feature-icon-wrapper">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Mobile Friendly</h3>
              <p>
                Access materials anytime, anywhere. Fully responsive
                design optimized for all devices.
              </p>
            </div>
            
            <div className="about-feature-card">
              <div className="feature-icon-wrapper">
                <i className="fas fa-clock"></i>
              </div>
              <h3>24/7 Access</h3>
              <p>
                Study at your own pace. All materials available
                round the clock, whenever you need them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2 className="section-title">Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-number">01</div>
              <h3>Quality First</h3>
              <p>We prioritize quality content that truly helps students learn and succeed.</p>
            </div>
            
            <div className="value-card">
              <div className="value-number">02</div>
              <h3>Free Access</h3>
              <p>Education should be accessible to all. All our resources are completely free.</p>
            </div>
            
            <div className="value-card">
              <div className="value-number">03</div>
              <h3>Student-Centric</h3>
              <p>Built by students, for students. We understand your needs and challenges.</p>
            </div>
            
            <div className="value-card">
              <div className="value-number">04</div>
              <h3>Continuous Improvement</h3>
              <p>We're always updating and adding new materials to keep content relevant.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2 className="section-title">Behind KL Material</h2>
          <div className="team-content">
            <div className="team-card">
              <div className="team-avatar">
                <i className="fas fa-user-graduate"></i>
              </div>
              <h3>Praveen Reddy</h3>
              <p className="team-role">Founder & Developer</p>
              <p className="team-bio">
                CSE student passionate about making education accessible and helping
                fellow students succeed in their academic journey.
              </p>
              <div className="team-social">
                <a href="https://github.com/praveenreddy8942-debug" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-github"></i>
                </a>
                <a href="mailto:praveenreddy8942@gmail.com">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Learning?</h2>
            <p>Explore our comprehensive study materials and roadmaps</p>
            <div className="cta-buttons">
              <a href="/materials" className="btn btn-primary">
                Browse Materials <i className="fas fa-arrow-right"></i>
              </a>
              <a href="/contact" className="btn btn-secondary">
                Get in Touch <i className="fas fa-paper-plane"></i>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
