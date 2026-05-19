# skill categories — organized by domain

SKILL_DATABASE = {
    "programming_languages": [
        "python", "java", "javascript", "typescript", "c", "c++", "c#",
        "ruby", "go", "golang", "rust", "swift", "kotlin", "scala",
        "r", "matlab", "perl", "php", "dart", "lua", "haskell",
        "objective-c", "assembly", "fortran", "cobol", "visual basic",
        "elixir", "clojure", "groovy", "julia", "shell", "bash",
        "powershell", "sql", "plsql", "html", "css", "sass", "less"
    ],

    "web_frameworks": [
        "react", "reactjs", "react.js", "angular", "angularjs", "vue",
        "vuejs", "vue.js", "next.js", "nextjs", "nuxt", "nuxtjs",
        "svelte", "django", "flask", "fastapi", "express", "expressjs",
        "spring", "spring boot", "springboot", "rails", "ruby on rails",
        "laravel", "asp.net", ".net", "dotnet", "gatsby", "remix",
        "ember", "backbone", "jquery", "bootstrap", "tailwind",
        "tailwindcss", "material ui", "chakra ui", "ant design"
    ],

    "databases": [
        "mysql", "postgresql", "postgres", "mongodb", "redis", "sqlite",
        "oracle", "sql server", "mssql", "mariadb", "cassandra",
        "dynamodb", "couchdb", "neo4j", "elasticsearch", "firebase",
        "firestore", "supabase", "cockroachdb", "influxdb", "memcached"
    ],

    "cloud_devops": [
        "aws", "amazon web services", "azure", "microsoft azure",
        "gcp", "google cloud", "google cloud platform", "heroku",
        "digitalocean", "vercel", "netlify", "cloudflare",
        "docker", "kubernetes", "k8s", "terraform", "ansible",
        "jenkins", "github actions", "gitlab ci", "circleci",
        "travis ci", "ci/cd", "cicd", "nginx", "apache",
        "linux", "unix", "ubuntu", "centos", "debian",
        "vagrant", "puppet", "chef", "prometheus", "grafana",
        "datadog", "splunk", "elk stack", "logstash", "kibana"
    ],

    "data_science_ml": [
        "machine learning", "deep learning", "artificial intelligence",
        "ai", "ml", "neural networks", "natural language processing",
        "nlp", "computer vision", "cv", "data science", "data analysis",
        "data analytics", "data engineering", "data mining",
        "tensorflow", "pytorch", "keras", "scikit-learn", "sklearn",
        "pandas", "numpy", "scipy", "matplotlib", "seaborn",
        "plotly", "tableau", "power bi", "powerbi", "jupyter",
        "spark", "pyspark", "hadoop", "hive", "airflow",
        "mlflow", "kubeflow", "sagemaker", "hugging face",
        "transformers", "bert", "gpt", "llm", "large language model",
        "generative ai", "rag", "langchain", "openai", "opencv",
        "yolo", "random forest", "xgboost", "regression",
        "classification", "clustering", "reinforcement learning",
        "feature engineering", "model deployment", "a/b testing"
    ],

    "mobile_development": [
        "android", "ios", "react native", "flutter", "swift",
        "kotlin", "objective-c", "xamarin", "ionic", "cordova",
        "swiftui", "jetpack compose", "mobile development",
        "app development", "cross-platform"
    ],

    "tools_platforms": [
        "git", "github", "gitlab", "bitbucket", "svn",
        "jira", "confluence", "trello", "asana", "notion",
        "slack", "microsoft teams", "figma", "sketch", "adobe xd",
        "postman", "swagger", "insomnia", "vs code", "visual studio",
        "intellij", "eclipse", "vim", "emacs", "sublime text",
        "webpack", "vite", "babel", "eslint", "prettier",
        "npm", "yarn", "pip", "maven", "gradle",
        "rest api", "restful", "graphql", "grpc", "websocket",
        "oauth", "jwt", "api design", "microservices",
        "serverless", "rabbitmq", "kafka", "celery"
    ],

    "testing": [
        "unit testing", "integration testing", "end-to-end testing",
        "e2e testing", "test driven development", "tdd", "bdd",
        "jest", "mocha", "chai", "cypress", "selenium",
        "pytest", "unittest", "junit", "testng", "playwright",
        "puppeteer", "load testing", "performance testing",
        "qa", "quality assurance", "automation testing"
    ],

    "soft_skills": [
        "leadership", "communication", "teamwork", "collaboration",
        "problem solving", "problem-solving", "critical thinking",
        "analytical thinking", "creativity", "adaptability",
        "time management", "project management", "agile",
        "scrum", "kanban", "mentoring", "coaching",
        "presentation", "public speaking", "negotiation",
        "decision making", "conflict resolution", "empathy",
        "attention to detail", "multitasking", "self-motivated",
        "customer service", "stakeholder management",
        "cross-functional", "strategic thinking", "innovation"
    ],

    "security": [
        "cybersecurity", "information security", "infosec",
        "penetration testing", "ethical hacking", "vulnerability assessment",
        "soc", "siem", "encryption", "ssl", "tls", "https",
        "owasp", "firewall", "ids", "ips", "malware analysis",
        "incident response", "compliance", "gdpr", "hipaa",
        "iso 27001", "nist", "security audit"
    ],

    "design": [
        "ui design", "ux design", "ui/ux", "user interface",
        "user experience", "wireframing", "prototyping",
        "responsive design", "accessibility", "a11y",
        "graphic design", "visual design", "interaction design",
        "design thinking", "user research", "usability testing",
        "information architecture", "adobe photoshop",
        "adobe illustrator", "adobe premiere", "canva"
    ]
}

# maps common abbreviations to canonical names
SKILL_SYNONYMS = {
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "rb": "ruby",
    "cpp": "c++",
    "csharp": "c#",
    "golang": "go",
    "node": "node.js",
    "nodejs": "node.js",
    "node.js": "node.js",
    "react": "reactjs",
    "react.js": "reactjs",
    "vue": "vuejs",
    "vue.js": "vuejs",
    "angular": "angularjs",
    "next": "nextjs",
    "next.js": "nextjs",
    "pg": "postgresql",
    "postgres": "postgresql",
    "mongo": "mongodb",
    "k8s": "kubernetes",
    "tf": "tensorflow",
    "sk-learn": "scikit-learn",
    "sklearn": "scikit-learn",
    "aws": "amazon web services",
    "gcp": "google cloud platform",
    "ml": "machine learning",
    "dl": "deep learning",
    "ai": "artificial intelligence",
    "nlp": "natural language processing",
    "cv": "computer vision",
    "ci/cd": "cicd",
    "qa": "quality assurance",
    "tdd": "test driven development",
    "bdd": "behavior driven development",
    "rn": "react native",
    "ror": "ruby on rails",
}

# strong verbs that make resume bullet points stand out
ACTION_VERBS = {
    "leadership": [
        "led", "directed", "managed", "supervised", "oversaw",
        "coordinated", "orchestrated", "spearheaded", "headed",
        "championed", "mentored", "guided", "drove", "established"
    ],
    "achievement": [
        "achieved", "accomplished", "attained", "delivered",
        "exceeded", "improved", "increased", "reduced", "saved",
        "generated", "grew", "boosted", "maximized", "minimized",
        "optimized", "streamlined", "transformed", "accelerated"
    ],
    "technical": [
        "developed", "built", "designed", "engineered", "implemented",
        "programmed", "coded", "architected", "deployed", "automated",
        "configured", "integrated", "migrated", "refactored",
        "debugged", "tested", "maintained", "upgraded", "scaled"
    ],
    "communication": [
        "presented", "communicated", "collaborated", "facilitated",
        "documented", "published", "reported", "trained", "taught",
        "advised", "consulted", "negotiated", "persuaded", "advocated"
    ],
    "analysis": [
        "analyzed", "evaluated", "assessed", "researched",
        "investigated", "identified", "discovered", "diagnosed",
        "measured", "quantified", "forecasted", "modeled",
        "interpreted", "validated", "benchmarked", "audited"
    ],
    "creation": [
        "created", "launched", "initiated", "founded",
        "introduced", "pioneered", "proposed", "formulated",
        "devised", "invented", "conceptualized", "prototyped"
    ]
}

# resume section headings we look for
EXPECTED_SECTIONS = {
    "contact": ["contact", "contact information", "personal information", "personal details"],
    "summary": ["summary", "professional summary", "objective", "career objective", "about me", "profile", "about"],
    "experience": ["experience", "work experience", "professional experience", "employment history", "work history", "employment"],
    "education": ["education", "academic background", "academic qualifications", "qualifications", "academics"],
    "skills": ["skills", "technical skills", "core competencies", "competencies", "key skills", "technologies", "tech stack"],
    "projects": ["projects", "personal projects", "academic projects", "key projects", "notable projects"],
    "certifications": ["certifications", "certificates", "professional certifications", "licenses"],
    "achievements": ["achievements", "awards", "honors", "accomplishments", "recognition"],
}

# ATS formatting best practices
ATS_FORMATTING_RULES = {
    "standard_headings": {
        "description": "Use standard section headings (e.g., 'Work Experience' instead of 'My Journey')",
        "weight": 3
    },
    "no_tables_images": {
        "description": "Avoid tables, images, and complex formatting that ATS cannot parse",
        "weight": 2
    },
    "consistent_date_format": {
        "description": "Use consistent date formatting (e.g., 'Jan 2023 - Present')",
        "weight": 2
    },
    "contact_info_present": {
        "description": "Include complete contact information (email, phone, LinkedIn)",
        "weight": 3
    },
    "reasonable_length": {
        "description": "Keep resume between 1-2 pages (300-1000 words)",
        "weight": 2
    },
    "no_special_characters": {
        "description": "Minimize special characters, icons, and symbols",
        "weight": 1
    },
    "file_format": {
        "description": "Use PDF or DOCX format (avoid images/scanned documents)",
        "weight": 2
    }
}


def get_all_skills_flat():
    """Return a flat set of every skill across all categories."""
    all_skills = set()
    for category_skills in SKILL_DATABASE.values():
        for skill in category_skills:
            all_skills.add(skill.lower())
    return all_skills


def get_all_action_verbs_flat():
    """Return a flat set of all action verbs."""
    all_verbs = set()
    for category_verbs in ACTION_VERBS.values():
        for verb in category_verbs:
            all_verbs.add(verb.lower())
    return all_verbs


def normalize_skill(skill):
    """Map abbreviations to their canonical form, or return as-is."""
    skill_lower = skill.lower().strip()
    return SKILL_SYNONYMS.get(skill_lower, skill_lower)
