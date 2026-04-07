import { useEffect } from 'react';
import { Leaf, Droplets, ShieldCheck, ArrowRight } from 'lucide-react';

function App() {
  useEffect(() => {
    // Add intersection observer for scroll animations if needed, 
    // but we rely on simple CSS animations for hero mainly.
  }, []);

  return (
    <>
      <header className="header">
        <div className="container header-content">
          <div className="logo">
            {/* User can place their downloaded logo in public/logo.png */}
            <img src="/logo.png" alt="CutisBio" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }} />
            <span>CutisBioIndigo</span>
          </div>
          <nav className="nav-links">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#contact">Contact</a>
          </nav>
          <button className="btn-primary">Learn More</button>
        </div>
      </header>

      <section className="hero">
        <div className="hero-background"></div>
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        
        <div className="container hero-content">
          <div className="hero-text animate-fade-up">
            <div className="hero-tags">
              <span className="tag">Eco-Friendly</span>
              <span className="tag">Bio Tech</span>
            </div>
            <h1>
              The Future of <br />
              <span>Sustainable Denim Dye</span>
            </h1>
            <p className="hero-subtitle">
              CutisBioIndigo revolutionizes the fashion industry with microbial fermentation technology. Experience the perfect deep blue without the environmental toll.
            </p>
            <button className="btn-primary btn-discover">
              Discover Innovation <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="hero-image-wrapper animate-fade-up delay-200">
            <div className="glass-card">
              <h2 className="title-aniline">
                Aniline Free<br/>
                <span className="text-accent">Human Safe</span>
              </h2>
              <p className="desc-aniline">
                Safe for both the planet and the people. Our Bio Indigo eliminates toxic aniline compounds found in traditional synthetic dyes.
              </p>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <div className="stat-value">100%</div>
                  <div className="stat-label">Aniline Free</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">0%</div>
                  <div className="stat-label">Toxic Byproducts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <div className="section-head">
            <h2 className="section-title">Why Choose CutisBioIndigo?</h2>
            <p className="section-subtitle">Pioneering the shift towards a greener fashion ecosystem through advanced synthetic biology.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Leaf size={32} />
              </div>
              <h3 className="feature-title">Sustainable Denim Dye</h3>
              <p className="feature-desc">
                Produced via microbial fermentation rather than petroleum-based chemicals, significantly reducing carbon footprint and water pollution.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={32} />
              </div>
              <h3 className="feature-title">Aniline Free - Human Safe</h3>
              <p className="feature-desc">
                Completely free of aniline, a known toxic substance. Safe for industrial workers, local environments, and end consumers.
              </p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Droplets size={32} />
              </div>
              <h3 className="feature-title">Premium Dye Quality</h3>
              <p className="feature-desc">
                Yields the rich, classic indigo blue you love. Perfectly applicable to various premium fabrics including silk and cashmere.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact" className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
               <img src="/logo.png" alt="CutisBio" onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }} />
              <span>CutisBioIndigo</span>
            </div>
            <div>
              <p>Seoul, Republic of Korea</p>
              <p>Email: contact@cutisbio.com</p>
            </div>
          </div>
          <div className="footer-bottom">
            &copy; {new Date().getFullYear()} CutisBio. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
