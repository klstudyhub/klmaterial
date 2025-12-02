import { Link } from 'react-router-dom';
import { ScrollReveal } from '../components/animations/AdvancedScrollAnimations';
import { TextReveal, GlitchText } from '../components/TextReveal';
import GlassCard from '../components/GlassCard';
import { RippleButton, Floating, Shine } from '../components/MicroInteractions';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="gradient-orb orb-1"></div>
          <div className="gradient-orb orb-2"></div>
          <div className="gradient-orb orb-3"></div>
        </div>
        
        <div className="hero-content">
          <Floating distance={10} duration={4}>
            <div className="hero-badge fade-in">
              <span className="badge-icon">✨</span>
              <span>Welcome to KL Material</span>
            </div>
          </Floating>
          
          <ScrollReveal direction="up" delay={0.2}>
            <h1 className="hero-title">
              <TextReveal speed={30}>Your Ultimate</TextReveal>
              <br />
              <GlitchText>
                <span className="gradient-text"> Study Hub </span>
              </GlitchText>
              <br />
              <TextReveal speed={30} delay={0.5}>for CSE Excellence</TextReveal>
            </h1>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.4}>
            <p className="hero-subtitle">
              Access comprehensive study materials, career roadmaps, and expert guidance.
              <br />
              Everything you need to succeed in Computer Science Engineering.
            </p>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.6}>
            <div className="hero-buttons">
              <Link to="/materials" style={{ textDecoration: 'none' }}>
                <RippleButton variant="primary" className="btn-large">
                  <span>Browse Materials</span>
                  <i className="fas fa-arrow-right"></i>
                </RippleButton>
              </Link>
              <Link to="/roadmap" style={{ textDecoration: 'none' }}>
                <RippleButton variant="secondary" className="btn-large">
                  <span>View Roadmap</span>
                  <i className="fas fa-map"></i>
                </RippleButton>
              </Link>
            </div>
          </ScrollReveal>
          
          <ScrollReveal direction="up" delay={0.8}>
            <div className="hero-stats">
              <Shine duration={4}>
                <GlassCard blur={15} opacity={0.15}>
                  <div className="stat-card">
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Study Materials</div>
                  </div>
                </GlassCard>
              </Shine>
              <Shine duration={5}>
                <GlassCard blur={15} opacity={0.15}>
                  <div className="stat-card">
                    <div className="stat-number">4 Years</div>
                    <div className="stat-label">Complete Roadmap</div>
                  </div>
                </GlassCard>
              </Shine>
              <Shine duration={6}>
                <GlassCard blur={15} opacity={0.15}>
                  <div className="stat-card">
                    <div className="stat-number">24/7</div>
                    <div className="stat-label">Access Anytime</div>
                  </div>
                </GlassCard>
              </Shine>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Skills Section */}
      <section className="skills-section">
        <div className="section-header">
          <h2 className="section-title">Technical Skills</h2>
          <p className="section-subtitle">Master the technologies that matter</p>
        </div>
        
        <div className="skills-grid">
          {[
            { icon: 'fab fa-html5', name: 'HTML5', desc: 'Semantic markup', color: '#e34f26' },
            { icon: 'fab fa-css3-alt', name: 'CSS3', desc: 'Modern layouts', color: '#1572b6' },
            { icon: 'fab fa-js', name: 'JavaScript', desc: 'ES6+ features', color: '#f7df1e' },
            { icon: 'fab fa-react', name: 'React', desc: 'Component-based', color: '#61dafb' },
            { icon: 'fab fa-python', name: 'Python', desc: 'Backend & AI', color: '#3776ab' },
            { icon: 'fab fa-git-alt', name: 'Git', desc: 'Version control', color: '#f05032' },
          ].map((skill, index) => (
            <div key={skill.name} className="skill-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="skill-icon" style={{ color: skill.color }}>
                <i className={skill.icon}></i>
              </div>
              <h3>{skill.name}</h3>
              <p>{skill.desc}</p>
              <div className="skill-bar">
                <div className="skill-progress" style={{ background: skill.color }}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">What We Offer</h2>
          <p className="section-subtitle">Everything you need in one place</p>
        </div>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">📚</div>
            </div>
            <h3>Comprehensive Materials</h3>
            <p>Access organized study materials for BEEC, DM, PSC, DSD, and more. All resources in one searchable hub.</p>
            <Link to="/materials" className="feature-link">
              Explore Materials <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          
          <div className="feature-card featured">
            <div className="featured-badge">Popular</div>
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🗺️</div>
            </div>
            <h3>Career Roadmap</h3>
            <p>Complete 4-year B.Tech roadmap with semester-wise guidance and curated learning resources.</p>
            <Link to="/roadmap" className="feature-link">
              View Roadmap <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <div className="feature-icon">🎯</div>
            </div>
            <h3>Resource Hub</h3>
            <p>Curated tutorials, documentation, and practice platforms for continuous skill development.</p>
            <Link to="/about" className="feature-link">
              Learn More <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Excel in Your Studies?</h2>
          <p>Join thousands of students accessing quality materials and guidance</p>
          <Link to="/materials" className="btn btn-cta">
            <span>Get Started Now</span>
            <i className="fas fa-rocket"></i>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
