// ====================================
// KL Study Buddy — Smart AI-Like Chatbot
// 100% client-side, zero API cost
// Fuzzy NLP matching + conversation memory
// ====================================
(function () {
  'use strict';

  let isOpen = false;
  const conversationHistory = [];
  let lastTopicKey = null;

  // ─── LEVENSHTEIN DISTANCE (fuzzy matching) ────────────
  function levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
    const d = Array.from({ length: m + 1 }, (_, i) => i);
    for (let j = 1; j <= n; j++) {
      let prev = d[0];
      d[0] = j;
      for (let i = 1; i <= m; i++) {
        const temp = d[i];
        d[i] = Math.min(
          d[i] + 1,
          d[i - 1] + 1,
          prev + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
        prev = temp;
      }
    }
    return d[m];
  }

  // Similarity score 0-1 based on Levenshtein
  function similarity(a, b) {
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    return 1 - levenshtein(a, b) / maxLen;
  }

  // ─── TOKENIZER ─────────────────────────────
  function tokenize(text) {
    return text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(Boolean);
  }

  // Extract n-grams for phrase matching
  function ngrams(tokens, n) {
    const result = [];
    for (let i = 0; i <= tokens.length - n; i++) {
      result.push(tokens.slice(i, i + n).join(' '));
    }
    return result;
  }

  // ─── INTENT SYNONYMS ──────────────────────
  const INTENT_MAP = {
    'whats': 'what is', 'wats': 'what is', 'wat': 'what',
    'ur': 'your', 'u': 'you', 'r': 'are', 'pls': 'please',
    'plz': 'please', 'thx': 'thanks', 'ty': 'thanks',
    'sem': 'semester', 'yr': 'year', 'yr1': 'year 1',
    'yr2': 'year 2', 'yr3': 'year 3', 'yr4': 'year 4',
    'hii': 'hi', 'hiii': 'hi', 'hiiii': 'hi', 'heyo': 'hey',
    'howdy': 'hi', 'sup': 'what is up', 'wassup': 'what is up',
    'gm': 'good morning', 'gn': 'good night', 'em': 'email',
    'dl': 'download', 'diff': 'difference', 'info': 'information',
    'docs': 'documents', 'prog': 'programming', 'lang': 'language',
    'algo': 'algorithm', 'struct': 'structure', 'dbms': 'database',
    'os': 'operating system', 'cn': 'computer network',
    'oops': 'object oriented programming', 'oop': 'object oriented programming',
    'ml': 'machine learning', 'ai': 'artificial intelligence',
    'dsa': 'data structures and algorithms', 'dev': 'development',
    'fullstack': 'full stack', 'frontend': 'front end', 'backend': 'back end'
  };

  function expandSynonyms(text) {
    const words = text.toLowerCase().split(/\s+/);
    return words.map(w => INTENT_MAP[w] || w).join(' ');
  }

  // ─── MASSIVE KNOWLEDGE BASE ───────────────────────────
  const KB = [
    // ═══ GREETINGS ═══
    {
      id: 'greet',
      keys: ['hello', 'hi', 'hey', 'good morning', 'good evening', 'good afternoon', 'good night'],
      patterns: [/^(hi|hey|hello|yo)\b/i, /good\s*(morning|evening|afternoon|night)/i],
      reply: () => {
        const hour = new Date().getHours();
        const grt = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
        return `${grt}! 👋 I'm your **KL Study Buddy** — a smart AI assistant.\n\nI can help with:\n📚 **9 subjects** — BEEC, DM, PSC, DSD, PP, LACE, DS, FIS, COA\n📥 **Materials** — finding & downloading notes\n🗺️ **Roadmap** — career paths for all 4 years\n💡 **Study tips** — exam prep, learning strategies\n🔍 **Site features** — search, dark mode, PWA\n\nWhat would you like to know?`;
      }
    },
    {
      id: 'how_are_you',
      keys: ['how are you', 'how r you', 'what is up', 'how do you do'],
      patterns: [/how\s*(are|r)\s*(you|u)/i, /what'?s?\s*up/i],
      reply: 'I\'m running at 100% efficiency! 🤖✨ Ask me about any subject, study tips, or how to navigate the site!'
    },
    {
      id: 'thanks',
      keys: ['thank', 'thanks', 'thank you', 'appreciate'],
      patterns: [/^(thanks?|thank\s*you|thx|ty|appreciate)/i],
      reply: () => {
        const r = ['Happy to help! 😊 Feel free to ask more!', 'You\'re welcome! 🎉 Anything else?', 'Glad I could help! 😊 What else would you like to know?'];
        return r[Math.floor(Math.random() * r.length)];
      }
    },
    {
      id: 'bye',
      keys: ['bye', 'goodbye', 'see you', 'see ya', 'talk later'],
      patterns: [/^(bye|goodbye|see\s*y|later|adios)/i],
      reply: 'Goodbye! 👋 Good luck with your studies — come back anytime! 🚀'
    },
    {
      id: 'name',
      keys: ['your name', 'who are you', 'what is your name', 'name'],
      patterns: [/what'?s?\s*your\s*name/i, /who\s*are\s*you/i],
      reply: 'I\'m **KL Study Buddy** 🤖 — your smart AI study assistant built right into this website!\n\nI\'m 100% free, work offline, and know about all **9 subjects** in the 1st year CSE curriculum.\n\nNo API key needed — I run entirely in your browser! 🔒'
    },

    // ═══ SUBJECTS ═══
    {
      id: 'beec',
      keys: ['beec', 'basic electrical', 'electrical circuits', 'electronic circuits', 'kvl', 'kcl'],
      patterns: [/bee?c/i, /electrical/i, /kvl|kcl/i],
      reply: '⚡ **BEEC — Basic Electrical & Electronic Circuits**\n\n📍 Year 1, Semester 1\n\n**Key Topics:**\n• Circuit analysis (KVL, KCL, Mesh & Nodal)\n• Network theorems (Thevenin, Norton, Superposition)\n• AC/DC circuits, phasors & impedance\n• Diodes, BJT & MOSFET basics\n• Operational amplifiers intro\n\n**Exam Strategy:**\n🎯 Numericals carry 60-70% marks — practice daily!\n📝 Know all theorem statements with proofs\n🔑 Master AC phasor diagrams\n\n👉 **Materials → 1st Year → Semester 1 → BEEC**',
      followUp: ['Can you explain KVL?', 'What are network theorems?', 'Exam tips for BEEC?']
    },
    {
      id: 'dm',
      keys: ['dm', 'discrete math', 'discrete mathematics', 'graph theory', 'propositional logic', 'sets relations'],
      patterns: [/discrete\s*math/i, /\bdm\b/i, /graph\s*theory/i, /propositional/i],
      reply: '🔢 **DM — Discrete Mathematics**\n\n📍 Year 1, Semester 1\n\n**Key Topics:**\n• Sets, relations & functions\n• Propositional & predicate logic\n• Mathematical induction & proofs\n• Graph theory (Euler, Hamilton, trees)\n• Combinatorics & counting principles\n• Lattices & Boolean algebra\n\n**Exam Strategy:**\n🎯 Graph theory questions are predictable — practice all graph types\n📝 Logic truth tables are easy marks\n🔑 Master proof by induction\n\n👉 **Materials → 1st Year → Semester 1 → DM**',
      followUp: ['What is graph theory?', 'How to prove by induction?', 'DM exam tips?']
    },
    {
      id: 'psc',
      keys: ['psc', 'problem solving', 'c programming', 'c language', 'c program', 'pointers', 'arrays in c'],
      patterns: [/\bpsc\b/i, /\bc\s*(programming|language|program)\b/i, /problem\s*solving/i, /pointers/i],
      reply: '💻 **PSC — Problem Solving Through C**\n\n📍 Year 1, Semester 1\n\n**Key Topics:**\n• Data types, operators & expressions\n• Control structures (if/else, switch, loops)\n• Arrays (1D, 2D) & strings\n• Functions, recursion & scope\n• Pointers & dynamic memory allocation\n• Structures & file handling\n\n**Exam Strategy:**\n🎯 Write code on paper daily — exams test handwriting code!\n📝 Know output-prediction questions (tricky pointer arithmetic)\n🔑 Practice pattern printing programs\n\n💡 **Pro Tip:** Use HackerRank C track for daily practice!\n\n👉 **Materials → 1st Year → Semester 1 → PSC**',
      followUp: ['Explain pointers in C', 'Best resources for C?', 'Common C mistakes?']
    },
    {
      id: 'dsd',
      keys: ['dsd', 'digital system', 'digital design', 'digital logic', 'kmap', 'k-map', 'flip flop', 'boolean algebra'],
      patterns: [/\bdsd\b/i, /digital\s*(system|design|logic)/i, /k-?map/i, /flip\s*flop/i, /boolean/i],
      reply: '🔧 **DSD — Digital System Design**\n\n📍 Year 1, Semester 1\n\n**Key Topics:**\n• Number systems & code conversions\n• Boolean algebra & K-map simplification\n• Combinational circuits (MUX, decoder, encoder, adder)\n• Sequential circuits (SR, JK, D, T flip-flops)\n• Counters & shift registers\n• State machine design (Mealy & Moore)\n\n**Exam Strategy:**\n🎯 K-map simplification appears in EVERY exam — master it!\n📝 Draw clean circuit diagrams for full marks\n🔑 Know all flip-flop excitation tables\n\n👉 **Materials → 1st Year → Semester 1 → DSD**',
      followUp: ['How to solve K-maps?', 'Difference between Mealy and Moore?', 'DSD lab tips?']
    },
    {
      id: 'pp',
      keys: ['pp', 'python', 'python programming', 'python language', 'python basics', 'list comprehension'],
      patterns: [/\bpp\b/i, /python/i, /list\s*comprehension/i],
      reply: '🐍 **PP — Python Programming**\n\n📍 Year 1, Semester 2\n\n**Key Topics:**\n• Variables, data types & operators\n• Lists, tuples, dictionaries & sets\n• Control flow & comprehensions\n• Functions, lambda & decorators\n• OOP — classes, inheritance, polymorphism\n• File handling & exception handling\n• Modules: NumPy, Pandas basics\n\n**Exam Strategy:**\n🎯 Practice list/dict comprehensions — 1-line solutions impress!\n📝 Know all built-in functions (map, filter, reduce)\n🔑 OOP questions are guaranteed\n\n💡 **Pro Tip:** Build a mini project (calculator, quiz app) to stand out!\n\n👉 **Materials → 1st Year → Semester 2 → PP**',
      followUp: ['Best Python projects?', 'Explain OOP in Python', 'Python vs C differences?']
    },
    {
      id: 'lace',
      keys: ['lace', 'linear algebra', 'calculus', 'calculus for engineers', 'matrix', 'eigenvalue', 'eigenvector', 'integration'],
      patterns: [/\blace\b/i, /linear\s*algebra/i, /calculus/i, /eigenvalue/i, /eigenvector/i],
      reply: '📐 **LACE — Linear Algebra & Calculus for Engineers**\n\n📍 Year 1, Semester 2\n\n**Key Topics:**\n• Matrices — rank, inverse, echelon form\n• Eigenvalues & eigenvectors\n• Cayley-Hamilton theorem\n• Differential calculus — limits, continuity\n• Mean value theorems\n• Multiple integrals (double, triple)\n• Partial derivatives & Jacobians\n\n**Exam Strategy:**\n🎯 Eigenvalue problems = guaranteed 15+ marks\n📝 Practice step-by-step matrix row reduction\n🔑 Multiple integrals need lots of practice\n\n👉 **Materials → 1st Year → Semester 2 → LACE**',
      followUp: ['How to find eigenvalues?', 'Tips for integration?', 'LACE formulas sheet?']
    },
    {
      id: 'ds',
      keys: ['ds', 'data structures', 'data structure', 'linked list', 'binary tree', 'bst', 'sorting', 'stack', 'queue', 'graph'],
      patterns: [/\bds\b/i, /data\s*struct/i, /linked\s*list/i, /binary\s*tree/i, /sorting/i, /\bbst\b/i],
      reply: '🌳 **DS — Data Structures**\n\n📍 Year 1, Semester 2\n\n**Key Topics:**\n• Arrays, linked lists (singly, doubly, circular)\n• Stacks & queues (applications, implementations)\n• Trees — binary trees, BST, AVL, heap\n• Graphs — BFS, DFS, shortest path\n• Sorting — bubble, insertion, merge, quick, heap sort\n• Searching — linear, binary, hashing\n\n**Exam Strategy:**\n🎯 Tree traversals (inorder, preorder, postorder) = easy marks\n📝 Know time complexity of all algorithms\n🔑 Practice linked list operations on paper\n\n💡 **Pro Tip:** This is the MOST IMPORTANT subject for placements!\n\n👉 **Materials → 1st Year → Semester 2 → DS**',
      followUp: ['Explain BFS vs DFS', 'Time complexities cheat sheet?', 'Best DSA practice platform?']
    },
    {
      id: 'fis',
      keys: ['fis', 'iot', 'sensors', 'internet of things', 'fundamentals of iot', 'arduino', 'raspberry pi', 'mqtt'],
      patterns: [/\bfis\b/i, /\biot\b/i, /internet\s*of\s*things/i, /arduino/i, /raspberry/i, /mqtt/i],
      reply: '📡 **FIS — Fundamentals of IoT & Sensors**\n\n📍 Year 1, Semester 2\n\n**Key Topics:**\n• IoT architecture & layers\n• Sensors — types, working principles\n• Actuators & transducers\n• Communication protocols (MQTT, CoAP, HTTP)\n• Arduino & Raspberry Pi basics\n• IoT security & privacy\n• Smart applications (home, health, agriculture)\n\n**Exam Strategy:**\n🎯 Diagram-based answers score high — draw IoT architectures!\n📝 Know 5+ real-world IoT applications with examples\n🔑 Protocol comparison tables = easy marks\n\n👉 **Materials → 1st Year → Semester 2 → FIS**',
      followUp: ['IoT project ideas?', 'MQTT vs HTTP?', 'Best Arduino projects?']
    },
    {
      id: 'coa',
      keys: ['coa', 'computer organization', 'computer architecture', 'pipelining', 'cache memory', 'assembly', 'cpu architecture'],
      patterns: [/\bcoa\b/i, /computer\s*(org|arch)/i, /pipelining/i, /cache/i, /assembly\s*lang/i],
      reply: '🖥️ **COA — Computer Organization & Architecture**\n\n📍 Year 1, Semester 2\n\n**Key Topics:**\n• CPU architecture & instruction cycle\n• Instruction sets (RISC vs CISC)\n• Addressing modes\n• Memory hierarchy — cache, main memory, virtual memory\n• Pipelining — hazards, forwarding, stalling\n• I/O organization & interrupts\n• Assembly language basics\n\n**Exam Strategy:**\n🎯 Pipelining hazard questions are tricky but predictable\n📝 Draw proper pipeline diagrams for full marks\n🔑 Cache mapping (direct, associative, set-associative) = must know\n\n👉 **Materials → 1st Year → Semester 2 → COA**',
      followUp: ['RISC vs CISC?', 'Explain cache mapping', 'Pipelining hazards explained?']
    },
    {
      id: 'all_subjects',
      keys: ['subjects', 'all subjects', 'what subjects', 'which subjects', 'how many subjects', 'list subjects', 'available subjects'],
      patterns: [/what\s*subjects/i, /list\s*(all\s*)?subjects/i, /how\s*many\s*subjects/i, /available\s*subjects/i],
      reply: 'We cover **9 subjects** across Year 1:\n\n**📘 Semester 1 (Odd):**\n| Code | Subject | Key Area |\n|------|---------|----------|\n| ⚡ BEEC | Basic Electrical & Electronic Circuits | Circuit Analysis |\n| 🔢 DM | Discrete Mathematics | Logic & Graphs |\n| 💻 PSC | Problem Solving Through C | C Programming |\n| 🔧 DSD | Digital System Design | Digital Logic |\n\n**📗 Semester 2 (Even):**\n| Code | Subject | Key Area |\n|------|---------|----------|\n| 🐍 PP | Python Programming | Python |\n| 📐 LACE | Linear Algebra & Calculus | Math |\n| 🌳 DS | Data Structures | DSA |\n| 📡 FIS | Fundamentals of IoT & Sensors | IoT |\n| 🖥️ COA | Computer Organization & Architecture | Hardware |\n\nAsk me about any subject for details! 📚'
    },

    // ═══ MATERIALS & NAVIGATION ═══
    {
      id: 'materials',
      keys: ['material', 'download', 'notes', 'pdf', 'study material', 'get notes', 'where are materials', 'find materials', 'how to download'],
      patterns: [/download/i, /materials?/i, /\bnotes?\b/i, /\bpdf\b/i, /how\s*to\s*(get|find|download)/i],
      reply: '📥 **How to find & download materials:**\n\n**Step by step:**\n1. Click **📚 Materials** in the navigation bar\n2. Select your **Year** (1st Year)\n3. Pick your **Semester** (Odd/Even)\n4. Choose your **Subject** (e.g., BEEC, DM)\n5. Click the **⬇️ Download** button on any file!\n\n**Quick shortcuts:**\n• Use the **🔍 search bar** to find files by name\n• Add `?category=BEEC` to the Materials URL to jump directly\n• Files are PDF format, hosted on GitHub = **fast downloads!**\n\n💡 **Tip:** Bookmark the Materials page for quick access!'
    },
    {
      id: 'search',
      keys: ['search', 'how to search', 'find file', 'filter', 'how to filter', 'search bar'],
      patterns: [/how\s*to\s*(search|filter|find)/i, /search\s*bar/i],
      reply: '🔍 **Search & Filter Guide:**\n\n**Search bar:** Type any keyword — file name, subject code, or topic\n\n**Filter pills (step-by-step):**\n1. **Year** → select 1st Year\n2. **Semester** → Odd or Even\n3. **Subject** → specific subject\n\n**Pro tips:**\n• The **breadcrumb** shows your current filter path\n• Click **Reset** to clear all filters\n• URL shortcut: `materials.html?category=DS` jumps directly\n• Search works across file names AND subject names'
    },

    // ═══ ROADMAP & CAREER ═══
    {
      id: 'roadmap',
      keys: ['roadmap', 'career', 'career path', 'career guidance', 'what to learn', 'learning path'],
      patterns: [/roadmap/i, /career\s*(path|guid)/i, /what\s*(to|should)\s*learn/i, /learning\s*path/i],
      reply: '🗺️ **B.Tech CSE Career Roadmap:**\n\n**📘 Year 1 — Build Foundations:**\n• Master C & Python programming\n• Data Structures is your #1 priority\n• Start competitive coding (HackerRank)\n\n**📗 Year 2 — Core CS:**\n• OOP, DBMS, OS, Computer Networks\n• Learn Git, Linux basics\n• Start building projects\n\n**📙 Year 3 — Specialize:**\n• Web Dev, ML/AI, Cloud, or Cybersecurity\n• Build 3+ portfolio projects\n• Start applying for internships\n\n**📕 Year 4 — Career Launch:**\n• Placement prep — DSA + CS fundamentals\n• Resume & LinkedIn optimization\n• Mock interviews & coding contests\n\n👉 Visit the **Roadmap** page for the detailed guide!'
    },
    {
      id: 'placement',
      keys: ['placement', 'interview', 'job', 'internship', 'company', 'package', 'salary', 'placed'],
      patterns: [/placement/i, /interview/i, /\bjob\b/i, /internship/i, /company/i, /package/i],
      reply: '💼 **Placement Preparation Blueprint:**\n\n**🔥 Technical (60% weightage):**\n1. **DSA** — 200+ LeetCode problems (Easy→Medium→Hard)\n2. **CS Fundamentals** — OS, DBMS, CN, OOP (top 4 topics)\n3. **Projects** — 2-3 solid projects with live demos\n4. **System Design** — basics for 6+ LPA roles\n\n**📝 Aptitude (20% weightage):**\n• PrepInsta, IndiaBix, RS Aggarwal\n• Verbal, quantitative & logical reasoning\n\n**🗣️ Communication (20% weightage):**\n• Group discussions & HR interview prep\n• STAR method for behavioral questions\n• Resume building — quantify achievements!\n\n**📅 Timeline:**\n• Year 2: Start coding practice + 1 project\n• Year 3: Internships + 2 more projects\n• Year 4: Full prep mode!\n\n💡 **Top platforms:** LeetCode, GFG, InterviewBit, Naukri'
    },
    {
      id: 'web_dev',
      keys: ['web development', 'web dev', 'full stack', 'front end', 'back end', 'html css', 'javascript', 'react', 'node'],
      patterns: [/web\s*dev/i, /full\s*stack/i, /front\s*end/i, /back\s*end/i, /\breact\b/i, /\bnode\b/i],
      reply: '🌐 **Web Development Roadmap:**\n\n**🎨 Frontend:**\n1. HTML5 + CSS3 → Flexbox, Grid\n2. JavaScript (ES6+)\n3. React.js or Next.js\n4. Tailwind CSS or Material UI\n\n**⚙️ Backend:**\n1. Node.js + Express.js\n2. MongoDB or PostgreSQL\n3. REST APIs & GraphQL\n4. Authentication (JWT, OAuth)\n\n**☁️ DevOps:**\n• Git + GitHub\n• Docker basics\n• Deploy on Vercel/Netlify\n\n**📅 Timeline:** 6-8 months of consistent practice\n\n💡 **Free Resources:**\n• freeCodeCamp.org\n• The Odin Project\n• roadmap.sh/frontend'
    },
    {
      id: 'ml_ai',
      keys: ['machine learning', 'artificial intelligence', 'deep learning', 'neural network', 'data science', 'nlp'],
      patterns: [/machine\s*learning/i, /artificial\s*intel/i, /deep\s*learning/i, /neural/i, /data\s*science/i, /\bnlp\b/i],
      reply: '🧠 **ML/AI Learning Path:**\n\n**📐 Prerequisites:**\n• Python (strong grasp)\n• Linear Algebra & Calculus (LACE helps!)\n• Statistics & Probability\n\n**🔰 Beginner:**\n1. Supervised learning (regression, classification)\n2. Unsupervised learning (clustering, PCA)\n3. Scikit-learn library\n4. Kaggle competitions\n\n**🚀 Intermediate:**\n1. Deep Learning — CNNs, RNNs, Transformers\n2. TensorFlow or PyTorch\n3. NLP — text classification, chatbots\n4. Computer Vision projects\n\n**📅 Timeline:** 3-4 months for basics, 6+ for deep learning\n\n💡 **Free Resources:**\n• Andrew Ng\'s ML Course (Coursera)\n• fast.ai (practical deep learning)\n• Kaggle Learn courses'
    },
    {
      id: 'competitive_programming',
      keys: ['competitive programming', 'cp', 'coding contest', 'leetcode', 'hackerrank', 'codeforces', 'codechef'],
      patterns: [/competitive\s*prog/i, /\bcp\b/i, /leetcode/i, /hackerrank/i, /codeforces/i, /codechef/i, /coding\s*contest/i],
      reply: '🏆 **Competitive Programming Guide:**\n\n**🔰 Getting Started:**\n1. Master one language (C++ recommended)\n2. Learn STL (vectors, maps, sets, priority_queue)\n3. Start with Easy problems on LeetCode/HackerRank\n\n**📈 Level Up Strategy:**\n• Arrays & Strings → Two Pointers → Sliding Window\n• Recursion → Backtracking → Dynamic Programming\n• Trees → Graphs → BFS/DFS\n• Sorting → Binary Search → Greedy\n\n**🎯 Daily Plan:**\n• Solve 2-3 problems daily\n• Participate in weekly contests\n• Study editorial solutions for unsolved problems\n\n**🏅 Platforms (by difficulty):**\n1. HackerRank (beginner)\n2. LeetCode (interview prep)\n3. Codeforces (competitive)\n4. CodeChef (contests)\n\n💡 Start NOW — consistency > intensity!'
    },

    // ═══ STUDY TIPS ═══
    {
      id: 'study_tips',
      keys: ['study tips', 'how to study', 'exam tips', 'prepare', 'preparation', 'tips', 'study strategy'],
      patterns: [/study\s*tips?/i, /how\s*to\s*study/i, /exam\s*tips/i, /preparation\s*tips/i],
      reply: '📝 **Smart Study Strategies:**\n\n**🧠 Active Learning (not passive reading!):**\n1. **Feynman Technique** — explain concepts in simple words\n2. **Active Recall** — close the book, write what you remember\n3. **Spaced Repetition** — review at increasing intervals (1→3→7→14 days)\n4. **Practice Tests** — solve previous year questions (PYQs)\n\n**📅 Study Schedule:**\n• Study in **25-min Pomodoro** blocks with 5-min breaks\n• Most important subjects first (when brain is fresh)\n• Review notes within 24 hours of class\n\n**🚫 Avoid:**\n• Highlighting everything (creates false familiarity)\n• Studying 10+ hours before exams (diminishing returns)\n• Skipping sleep (memory consolidation happens during sleep!)\n\n**💪 Before Exams:**\n• 2 weeks before: make a revision plan\n• 1 week before: solve PYQs + formula sheets\n• Night before: light review only, sleep 7-8 hours!'
    },
    {
      id: 'pyq',
      keys: ['previous year', 'pyq', 'past papers', 'old papers', 'question papers', 'previous questions'],
      patterns: [/previous\s*(year|question)/i, /\bpyq\b/i, /past\s*(paper|question)/i, /old\s*paper/i, /question\s*paper/i],
      reply: '📄 **Previous Year Questions (PYQs):**\n\nPYQs are the **#1 way** to predict exam patterns!\n\n**How to use them:**\n1. Collect PYQs for the last 3-5 years\n2. Identify **repeated topics** (they appear 70% of the time!)\n3. Practice solving them **under timed conditions**\n4. Note the **mark distribution** per unit\n\n**Where to find:**\n• Check our **Materials** section for uploaded PYQs\n• Ask seniors for their collections\n• University library digital archives\n\n💡 **Pro Tip:** Make a frequency chart of topics from PYQs — study the most-asked ones first!'
    },

    // ═══ SITE FEATURES ═══
    {
      id: 'dark_mode',
      keys: ['dark mode', 'light mode', 'theme', 'switch theme', 'color mode', 'night mode'],
      patterns: [/dark\s*mode/i, /light\s*mode/i, /theme/i, /night\s*mode/i],
      reply: '🌙 **Theme Switching:**\n\nClick the **⚙️ sun/moon icon** in the top-right corner!\n\n• **Dark mode** — easier on eyes at night 🌙\n• **Light mode** — better for daytime reading ☀️\n\nYour preference is **saved automatically** — it remembers your choice!'
    },
    {
      id: 'pwa',
      keys: ['offline', 'pwa', 'install', 'app', 'without internet', 'work offline', 'progressive web app', 'add to home'],
      patterns: [/offline/i, /\bpwa\b/i, /install/i, /add\s*to\s*home/i, /without\s*internet/i, /progressive\s*web/i],
      reply: '📱 **Install as App (PWA):**\n\n**On Chrome/Edge:**\n1. Visit the site → click ⫶ menu → "Install App"\n2. Or click the install icon in the address bar\n\n**On Mobile:**\n1. Open in Chrome/Safari\n2. Tap "Add to Home Screen"\n3. It\'ll appear as a regular app!\n\n**Benefits:**\n✅ Works offline (cached pages)\n✅ Faster loading\n✅ No app store needed\n✅ Automatic updates\n\nPerfect for studying without internet! 🚀'
    },
    {
      id: 'chatbot_info',
      keys: ['chatbot', 'chat bot', 'this chat', 'study buddy', 'how does this work', 'are you ai', 'are you real'],
      patterns: [/chat\s*bot/i, /study\s*buddy/i, /are\s*you\s*(ai|real|human|bot)/i, /how\s*do\s*you\s*work/i],
      reply: '🤖 **About KL Study Buddy:**\n\nI\'m a **smart AI-like chatbot** built with:\n• 🧠 **Fuzzy NLP matching** — I understand misspellings & variations\n• 💬 **Conversation memory** — I remember what we discussed\n• 📚 **30+ topic areas** — subjects, career, coding, study tips\n• 🔒 **100% private** — I run in your browser, zero data sent anywhere\n• 💰 **100% free** — no API keys, no subscription\n\n**I can\'t do:**\n• Generate essays or solve homework\n• Access external websites\n• Remember between sessions\n\nBut I\'m great at guiding you through your CSE journey! 🚀'
    },

    // ═══ ABOUT & CONTACT ═══
    {
      id: 'about',
      keys: ['about', 'who made', 'creator', 'developer', 'praveen', 'who built', 'made by'],
      patterns: [/who\s*(made|built|created|developed)/i, /about\s*(this|the)\s*(site|website|project)/i, /praveen/i, /creator/i, /developer/i],
      reply: '👨‍💻 **About KL Material Study Hub:**\n\nCreated by **Praveen Reddy** — B.Tech CSE student at KL University.\n\n**🎯 Mission:** Make quality study materials **free and accessible** for all CSE students.\n\n**✨ Features:**\n• 📚 100+ free study materials (PDF)\n• 🗺️ Year-wise career roadmaps\n• 🤖 AI Study Buddy (me!)\n• 🌙 Dark/Light mode\n• 📱 PWA — works offline\n• ⚡ Fantasy-level animations\n\n**🛠️ Tech Stack:** HTML, CSS, JavaScript, Supabase, GitHub Pages\n\n👉 Visit **About** page for the full story!'
    },
    {
      id: 'contact',
      keys: ['contact', 'reach', 'email', 'github', 'linkedin', 'social', 'whatsapp', 'feedback', 'suggestion'],
      patterns: [/contact/i, /\bemail\b/i, /\bgithub\b/i, /linkedin/i, /whatsapp/i, /feedback/i, /suggestion/i],
      reply: '📬 **Get in Touch:**\n\n💻 **GitHub:** klstudyhub\n💼 **LinkedIn:** Praveen Reddy\n📧 **Email:** Available on the Contact page\n📱 **WhatsApp:** Study group link on Contact page\n📘 **Facebook** & 📸 **Instagram** also available\n\n**Want to contribute?**\n• Submit materials via GitHub pull request\n• Report bugs on GitHub Issues\n• Share suggestions via Contact form\n\n👉 Visit the **Contact** page for all links!'
    },
    {
      id: 'semester_info',
      keys: ['semester', 'sem 1', 'sem 2', 'odd semester', 'even semester', 'first semester', 'second semester'],
      patterns: [/semester\s*[12]/i, /\bsem\s*[12]\b/i, /odd\s*sem/i, /even\s*sem/i],
      reply: '📆 **Semester Structure:**\n\n**Semester 1 (Odd — July to Dec):**\n⚡ BEEC | 🔢 DM | 💻 PSC | 🔧 DSD\n\n**Semester 2 (Even — Jan to May):**\n🐍 PP | 📐 LACE | 🌳 DS | 📡 FIS | 🖥️ COA\n\n**To view materials:**\n1. Go to **Materials**\n2. Select **1st Year**\n3. Choose the semester\n\nMore years coming soon! 🚀'
    },
    {
      id: 'year_info',
      keys: ['1st year', 'first year', 'year 1', '2nd year', 'second year', 'year 2', '3rd year', 'year 3', '4th year', 'year 4'],
      patterns: [/(1st|first|2nd|second|3rd|third|4th|fourth)\s*year/i, /year\s*[1-4]/i],
      reply: '📅 **Year-wise Content:**\n\n**✅ 1st Year** — Fully available! Both semesters, 9 subjects, 100+ materials.\n\n**🔜 Coming Soon:**\n• 2nd Year — OOP, DBMS, OS, CN\n• 3rd Year — Electives + specializations\n• 4th Year — Projects + placement prep\n\nMeanwhile, check the **Roadmap** page for career guidance for ALL 4 years!'
    },

    // ═══ PROGRAMMING CONCEPTS ═══
    {
      id: 'programming_language',
      keys: ['which language', 'best language', 'programming language', 'should i learn', 'first language', 'language to learn'],
      patterns: [/which\s*(programming\s*)?lang/i, /best\s*lang/i, /should\s*i\s*learn/i, /first\s*lang/i, /what\s*lang/i],
      reply: '💡 **Which programming language to learn?**\n\n**For your 1st year CSE curriculum:**\n1. **C** (Semester 1 — PSC) — builds strong foundations\n2. **Python** (Semester 2 — PP) — versatile and beginner-friendly\n\n**For placements & career:**\n🥇 **C++** — competitive programming + DSA (most companies)\n🥈 **Java** — enterprise, Android development\n🥉 **JavaScript** — web development (full stack)\n🏅 **Python** — ML/AI, data science, automation\n\n**My recommendation:**\nC → Python → C++ (for DSA) → pick based on career goal!\n\n💡 **Language doesn\'t matter** as much as **problem-solving ability!**'
    },
    {
      id: 'git_github',
      keys: ['git', 'github', 'version control', 'repository', 'commit', 'push', 'pull request'],
      patterns: [/\bgit\b/i, /github/i, /version\s*control/i, /pull\s*request/i],
      reply: '🔀 **Git & GitHub Guide:**\n\n**What is Git?** A version control system to track code changes.\n**What is GitHub?** A platform to host & share code repositories.\n\n**Essential commands:**\n```\ngit init          — start new repo\ngit add .         — stage all changes\ngit commit -m ""  — save changes\ngit push          — upload to GitHub\ngit pull          — download updates\ngit branch        — manage branches\n```\n\n**Why you MUST learn Git:**\n✅ Required for ALL software jobs\n✅ Collaboration with teams\n✅ Portfolio building on GitHub\n✅ Open source contributions\n\n💡 **Start today:** Create a GitHub account & push your first project!'
    },

    // ═══ MISCELLANEOUS ═══
    {
      id: 'funny',
      keys: ['joke', 'funny', 'tell me a joke', 'make me laugh', 'humor'],
      patterns: [/joke/i, /funny/i, /make\s*me\s*laugh/i, /humor/i],
      reply: () => {
        const jokes = [
          '😄 Why do programmers prefer dark mode?\nBecause light attracts bugs! 🪲',
          '😄 A SQL query walks into a bar, sees two tables, and asks...\n"Can I JOIN you?" 🍺',
          '😄 Why was the JavaScript developer sad?\nBecause he didn\'t Node how to Express himself! 😢',
          '😄 What\'s a computer\'s favorite snack?\nMicrochips! 🍟',
          '😄 Why do Java developers wear glasses?\nBecause they can\'t C#! 👓',
          '😄 !false — it\'s funny because it\'s true. 🤓'
        ];
        return jokes[Math.floor(Math.random() * jokes.length)] + '\n\nNow back to studying! 📚';
      }
    },
    {
      id: 'motivate',
      keys: ['motivate', 'motivation', 'inspire', 'i am tired', 'i am bored', 'stressed', 'demotivated', 'depressed', 'sad', 'frustrated'],
      patterns: [/motivat/i, /inspir/i, /tired|bored|stressed|depressed|sad|frustrated/i, /i\s*(can'?t|cant)\s*(do|study)/i, /give\s*up/i],
      reply: () => {
        const quotes = [
          '💪 "The expert in anything was once a beginner." — Helen Hayes',
          '💪 "It does not matter how slowly you go, as long as you do not stop." — Confucius',
          '💪 "Success is not final, failure is not fatal. It is the courage to continue that counts." — Churchill',
          '💪 "The only way to do great work is to love what you do." — Steve Jobs',
          '💪 "First, solve the problem. Then, write the code." — John Johnson',
          '💪 "Code is like humor. When you have to explain it, it\'s bad." — Cory House'
        ];
        return quotes[Math.floor(Math.random() * quotes.length)] + '\n\n🌟 Remember: Every expert was once a beginner. You\'re doing great! Keep pushing forward, one step at a time. 🚀\n\nWant me to help you with something specific? Sometimes breaking a big task into small steps makes it easier!';
      }
    },
    {
      id: 'time',
      keys: ['time', 'what time', 'date', 'today', 'day'],
      patterns: [/what\s*(time|day|date)/i, /current\s*(time|date)/i, /today'?s?$/i],
      reply: () => {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return `📅 Today is **${now.toLocaleDateString('en-IN', options)}**\n🕐 Current time: **${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}**\n\nIs there something I can help you study? 📚`;
      }
    },
    {
      id: 'help',
      keys: ['help', 'what can you do', 'features', 'commands', 'menu', 'options'],
      patterns: [/^help$/i, /what\s*can\s*you\s*do/i, /^commands$/i, /^menu$/i, /^options$/i],
      reply: '🤖 **What I can help with:**\n\n📚 **Subjects** — Ask about BEEC, DM, PSC, DSD, PP, LACE, DS, FIS, COA\n📥 **Materials** — How to find & download study notes\n🗺️ **Roadmap** — Career paths for Web Dev, ML/AI, and more\n💼 **Placements** — Interview prep, DSA strategy\n📝 **Study Tips** — Exam prep, Pomodoro, active recall\n🏆 **Competitive Coding** — LeetCode, HackerRank guide\n🐍 **Languages** — Which to learn first?\n🔀 **Git/GitHub** — Version control basics\n🌙 **Site Features** — Dark mode, PWA, search\n❓ **General** — Motivation, jokes, and more!\n\n💡 **Tips:**\n• I understand typos and abbreviations\n• Ask follow-up questions — I remember context!\n• Try: "tell me a joke" or "motivate me" 😊'
    }
  ];

  // Quick reply suggestions
  const QUICK_REPLIES = [
    { label: '📚 Subjects', text: 'What subjects are available?' },
    { label: '📥 Materials', text: 'How do I download materials?' },
    { label: '🗺️ Roadmap', text: 'Tell me about the career roadmap' },
    { label: '💡 Study Tips', text: 'Give me study tips' },
    { label: '💼 Placements', text: 'Placement preparation guide' },
    { label: '🏆 CP Guide', text: 'Competitive programming guide' },
  ];

  // ─── SMART MATCHING ENGINE ─────────────────────────────
  function findBestMatch(input) {
    const expanded = expandSynonyms(input);
    const lower = expanded.toLowerCase().trim();
    const tokens = tokenize(lower);
    const bigrams = ngrams(tokens, 2);
    const trigrams = ngrams(tokens, 3);

    let bestMatch = null;
    let bestScore = 0;

    for (const entry of KB) {
      let score = 0;

      // 1. Regex pattern match (highest priority)
      if (entry.patterns) {
        for (const pat of entry.patterns) {
          if (pat.test(lower) || pat.test(input)) {
            score = Math.max(score, 90);
          }
        }
      }

      // 2. Exact key match
      for (const key of entry.keys) {
        if (lower === key) {
          score = 100;
          break;
        }
      }

      // 3. Contains key (full phrase)
      for (const key of entry.keys) {
        if (lower.includes(key)) {
          score = Math.max(score, 60 + key.length * 2);
        }
      }

      // 4. Key contains input
      for (const key of entry.keys) {
        if (key.includes(lower) && lower.length >= 2) {
          score = Math.max(score, 40 + lower.length * 2);
        }
      }

      // 5. Word-level matching
      for (const key of entry.keys) {
        const keyTokens = tokenize(key);
        const matched = keyTokens.filter(kt =>
          tokens.some(it => it === kt || similarity(it, kt) > 0.75)
        );
        if (matched.length > 0) {
          const wordScore = 25 + (matched.length / Math.max(keyTokens.length, 1)) * 40;
          score = Math.max(score, wordScore);
        }
      }

      // 6. Fuzzy matching with Levenshtein
      for (const key of entry.keys) {
        const sim = similarity(lower, key);
        if (sim > 0.7) {
          score = Math.max(score, sim * 70);
        }
      }

      // 7. Bigram/trigram matching
      for (const key of entry.keys) {
        for (const bg of bigrams) {
          if (key.includes(bg)) score = Math.max(score, 45 + bg.length);
        }
        for (const tg of trigrams) {
          if (key.includes(tg)) score = Math.max(score, 55 + tg.length);
        }
      }

      // 8. Context boost — if user asked about same topic area
      if (lastTopicKey === entry.id && score > 15) {
        score += 10;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (bestScore >= 20 && bestMatch) {
      lastTopicKey = bestMatch.id;
      const reply = typeof bestMatch.reply === 'function' ? bestMatch.reply() : bestMatch.reply;
      return { reply, followUp: bestMatch.followUp || null };
    }

    return null;
  }

  function getResponse(input) {
    // Store in conversation history
    conversationHistory.push({ role: 'user', text: input, time: Date.now() });

    const match = findBestMatch(input);
    if (match) {
      conversationHistory.push({ role: 'bot', text: match.reply, time: Date.now() });
      return match;
    }

    // Smart fallback — suggest based on keywords
    const lower = input.toLowerCase();
    let suggestion = '';
    if (/code|program|debug|error|bug/i.test(lower)) {
      suggestion = '\n\n💡 Try asking about a specific language: **C, Python, or competitive programming**!';
    } else if (/learn|course|resource|tutorial/i.test(lower)) {
      suggestion = '\n\n💡 Try asking about: **roadmap, web development, ML/AI, or competitive programming**!';
    } else if (/exam|test|mark|grade|cgpa/i.test(lower)) {
      suggestion = '\n\n💡 Try asking about: **study tips, exam tips, or previous year questions (PYQ)**!';
    }

    const fallbacks = [
      `I'm not sure about that yet, but I'm always learning! 🤖${suggestion}\n\nHere's what I know best:\n📚 Subjects • 📥 Materials • 🗺️ Roadmap • 💼 Placements • 📝 Study Tips`,
      `That's a great question! I don't have info on that specific topic.${suggestion}\n\nTry asking about **subjects, materials, career guidance**, or **study tips**! 😊`,
      `Hmm, I couldn't find a match for that. 🤔${suggestion}\n\nType **help** to see everything I can assist with!`,
    ];
    const reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    conversationHistory.push({ role: 'bot', text: reply, time: Date.now() });
    return { reply, followUp: null };
  }

  // ─── CREATE UI ────────────────────────────────────────
  function createChatUI() {
    // Floating action button
    const fab = document.createElement('button');
    fab.id = 'gemini-chat-fab';
    fab.setAttribute('aria-label', 'Open AI Study Buddy chat');
    fab.innerHTML = `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`;
    fab.addEventListener('click', toggleChat);

    // Chat window
    const win = document.createElement('div');
    win.id = 'gemini-chat-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'KL Study Buddy Chat');
    win.innerHTML = `
      <div class="gchat-header">
        <div class="gchat-header-info">
          <span class="gchat-avatar"><i class="fa-solid fa-robot"></i></span>
          <div>
            <strong>KL Study Buddy</strong>
            <small>AI-Powered • Free • Private</small>
          </div>
        </div>
        <button class="gchat-close" aria-label="Close chat">&times;</button>
      </div>
      <div id="gchat-messages" class="gchat-messages">
        <div class="gchat-msg bot">
          <span class="gchat-msg-icon"><i class="fa-solid fa-robot"></i></span>
          <div class="gchat-bubble">Hey! 👋 I'm your <strong>KL Study Buddy</strong> — a smart AI assistant.<br><br>I know about all <strong>9 subjects</strong>, career paths, coding guides, and study strategies!<br><br>Ask me anything or tap an option below:</div>
        </div>
      </div>
      <form id="gchat-form" class="gchat-input-area" autocomplete="off">
        <input type="text" id="gchat-input" placeholder="Ask about subjects, roadmaps, coding..." autocomplete="off" />
        <button type="submit" class="gchat-send" aria-label="Send message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </form>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(win);

    // Add quick reply buttons after welcome message
    addQuickReplies();

    // Events
    win.querySelector('.gchat-close').addEventListener('click', toggleChat);
    document.getElementById('gchat-form').addEventListener('submit', handleSubmit);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) toggleChat();
    });
  }

  // ─── QUICK REPLIES ────────────────────────────────────
  function addQuickReplies(items) {
    const container = document.getElementById('gchat-messages');
    const qrWrap = document.createElement('div');
    qrWrap.className = 'gchat-quick-replies';

    const buttons = items || QUICK_REPLIES;
    buttons.forEach(qr => {
      const btn = document.createElement('button');
      btn.className = 'gchat-qr-btn';
      btn.textContent = qr.label || qr.text;
      btn.addEventListener('click', () => {
        // Remove quick replies after click
        const existing = container.querySelectorAll('.gchat-quick-replies');
        existing.forEach(el => el.remove());
        // Simulate sending the message
        document.getElementById('gchat-input').value = qr.text;
        document.getElementById('gchat-form').dispatchEvent(new Event('submit'));
      });
      qrWrap.appendChild(btn);
    });

    container.appendChild(qrWrap);
    container.scrollTop = container.scrollHeight;
  }

  // ─── TOGGLE ───────────────────────────────────────────
  function toggleChat() {
    const win = document.getElementById('gemini-chat-window');
    const fab = document.getElementById('gemini-chat-fab');
    isOpen = !isOpen;
    win.classList.toggle('open', isOpen);
    fab.classList.toggle('hidden', isOpen);
    if (isOpen) document.getElementById('gchat-input').focus();
  }

  // ─── SUBMIT ───────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    const input = document.getElementById('gchat-input');
    const query = input.value.trim();
    if (!query) return;

    input.value = '';

    // Remove quick replies if still visible
    const qrs = document.querySelectorAll('.gchat-quick-replies');
    qrs.forEach(qr => qr.remove());

    appendMsg('user', query);

    // Show typing indicator then respond
    const typingId = showTyping();
    const delay = 500 + Math.random() * 800;

    setTimeout(() => {
      removeTyping(typingId);
      const result = getResponse(query);
      appendMsg('bot', result.reply);

      // Show follow-up suggestions if available
      if (result.followUp && result.followUp.length > 0) {
        setTimeout(() => {
          addQuickReplies(result.followUp.map(f => ({ label: f, text: f })));
        }, 300);
      }
    }, delay);
  }

  // ─── UI HELPERS ───────────────────────────────────────
  function appendMsg(role, text, raw) {
    const container = document.getElementById('gchat-messages');
    const div = document.createElement('div');
    div.className = 'gchat-msg ' + (role === 'user' ? 'user' : 'bot');

    const icon = role === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';
    let html;
    if (raw) {
      html = text;
    } else if (role === 'user') {
      html = text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    } else {
      // Bot responses: render markdown-like formatting
      html = text
        .replace(/&/g, '&amp;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>')
        .replace(/\n/g, '<br>');
    }

    div.innerHTML = '<span class="gchat-msg-icon">' + icon + '</span><div class="gchat-bubble">' + html + '</div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
  }

  function showTyping() {
    const container = document.getElementById('gchat-messages');
    const div = document.createElement('div');
    const id = 'typing-' + Date.now();
    div.id = id;
    div.className = 'gchat-msg bot';
    div.innerHTML = '<span class="gchat-msg-icon"><i class="fa-solid fa-robot"></i></span><div class="gchat-bubble gchat-typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>';
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return id;
  }

  function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  // ─── INIT ─────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatUI);
  } else {
    createChatUI();
  }
})();
