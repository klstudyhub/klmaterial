import './Roadmap.css';

const Roadmap = () => {
  const roadmapData = [
    {
      year: 1,
      semesters: [
        {
          sem: 1,
          title: "Foundation Semester",
          subjects: ["Mathematics-I", "Physics", "Chemistry", "Basic Programming"],
          focus: "Build strong fundamentals in mathematics, physics, and basic programming concepts.",
          skills: ["Problem Solving", "Logical Thinking", "C Programming Basics"]
        },
        {
          sem: 2,
          title: "Core Basics",
          subjects: ["Mathematics-II", "PSC", "Engineering Graphics", "Environmental Science"],
          focus: "Strengthen programming skills and mathematical foundation.",
          skills: ["Data Structures Basics", "Algorithm Thinking", "Technical Drawing"]
        }
      ]
    },
    {
      year: 2,
      semesters: [
        {
          sem: 3,
          title: "Computer Science Core",
          subjects: ["Data Structures", "DM", "BEEC", "Computer Organization"],
          focus: "Deep dive into core CS concepts, discrete mathematics, and electronics.",
          skills: ["Advanced DS", "Circuit Analysis", "Mathematical Logic"]
        },
        {
          sem: 4,
          title: "Advanced Core",
          subjects: ["DSD", "DBMS", "Operating Systems", "Computer Networks"],
          focus: "Master system design, databases, and networking fundamentals.",
          skills: ["Digital Logic", "SQL", "OS Concepts", "Network Protocols"]
        }
      ]
    },
    {
      year: 3,
      semesters: [
        {
          sem: 5,
          title: "Specialization Begins",
          subjects: ["Web Technologies", "Software Engineering", "Machine Learning", "Compiler Design"],
          focus: "Explore web development, ML basics, and software engineering principles.",
          skills: ["Full Stack Development", "ML Algorithms", "Software Design Patterns"]
        },
        {
          sem: 6,
          title: "Advanced Topics",
          subjects: ["Cloud Computing", "Big Data", "AI", "Mobile Development"],
          focus: "Learn emerging technologies and advanced computing concepts.",
          skills: ["AWS/Azure", "Hadoop/Spark", "Deep Learning", "React Native/Flutter"]
        }
      ]
    },
    {
      year: 4,
      semesters: [
        {
          sem: 7,
          title: "Industry Ready",
          subjects: ["Cyber Security", "IoT", "Blockchain", "Electives"],
          focus: "Specialized courses and industry-oriented projects.",
          skills: ["Security Best Practices", "IoT Protocols", "Smart Contracts"]
        },
        {
          sem: 8,
          title: "Final Project & Placement",
          subjects: ["Major Project", "Internship", "Seminar", "Placement Preparation"],
          focus: "Complete major project, internship, and prepare for placements.",
          skills: ["Project Management", "Interview Skills", "Industry Experience"]
        }
      ]
    }
  ];

  return (
    <div className="roadmap-page">
      {/* Hero Section */}
      <section className="roadmap-hero">
        <div className="roadmap-hero-content">
          <h1 className="roadmap-title fade-in">B.Tech CSE Roadmap</h1>
          <p className="roadmap-subtitle fade-in-delay-1">
            Your complete 4-year journey to becoming a skilled software engineer
          </p>
          <div className="roadmap-stats fade-in-delay-2">
            <div className="roadmap-stat">
              <div className="stat-number">4</div>
              <div className="stat-label">Years</div>
            </div>
            <div className="roadmap-stat">
              <div className="stat-number">8</div>
              <div className="stat-label">Semesters</div>
            </div>
            <div className="roadmap-stat">
              <div className="stat-number">40+</div>
              <div className="stat-label">Subjects</div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="timeline">
            {roadmapData.map((yearData) => (
              <div key={yearData.year} className="year-section">
                <div className="year-header">
                  <div className="year-badge">Year {yearData.year}</div>
                  <h2>Year {yearData.year} - {
                    yearData.year === 1 ? "Foundation" :
                    yearData.year === 2 ? "Core" :
                    yearData.year === 3 ? "Specialization" :
                    "Professional"
                  }</h2>
                </div>

                <div className="semesters-grid">
                  {yearData.semesters.map((semester, semIndex) => (
                    <div key={semester.sem} className="semester-card" style={{ animationDelay: `${semIndex * 0.2}s` }}>
                      <div className="semester-header">
                        <div className="semester-number">Semester {semester.sem}</div>
                        <h3>{semester.title}</h3>
                      </div>

                      <div className="semester-content">
                        <div className="subjects-section">
                          <h4><i className="fas fa-book"></i> Key Subjects</h4>
                          <ul className="subjects-list">
                            {semester.subjects.map((subject, idx) => (
                              <li key={idx}>{subject}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="focus-section">
                          <h4><i className="fas fa-bullseye"></i> Focus Area</h4>
                          <p>{semester.focus}</p>
                        </div>

                        <div className="skills-section">
                          <h4><i className="fas fa-lightbulb"></i> Skills to Develop</h4>
                          <div className="skills-tags">
                            {semester.skills.map((skill, idx) => (
                              <span key={idx} className="skill-tag">{skill}</span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="semester-footer">
                        <a href="/materials" className="semester-link">
                          View Materials <i className="fas fa-arrow-right"></i>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="resources-section">
        <div className="container">
          <h2 className="section-title">Additional Learning Resources</h2>
          
          <div className="resources-grid">
            <div className="resource-card">
              <div className="resource-icon">📚</div>
              <h3>Online Courses</h3>
              <ul>
                <li><a href="https://www.coursera.org" target="_blank" rel="noopener noreferrer">Coursera</a></li>
                <li><a href="https://www.udemy.com" target="_blank" rel="noopener noreferrer">Udemy</a></li>
                <li><a href="https://www.edx.org" target="_blank" rel="noopener noreferrer">edX</a></li>
              </ul>
            </div>

            <div className="resource-card">
              <div className="resource-icon">💻</div>
              <h3>Coding Practice</h3>
              <ul>
                <li><a href="https://leetcode.com" target="_blank" rel="noopener noreferrer">LeetCode</a></li>
                <li><a href="https://www.hackerrank.com" target="_blank" rel="noopener noreferrer">HackerRank</a></li>
                <li><a href="https://codeforces.com" target="_blank" rel="noopener noreferrer">Codeforces</a></li>
              </ul>
            </div>

            <div className="resource-card">
              <div className="resource-icon">📖</div>
              <h3>Documentation</h3>
              <ul>
                <li><a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">MDN Web Docs</a></li>
                <li><a href="https://docs.python.org" target="_blank" rel="noopener noreferrer">Python Docs</a></li>
                <li><a href="https://react.dev" target="_blank" rel="noopener noreferrer">React Docs</a></li>
              </ul>
            </div>

            <div className="resource-card">
              <div className="resource-icon">🎥</div>
              <h3>Video Tutorials</h3>
              <ul>
                <li><a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a></li>
                <li><a href="https://www.freecodecamp.org" target="_blank" rel="noopener noreferrer">freeCodeCamp</a></li>
                <li><a href="https://www.khanacademy.org" target="_blank" rel="noopener noreferrer">Khan Academy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Tips Section */}
      <section className="tips-section">
        <div className="container">
          <h2 className="section-title">Success Tips</h2>
          
          <div className="tips-grid">
            <div className="tip-card">
              <div className="tip-number">01</div>
              <h3>Stay Consistent</h3>
              <p>Regular practice is more important than cramming. Code every day, even if it's just for 30 minutes.</p>
            </div>

            <div className="tip-card">
              <div className="tip-number">02</div>
              <h3>Build Projects</h3>
              <p>Apply what you learn by building real projects. Your portfolio matters more than grades.</p>
            </div>

            <div className="tip-card">
              <div className="tip-number">03</div>
              <h3>Network & Collaborate</h3>
              <p>Join coding communities, attend hackathons, and contribute to open source projects.</p>
            </div>

            <div className="tip-card">
              <div className="tip-number">04</div>
              <h3>Focus on Fundamentals</h3>
              <p>Strong basics in DSA, OOP, and system design will take you far in your career.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Roadmap;
