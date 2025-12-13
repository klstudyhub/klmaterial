import './Contact.css';

const Contact = () => {
  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-title fade-in">Get in Touch</h1>
          <p className="contact-subtitle fade-in-delay-1">
            Have questions? We'd love to hear from you
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="contact-info-section">
        <div className="container">
          <div className="contact-grid">
            {/* Email Card */}
            <a href="mailto:praveenreddy8942@gmail.com" className="contact-card email-card">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Email Us</h3>
              <p>praveenreddy8942@gmail.com</p>
              <span className="contact-link">
                Send an email <i className="fas fa-arrow-right"></i>
              </span>
            </a>

            {/* GitHub Card */}
            <a href="https://github.com/praveenreddy8942-debug" target="_blank" rel="noopener noreferrer" className="contact-card github-card">
              <div className="contact-icon">
                <i className="fab fa-github"></i>
              </div>
              <h3>GitHub</h3>
              <p>@praveenreddy8942-debug</p>
              <span className="contact-link">
                Visit profile <i className="fas fa-arrow-right"></i>
              </span>
            </a>

            {/* LinkedIn Card */}
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="contact-card linkedin-card">
              <div className="contact-icon">
                <i className="fab fa-linkedin"></i>
              </div>
              <h3>LinkedIn</h3>
              <p>Connect with us</p>
              <span className="contact-link">
                View profile <i className="fas fa-arrow-right"></i>
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="social-section">
        <div className="container">
          <h2 className="section-title">Connect on Social Media</h2>
          <p className="section-subtitle">Follow us for updates and educational content</p>
          
          <div className="social-grid">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-card facebook">
              <div className="social-icon-wrapper">
                <i className="fab fa-facebook-f"></i>
              </div>
              <h4>Facebook</h4>
              <p>Latest updates</p>
            </a>

            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="social-card whatsapp">
              <div className="social-icon-wrapper">
                <i className="fab fa-whatsapp"></i>
              </div>
              <h4>WhatsApp</h4>
              <p>Quick chat</p>
            </a>

            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-card twitter">
              <div className="social-icon-wrapper">
                <i className="fab fa-twitter"></i>
              </div>
              <h4>Twitter</h4>
              <p>Follow updates</p>
            </a>

            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-card instagram">
              <div className="social-icon-wrapper">
                <i className="fab fa-instagram"></i>
              </div>
              <h4>Instagram</h4>
              <p>Visual stories</p>
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">Frequently Asked Questions</h2>
          
          <div className="faq-grid">
            <div className="faq-card">
              <div className="faq-icon">❓</div>
              <h3>How do I access materials?</h3>
              <p>Simply browse the Materials page, search for what you need, and download directly. All materials are free!</p>
            </div>

            <div className="faq-card">
              <div className="faq-icon">📱</div>
              <h3>Is it mobile-friendly?</h3>
              <p>Yes! The entire website is optimized for mobile, tablet, and desktop devices.</p>
            </div>

            <div className="faq-card">
              <div className="faq-icon">🆓</div>
              <h3>Is everything free?</h3>
              <p>Absolutely! All study materials and resources are completely free with no hidden costs.</p>
            </div>

            <div className="faq-card">
              <div className="faq-icon">🔄</div>
              <h3>How often is content updated?</h3>
              <p>We regularly update materials and add new resources based on student needs.</p>
            </div>

            <div className="faq-card">
              <div className="faq-icon">💬</div>
              <h3>Can I suggest materials?</h3>
              <p>Yes! Contact us via email with your suggestions and we'll consider adding them.</p>
            </div>

            <div className="faq-card">
              <div className="faq-icon">🎓</div>
              <h3>Who can use this?</h3>
              <p>Any student studying Computer Science Engineering at any level can use our resources.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="contact-cta">
        <div className="container">
          <div className="cta-box">
            <h2>Ready to Start Learning?</h2>
            <p>Access comprehensive study materials and roadmaps now</p>
            <a href="/materials" className="btn btn-primary">
              Browse Materials <i className="fas fa-book"></i>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
