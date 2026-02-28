// ====================================
// KL Study Buddy — Smart Local Chatbot
// 100% client-side, no API keys needed
// ====================================
(function () {
  'use strict';

  let isOpen = false;

  // ─── KNOWLEDGE BASE ──────────────────────────────────
  const KB = [
    // Greetings
    {
      keys: ['hello', 'hi', 'hey', 'hii', 'hiii', 'good morning', 'good evening', 'good afternoon'],
      reply: 'Hey there! 👋 I\'m your KL Study Buddy. I can help you with subjects, materials, roadmaps, and study tips. What would you like to know?'
    },
    {
      keys: ['how are you', 'whats up', 'how r u', 'wassup'],
      reply: 'I\'m doing great, thanks for asking! 😊 Ready to help you with your studies. Ask me about any subject or feature!'
    },
    {
      keys: ['thank', 'thanks', 'thx', 'thankyou', 'thank you', 'ty'],
      reply: 'You\'re welcome! 😊 Happy to help. Feel free to ask anything else!'
    },
    {
      keys: ['bye', 'goodbye', 'see you', 'see ya'],
      reply: 'Goodbye! 👋 Good luck with your studies. Come back anytime you need help!'
    },

    // Help / What can you do
    {
      keys: ['help', 'what can you do', 'features', 'what do you know', 'commands'],
      reply: 'I can help you with:\n📚 **Subjects** — Ask about BEEC, DM, PSC, DSD, PP, LACE, DS, FIS, COA\n📖 **Materials** — How to find & download study materials\n🗺️ **Roadmap** — Career guidance for each year\n🔍 **Search** — How to use filters and search\n🌙 **Features** — Dark mode, offline support, PWA\n\nJust type your question!'
    },

    // ── Subject: BEEC ──
    {
      keys: ['beec', 'basic electrical', 'electrical circuits', 'electronic circuits'],
      reply: '⚡ **BEEC — Basic Electrical & Electronic Circuits**\n\n📍 Year 1, Semester 1\n\n**Key Topics:**\n• Circuit analysis (KVL, KCL)\n• AC/DC circuits & network theorems\n• Diodes, transistors & amplifiers\n• Digital logic basics\n\n**Tip:** Focus on solving numericals — they carry the most marks!\n\n👉 Go to **Materials → 1st Year → Semester 1 → BEEC** to download notes.'
    },

    // ── Subject: DM ──
    {
      keys: ['dm', 'discrete math', 'discrete mathematics'],
      reply: '🔢 **DM — Discrete Mathematics**\n\n📍 Year 1, Semester 1\n\n**Key Topics:**\n• Sets, relations & functions\n• Propositional & predicate logic\n• Graph theory & trees\n• Combinatorics & counting\n• Group theory basics\n\n**Tip:** Practice proof techniques — direct, contradiction, and induction!\n\n👉 Go to **Materials → 1st Year → Semester 1 → DM** to download notes.'
    },

    // ── Subject: PSC ──
    {
      keys: ['psc', 'problem solving', 'c programming', 'c language'],
      reply: '💻 **PSC — Problem Solving Through C**\n\n📍 Year 1, Semester 1\n\n**Key Topics:**\n• Variables, data types & operators\n• Control structures (if/else, loops)\n• Arrays, strings & pointers\n• Functions & recursion\n• File handling & structures\n\n**Tip:** Write code daily! Practice on platforms like HackerRank or LeetCode.\n\n👉 Go to **Materials → 1st Year → Semester 1 → PSC** to download notes.'
    },

    // ── Subject: DSD ──
    {
      keys: ['dsd', 'digital system', 'digital design', 'digital logic'],
      reply: '🔧 **DSD — Digital System Design**\n\n📍 Year 1, Semester 1\n\n**Key Topics:**\n• Number systems & Boolean algebra\n• Logic gates & K-maps\n• Combinational circuits (MUX, decoder)\n• Sequential circuits (flip-flops, counters)\n• State machines & memory\n\n**Tip:** Master K-map simplification — it appears in every exam!\n\n👉 Go to **Materials → 1st Year → Semester 1 → DSD** to download notes.'
    },

    // ── Subject: PP ──
    {
      keys: ['pp', 'python', 'python programming'],
      reply: '🐍 **PP — Python Programming**\n\n📍 Year 1, Semester 2\n\n**Key Topics:**\n• Variables, data types & operators\n• Lists, tuples, dictionaries & sets\n• Functions, lambda & modules\n• OOP concepts in Python\n• File handling & exception handling\n\n**Tip:** Build small projects like a calculator or to-do list to strengthen concepts!\n\n👉 Go to **Materials → 1st Year → Semester 2 → PP** to download notes.'
    },

    // ── Subject: LACE ──
    {
      keys: ['lace', 'linear algebra', 'calculus', 'calculus for engineers'],
      reply: '📐 **LACE — Linear Algebra & Calculus for Engineers**\n\n📍 Year 1, Semester 2\n\n**Key Topics:**\n• Matrices & determinants\n• Eigenvalues & eigenvectors\n• Differential calculus\n• Integral calculus\n• Partial derivatives & multiple integrals\n\n**Tip:** Focus on matrix operations and integration techniques — they\'re heavily tested!\n\n👉 Go to **Materials → 1st Year → Semester 2 → LACE** to download notes.'
    },

    // ── Subject: DS ──
    {
      keys: ['ds', 'data structures', 'data structure'],
      reply: '🌳 **DS — Data Structures**\n\n📍 Year 1, Semester 2\n\n**Key Topics:**\n• Arrays, linked lists, stacks & queues\n• Trees (binary, BST, AVL)\n• Graphs (BFS, DFS)\n• Sorting & searching algorithms\n• Hashing & hash tables\n\n**Tip:** Implement each data structure from scratch — understanding internals is key!\n\n👉 Go to **Materials → 1st Year → Semester 2 → DS** to download notes.'
    },

    // ── Subject: FIS ──
    {
      keys: ['fis', 'iot', 'sensors', 'internet of things', 'fundamentals of iot'],
      reply: '📡 **FIS — Fundamentals of IoT & Sensors**\n\n📍 Year 1, Semester 2\n\n**Key Topics:**\n• IoT architecture & protocols\n• Sensors & actuators\n• Arduino/Raspberry Pi basics\n• MQTT, CoAP & communication protocols\n• IoT security & applications\n\n**Tip:** Try hands-on projects with Arduino — practical knowledge is valuable!\n\n👉 Go to **Materials → 1st Year → Semester 2 → FIS** to download notes.'
    },

    // ── Subject: COA ──
    {
      keys: ['coa', 'computer organization', 'computer architecture'],
      reply: '🖥️ **COA — Computer Organization & Architecture**\n\n📍 Year 1, Semester 2\n\n**Key Topics:**\n• CPU architecture & instruction sets\n• Memory hierarchy & cache\n• Pipelining & parallelism\n• I/O organization\n• Assembly language basics\n\n**Tip:** Understand pipelining hazards and cache mapping — common exam topics!\n\n👉 Go to **Materials → 1st Year → Semester 2 → COA** to download notes.'
    },

    // General subjects question
    {
      keys: ['subjects', 'all subjects', 'what subjects', 'which subjects', 'how many subjects', 'list subjects'],
      reply: 'We currently cover **9 subjects** across Year 1:\n\n**Semester 1 (Odd):**\n⚡ BEEC — Basic Electrical & Electronic Circuits\n🔢 DM — Discrete Mathematics\n💻 PSC — Problem Solving Through C\n🔧 DSD — Digital System Design\n\n**Semester 2 (Even):**\n🐍 PP — Python Programming\n📐 LACE — Linear Algebra & Calculus\n🌳 DS — Data Structures\n📡 FIS — Fundamentals of IoT & Sensors\n🖥️ COA — Computer Organization & Architecture\n\nMore subjects coming soon! 🚀'
    },

    // Materials / Downloads
    {
      keys: ['material', 'download', 'notes', 'pdf', 'study material', 'get notes', 'where are materials', 'find materials'],
      reply: '📥 **How to find materials:**\n\n1. Click **Materials** in the navigation\n2. Select your **Year** (1st–4th)\n3. Pick your **Semester** (Odd/Even)\n4. Choose your **Subject**\n5. Click **Download** on any file!\n\nYou can also use the **search bar** to find materials by name.\n\n💡 **Tip:** Materials are hosted on GitHub for fast, reliable downloads!'
    },

    // Search
    {
      keys: ['search', 'how to search', 'find', 'filter', 'how to filter'],
      reply: '🔍 **Using Search & Filters:**\n\n• Use the **search bar** at the top of Materials page to search by file name or subject\n• Use **Year → Semester → Subject** pill selectors for step-by-step filtering\n• The **breadcrumb** shows your current filter path\n• Click **Reset** to clear all filters\n\n💡 You can also use `?category=BEEC` in the URL to jump directly to a subject!'
    },

    // Roadmap
    {
      keys: ['roadmap', 'career', 'placement', 'skills', 'what to learn', 'career path', 'career guidance'],
      reply: '🗺️ **B.Tech CSE Roadmap:**\n\n**Year 1:** Focus on fundamentals — C, Python, Data Structures\n**Year 2:** Core CS — OOP, DBMS, OS, Computer Networks\n**Year 3:** Specialize — Web Dev, ML/AI, Cloud, Cybersecurity\n**Year 4:** Projects, internships & placement prep\n\n**Top Resources:**\n🔗 roadmap.sh — Visual career roadmaps\n🎓 Udemy — In-depth courses\n💻 LeetCode — Coding practice\n\n👉 Visit the **Roadmap** page for the full guide!'
    },

    // Placements
    {
      keys: ['placement', 'interview', 'job', 'internship', 'placed', 'company'],
      reply: '💼 **Placement Preparation Tips:**\n\n1. **DSA** — Solve 200+ problems on LeetCode/GFG\n2. **Projects** — Build 2-3 solid projects for your resume\n3. **CS Fundamentals** — OS, DBMS, CN, OOPs are must-knows\n4. **Aptitude** — Practice on IndiaBix/PrepInsta\n5. **Communication** — Work on English & presentation skills\n\n**Start early** — ideally from Year 2!\n\n👉 Visit the **Roadmap** page for year-wise guidance.'
    },

    // Dark mode / Theme
    {
      keys: ['dark mode', 'light mode', 'theme', 'color', 'switch theme'],
      reply: '🌙 **Theme Switching:**\n\nClick the **sun/moon icon** (⚙️) in the top-right corner to toggle between dark and light modes.\n\nYour preference is saved automatically — it\'ll remember your choice next time!'
    },

    // Offline / PWA
    {
      keys: ['offline', 'pwa', 'install', 'app', 'without internet', 'work offline'],
      reply: '📱 **Offline & PWA Support:**\n\nThis site works as a **Progressive Web App (PWA)**!\n\n• **Install it:** Click "Add to Home Screen" in your browser menu\n• **Works offline:** Previously visited pages are cached\n• **Fast loading:** Assets are cached by the service worker\n\nPerfect for studying without internet! 🚀'
    },

    // About
    {
      keys: ['about', 'who made', 'creator', 'developer', 'praveen', 'who are you', 'who built'],
      reply: '👨‍💻 **About KL Material:**\n\nCreated by **Praveen Reddy**, a B.Tech CSE student at KL University.\n\n**Mission:** Make quality study materials freely accessible to all CSE students.\n\n**Features:**\n• Free PDF notes & materials\n• Career roadmap guidance\n• AI Study Buddy (me! 😊)\n• Dark mode & PWA support\n\n👉 Visit the **About** page to learn more!'
    },

    // Contact
    {
      keys: ['contact', 'reach', 'email', 'github', 'linkedin', 'social', 'whatsapp'],
      reply: '📬 **Contact Praveen Reddy:**\n\n📧 Email — Available on the Contact page\n💻 GitHub — praveenreddy8942-debug\n💼 LinkedIn — Praveen Reddy\n📱 WhatsApp — Join our study group!\n📘 Facebook & 📸 Instagram also available\n\n👉 Visit the **Contact** page for all links!'
    },

    // Exam tips
    {
      keys: ['exam', 'tips', 'study tips', 'how to study', 'prepare', 'preparation'],
      reply: '📝 **Study & Exam Tips:**\n\n1. 📅 **Plan ahead** — Make a study schedule 2 weeks before exams\n2. 📖 **Active recall** — Test yourself instead of just reading\n3. ✍️ **Write it down** — Writing helps memory retention\n4. 🔄 **Spaced repetition** — Review topics at increasing intervals\n5. 💤 **Sleep well** — Your brain consolidates memory during sleep\n6. 🎯 **Focus on PYQs** — Previous year questions show the pattern\n\nGood luck! 💪'
    },

    // Semester
    {
      keys: ['semester', 'sem 1', 'sem 2', 'odd semester', 'even semester', 'first semester', 'second semester'],
      reply: '📆 **Semesters:**\n\n**1st Year:**\n• Semester 1 (Odd) — BEEC, DM, PSC, DSD\n• Semester 2 (Even) — PP, LACE, DS, FIS, COA\n\nTo view materials for a specific semester:\n1. Go to **Materials**\n2. Select **1st Year**\n3. Choose **Semester 1** or **Semester 2**\n\nMore years coming soon! 🚀'
    },

    // Year
    {
      keys: ['1st year', 'first year', 'year 1', '2nd year', 'second year', 'year 2', '3rd year', 'third year', 'year 3', '4th year', 'fourth year', 'year 4'],
      reply: 'Currently we have materials for **1st Year** (both semesters).\n\nMaterials for **2nd, 3rd, and 4th Year** are coming soon! 🚀\n\nMeanwhile, check out the **Roadmap** page for year-wise career guidance and skill suggestions for all 4 years.'
    },
  ];

  // Quick reply suggestions
  const QUICK_REPLIES = [
    { label: '📚 Subjects', text: 'What subjects are available?' },
    { label: '📥 Materials', text: 'How do I download materials?' },
    { label: '🗺️ Roadmap', text: 'Tell me about the career roadmap' },
    { label: '💡 Study Tips', text: 'Give me study tips' },
  ];

  // ─── MATCHING ENGINE ─────────────────────────────────
  function findBestMatch(input) {
    const lower = input.toLowerCase().trim();
    let bestMatch = null;
    let bestScore = 0;

    for (const entry of KB) {
      let score = 0;
      for (const key of entry.keys) {
        if (lower === key) {
          score = 100; // exact match
        } else if (lower.includes(key)) {
          score = Math.max(score, 50 + key.length); // contains keyword, longer = better
        } else if (key.includes(lower) && lower.length >= 2) {
          score = Math.max(score, 30 + lower.length); // partial match
        } else {
          // Word-level match
          const inputWords = lower.split(/\s+/);
          const keyWords = key.split(/\s+/);
          const matched = keyWords.filter(kw => inputWords.some(iw => iw.includes(kw) || kw.includes(iw)));
          if (matched.length > 0) {
            score = Math.max(score, 20 + matched.length * 10);
          }
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = entry;
      }
    }

    if (bestScore >= 20 && bestMatch) {
      return bestMatch.reply;
    }

    return null;
  }

  function getResponse(input) {
    const match = findBestMatch(input);
    if (match) return match;

    // Fallback responses
    const fallbacks = [
      'Hmm, I\'m not sure about that. Try asking about a **subject** (like BEEC, DM, PSC), **materials**, **roadmap**, or **study tips**! 😊',
      'I don\'t have info on that yet, but I can help with **subjects, materials, career guidance,** and **exam tips**. What would you like to know?',
      'That\'s a great question! Unfortunately, I can only help with topics related to this study hub. Try asking about a **subject** or **how to download materials**! 📚',
    ];
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
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
            <small>Smart Study Assistant</small>
          </div>
        </div>
        <button class="gchat-close" aria-label="Close chat">&times;</button>
      </div>
      <div id="gchat-messages" class="gchat-messages">
        <div class="gchat-msg bot">
          <span class="gchat-msg-icon"><i class="fa-solid fa-robot"></i></span>
          <div class="gchat-bubble">Hey! 👋 I'm your KL Study Buddy.<br>I know about all <strong>9 subjects</strong>, materials, career roadmaps, and study tips!<br><br>Ask me anything or tap a quick option below:</div>
        </div>
      </div>
      <form id="gchat-form" class="gchat-input-area" autocomplete="off">
        <input type="text" id="gchat-input" placeholder="Ask about subjects, roadmaps..." autocomplete="off" />
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
  function addQuickReplies() {
    const container = document.getElementById('gchat-messages');
    const qrWrap = document.createElement('div');
    qrWrap.className = 'gchat-quick-replies';

    QUICK_REPLIES.forEach(qr => {
      const btn = document.createElement('button');
      btn.className = 'gchat-qr-btn';
      btn.textContent = qr.label;
      btn.addEventListener('click', () => {
        // Remove quick replies after click
        const existing = container.querySelector('.gchat-quick-replies');
        if (existing) existing.remove();
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
    const qr = document.querySelector('.gchat-quick-replies');
    if (qr) qr.remove();

    appendMsg('user', query);

    // Show typing indicator then respond
    const typingId = showTyping();
    const delay = 400 + Math.random() * 600; // 400-1000ms for natural feel

    setTimeout(() => {
      removeTyping(typingId);
      const response = getResponse(query);
      appendMsg('bot', response);
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
      // Sanitize user input
      html = text
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    } else {
      // Bot responses: render markdown-like formatting
      html = text
        .replace(/&/g, '&amp;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
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
