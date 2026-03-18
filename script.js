const sectionFiles = [
    "profile",
    "about",
    "experience",
    "projects",
    "technologies",
    "publications",
    "contact"
];

const translations = {
    en: {
        pageTitle: "Davide Mattioli | ML Engineer, Data Engineer, and PhD Candidate",
        languageLabel: "🌍",
        languageAriaLabel: "Language",
        languages: {
            en: "🇬🇧",
            it: "🇮🇹",
            de: "🇩🇪"
        },
        nav: {
            about: "Value",
            projects: "Work",
            funProjects: "Fun Projects",
            experience: "Experience",
            technologies: "Capabilities",
            publications: "Research",
            contact: "Contact"
        },
        themeLabels: {
            dark: "Switch to dark theme",
            light: "Switch to light theme"
        },
        copy: {
            "#profile .section-eyebrow": "Davide Mattioli · ML Engineer · Data Engineer · PhD Candidate",
            "#profile .hero-title": "ML and data engineering for remote sensing.",
            "#profile .hero-lede": "PhD Candidate in AI/DL for Remote Sensing at the University of Goettingen, working across Earth observation models, scalable data pipelines, and scientific ML systems.",
            "#profile .hero-actions .btn-primary": "View Selected Work",
            "#profile .hero-actions .btn-secondary": "Download CV",
            "#profile .hero-actions .text-link": "Email me",
            "#profile .hero-proof:nth-of-type(1) h2": "Geospatial AI and remote sensing",
            "#profile .hero-proof:nth-of-type(1) p": "UAV and VHR imagery, canopy mapping, segmentation, and geospatial ETL.",
            "#profile .hero-proof:nth-of-type(2) h2": "ML engineering for EO and CV",
            "#profile .hero-proof:nth-of-type(2) p": "Foundation models, weak supervision, segmentation, and retrieval.",
            "#profile .hero-proof:nth-of-type(3) h2": "Data engineering and HPC",
            "#profile .hero-proof:nth-of-type(3) p": "SLURM analytics, distributed inference, and reproducible research pipelines.",
            "#profile .hero-context__label": "Current focus",
            "#profile .hero-context__list li:nth-of-type(1)": "PhD research in AI/DL for remote sensing at the University of Goettingen.",
            "#profile .hero-context__list li:nth-of-type(2)": "ML engineering for Earth observation models, segmentation, and explainability.",
            "#profile .hero-context__list li:nth-of-type(3)": "Data engineering for geospatial ETL and scientific compute workflows.",
            "#about .section-eyebrow": "Research and Engineering Focus",
            "#about .section-title": "My work sits at the intersection of Earth observation, model design, and scientific infrastructure.",
            "#about .section-copy": "I work as an ML engineer and data engineer while pushing deeper into remote-sensing research through my PhD.",
            "#about .capability-item:nth-of-type(1) h3": "Geospatial AI and remote sensing",
            "#about .capability-item:nth-of-type(1) p:last-child": "UAV and VHR imagery analysis, canopy mapping, segmentation, and geospatial ETL.",
            "#about .capability-item:nth-of-type(2) h3": "ML engineering for EO and CV",
            "#about .capability-item:nth-of-type(2) p:last-child": "Foundation models, feature extraction, weak supervision, and segmentation for Earth observation.",
            "#about .capability-item:nth-of-type(3) h3": "Data engineering and scientific validation",
            "#about .capability-item:nth-of-type(3) p:last-child": "Scalable ETL, reproducible pipelines, SLURM-aware workflows, and model diagnostics.",
            "#projects .section-eyebrow": "Selected Work",
            "#projects .section-title": "Projects that show how I build remote-sensing systems.",
            "#projects .section-copy": "One featured case study, then two supporting projects in reproducible UAV workflows and EO open-source engineering.",
            "#projects .case-study .card-eyebrow": "Featured System",
            "#projects .case-study h3": "SegEdge",
            "#projects .case-study__lede": "Built to move from orthophoto tiles to repeatable segmentation runs.",
            "#projects .pipeline-step:nth-of-type(1) .pipeline-step__eyebrow": "Input",
            "#projects .pipeline-step:nth-of-type(1) strong": "Orthophotos",
            "#projects .pipeline-step:nth-of-type(2) .pipeline-step__eyebrow": "Model Stack",
            "#projects .pipeline-step:nth-of-type(2) strong": "DINOv3 + SAM 2",
            "#projects .pipeline-step:nth-of-type(3) .pipeline-step__eyebrow": "Delivery",
            "#projects .pipeline-step:nth-of-type(3) strong": "SLURM-ready runs",
            "#projects .case-study__visual-note": "Structured package code, experiment runners, and wrappers for batch inference.",
            "#projects .case-study .project-summary": "A remote-sensing segmentation system for tree-crown delineation and agricultural field extraction, organized so experiments and operational runs use the same backbone.",
            "#projects .case-study .project-meta span:nth-of-type(1)": "Role: repository design, experiment runners, reusable wrappers",
            "#projects .case-study .project-meta span:nth-of-type(2)": "Why it matters: turns research segmentation into repeatable batch inference",
            "#projects .case-study .project-tags li:nth-of-type(1)": "Tree crowns",
            "#projects .case-study .project-tags li:nth-of-type(2)": "Farmland",
            "#projects .case-study .project-tags li:nth-of-type(3)": "HPC inference",
            "#projects .case-study .project-actions a": "View repository",
            "#projects .case-study .project-note": "Best example of research code shaped into an operational workflow.",
            "#projects .project-card--supporting:nth-of-type(2) .card-eyebrow": "Research Workflow",
            "#projects .project-card--supporting:nth-of-type(2) h3": "Multi-angular UAV reflectance extraction",
            "#projects .project-card--supporting:nth-of-type(2) .project-summary": "A reproducible workflow for extracting multi-angular UAV reflectance data from orthophotos, camera geometry, and field samples without rebuilding the analysis from scratch each time.",
            "#projects .project-card--supporting:nth-of-type(2) .project-meta span:nth-of-type(1)": "Role: structured the pipeline for research reuse and repeatable outputs",
            "#projects .project-card--supporting:nth-of-type(2) .project-meta span:nth-of-type(2)": "Stack: Python, R, Metashape",
            "#projects .project-card--supporting:nth-of-type(2) .project-note": "Useful when a field workflow has to survive beyond one experiment cycle.",
            "#projects .project-card--supporting:nth-of-type(2) .project-actions a": "Open repository",
            "#projects .project-card--supporting:nth-of-type(3) .card-eyebrow": "Open-Source Contribution",
            "#projects .project-card--supporting:nth-of-type(3) h3": "ESA OpenSR contribution",
            "#projects .project-card--supporting:nth-of-type(3) .project-summary": "Contribution work on opensr-model, the latent-diffusion super-resolution project for RGB-NIR Sentinel-2 imagery, with package-oriented and HPC-aware engineering.",
            "#projects .project-card--supporting:nth-of-type(3) .project-meta span:nth-of-type(1)": "Role: contribution work on repository structure and execution workflow",
            "#projects .project-card--supporting:nth-of-type(3) .project-meta span:nth-of-type(2)": "Focus: EO super-resolution for Sentinel-2",
            "#projects .project-card--supporting:nth-of-type(3) .project-note": "Shows how I work inside an existing open-source research codebase.",
            "#projects .project-card--supporting:nth-of-type(3) .project-actions a": "Open repository",
            "#experience .section-intro .section-eyebrow": "Experience",
            "#experience .section-title": "Current roles across PhD research, engineering, and scientific infrastructure.",
            "#experience .section-copy": "I split my time between remote-sensing research, ML engineering, and data engineering for scientific workflows.",
            "#experience .role-entry:nth-of-type(1) .role-meta span:nth-of-type(1)": "Present",
            "#experience .role-entry:nth-of-type(1) h3": "PhD Candidate, AI/DL for Remote Sensing",
            "#experience .role-entry:nth-of-type(1) p": "Researching Earth observation models and scientific ML workflows for remote sensing, with a focus on representation quality, explainability, and scalable inference.",
            "#experience .role-entry:nth-of-type(1) .role-points li:nth-of-type(1)": "Working on geospatial AI for UAV and VHR imagery analysis and segmentation.",
            "#experience .role-entry:nth-of-type(1) .role-points li:nth-of-type(2)": "Exploring DINO-style backbones, decoder-based segmentation, and weak-to-strong supervision.",
            "#experience .role-entry:nth-of-type(1) .role-points li:nth-of-type(3)": "Studying explainability signals to validate model behaviour in environmental monitoring.",
            "#experience .role-entry:nth-of-type(2) .role-meta span:nth-of-type(1)": "2025 - Present",
            "#experience .role-entry:nth-of-type(2) h3": "Data Engineer",
            "#experience .role-entry:nth-of-type(2) p": "Building HPC reporting workflows that connect infrastructure metrics, energy consumption, and pricing data into clearer operational KPIs.",
            "#experience .role-entry:nth-of-type(2) .role-points li:nth-of-type(1)": "Developed energy efficiency metrics to track SLURM workloads for reporting.",
            "#experience .role-entry:nth-of-type(2) .role-points li:nth-of-type(2)": "Integrated energy pricing APIs into HPC analytics for real-time cost visibility.",
            "#experience .role-entry:nth-of-type(2) .role-points li:nth-of-type(3)": "Worked on performance-aware processing for scientific compute environments.",
            "#experience .role-entry:nth-of-type(3) .role-meta span:nth-of-type(1)": "2025 - Present",
            "#experience .role-entry:nth-of-type(3) h3": "Research Assistant",
            "#experience .role-entry:nth-of-type(3) p": "Maintaining and improving open-source ETL workflows for UAV imagery used in remote-sensing research and publication work.",
            "#experience .role-entry:nth-of-type(3) .role-points li:nth-of-type(1)": "Maintained ETL tooling for UAV imagery processing and downstream analysis.",
            "#experience .role-entry:nth-of-type(3) .role-points li:nth-of-type(2)": "Redesigned extraction workflows, improving throughput by 30×.",
            "#experience .role-entry:nth-of-type(3) .role-points li:nth-of-type(3)": "Led analysis and literature synthesis for an ongoing manuscript.",
            "#experience .experience-sidebar .sidebar-block:nth-of-type(1) .section-eyebrow": "Education",
            "#experience .credential-list li:nth-of-type(1) strong": "PhD Candidate, AI/DL for Remote Sensing",
            "#experience .credential-list li:nth-of-type(2) strong": "MSc, Applied Data Science",
            "#experience .credential-list li:nth-of-type(3) strong": "BSc, Economics and Data Science",
            "#experience .experience-sidebar .sidebar-block:nth-of-type(2) .section-eyebrow": "Earlier Research Work",
            "#experience .sidebar-note h3": "Volunteer Researcher",
            "#experience .sidebar-note p": "Machine Learning Journal Club, Turin · 2021 - 2023",
            "#experience .sidebar-note .role-points li:nth-of-type(1)": "Prepared EEG datasets and applied noise-reduction models.",
            "#experience .sidebar-note .role-points li:nth-of-type(2)": "Ran Python workshops for biology students on scientific computing.",
            "#technologies .section-eyebrow": "Capabilities",
            "#technologies .section-title": "The stack is broad because the work spans models, geospatial data, and infrastructure.",
            "#technologies .section-copy": "These are the tools and methods I use most often in research and engineering work today.",
            "#technologies .matrix-card:nth-of-type(1) h3": "Programming",
            "#technologies .matrix-card:nth-of-type(1) .stack-list li:nth-of-type(3)": "Config-driven workflows and reproducible scripting",
            "#technologies .matrix-card:nth-of-type(2) h3": "ML and AI",
            "#technologies .matrix-card:nth-of-type(3) h3": "Remote Sensing and Geospatial",
            "#technologies .matrix-card:nth-of-type(3) .stack-list li:nth-of-type(2)": "Orthophoto processing and vector/raster workflows",
            "#technologies .matrix-card:nth-of-type(3) .stack-list li:nth-of-type(3)": "Canopy structure mapping and orthophoto-based segmentation",
            "#technologies .matrix-card:nth-of-type(4) h3": "Modeling and Methods",
            "#technologies .matrix-card:nth-of-type(4) .stack-list li:nth-of-type(1)": "Weak supervision and feature retrieval",
            "#technologies .matrix-card:nth-of-type(4) .stack-list li:nth-of-type(2)": "DenseCRF and topology-aware segmentation",
            "#technologies .matrix-card:nth-of-type(4) .stack-list li:nth-of-type(3)": "Feature attribution, attention diagnostics, layer and channel analysis",
            "#technologies .matrix-card:nth-of-type(5) h3": "Infrastructure and Delivery",
            "#technologies .matrix-card:nth-of-type(5) .stack-list li:nth-of-type(2)": "Distributed inference and multi-stage pipelines",
            "#technologies .matrix-card:nth-of-type(5) .stack-list li:nth-of-type(4)": "Performance and energy analytics for scientific compute",
            "#publications .section-eyebrow": "Research",
            "#publications .section-title": "My current research direction is centered on remote sensing models that can be trusted.",
            "#publications .section-copy": "The common thread is not just better predictive performance. It is building EO models and scientific workflows that remain interpretable, testable, and computationally realistic.",
            "#publications .card-eyebrow": "Current PhD Direction",
            "#publications h3": "Foundation models, explainability, and segmentation for Earth observation",
            "#publications .publication-copy p:last-child": "I am currently focused on visual backbones for EO, weak-to-strong supervision, decoder-based segmentation, and explainability workflows that help validate what the models are really using.",
            "#publications .publication-notes p:nth-of-type(1)": "<strong>Remote sensing</strong> UAV imagery, VHR data, canopy structure, orthophotos",
            "#publications .publication-notes p:nth-of-type(2)": "<strong>Explainability</strong> feature attribution, attention diagnostics, layer analysis",
            "#publications .publication-notes p:nth-of-type(3)": "<strong>Systems</strong> reproducible pipelines, distributed inference, HPC-aware processing",
            "#contact .section-eyebrow": "Contact",
            "#contact .section-title": "If the work looks relevant, I'm easy to reach.",
            "#contact .section-copy": "Email is best for role discussions and collaboration. LinkedIn and GitHub are there for faster context.",
            "#contact .contact-row:nth-of-type(1) .contact-row__label": "Email"
        }
    },
    it: {
        pageTitle: "Davide Mattioli | ML Engineer, Data Engineer e Dottorando",
        languageLabel: "🌍",
        languageAriaLabel: "Lingua",
        languages: {
            en: "🇬🇧",
            it: "🇮🇹",
            de: "🇩🇪"
        },
        nav: {
            about: "Profilo",
            projects: "Progetti",
            funProjects: "Progetti fun",
            experience: "Esperienza",
            technologies: "Competenze",
            publications: "Ricerca",
            contact: "Contatti"
        },
        themeLabels: {
            dark: "Passa al tema scuro",
            light: "Passa al tema chiaro"
        },
        copy: {
            "#profile .section-eyebrow": "Davide Mattioli · ML Engineer · Data Engineer · Dottorando",
            "#profile .hero-title": "ML e data engineering per il remote sensing.",
            "#profile .hero-lede": "Dottorando in AI/DL per il Remote Sensing all'Universita di Goettingen, lavoro su modelli per Earth observation, pipeline dati scalabili e sistemi di scientific ML.",
            "#profile .hero-actions .btn-primary": "Vedi i progetti selezionati",
            "#profile .hero-actions .btn-secondary": "Scarica il CV",
            "#profile .hero-actions .text-link": "Scrivimi",
            "#profile .hero-proof:nth-of-type(1) h2": "Geospatial AI e remote sensing",
            "#profile .hero-proof:nth-of-type(1) p": "Immagini UAV e VHR, canopy mapping, segmentazione e geospatial ETL.",
            "#profile .hero-proof:nth-of-type(2) h2": "ML engineering per EO e CV",
            "#profile .hero-proof:nth-of-type(2) p": "Foundation model, weak supervision, segmentazione e retrieval.",
            "#profile .hero-proof:nth-of-type(3) h2": "Data engineering e HPC",
            "#profile .hero-proof:nth-of-type(3) p": "Analisi SLURM, inferenza distribuita e pipeline di ricerca riproducibili.",
            "#profile .hero-context__label": "Focus attuale",
            "#profile .hero-context__list li:nth-of-type(1)": "Ricerca di dottorato in AI/DL per il remote sensing all'Universita di Goettingen.",
            "#profile .hero-context__list li:nth-of-type(2)": "ML engineering per modelli di Earth observation, segmentazione ed explainability.",
            "#profile .hero-context__list li:nth-of-type(3)": "Data engineering per geospatial ETL e workflow scientifici su infrastrutture di calcolo.",
            "#about .section-eyebrow": "Focus di ricerca e ingegneria",
            "#about .section-title": "Il mio lavoro si colloca tra Earth observation, progettazione di modelli e infrastrutture scientifiche.",
            "#about .section-copy": "Lavoro come ML engineer e data engineer mentre approfondisco la ricerca sul remote sensing attraverso il mio dottorato.",
            "#about .capability-item:nth-of-type(1) h3": "Geospatial AI e remote sensing",
            "#about .capability-item:nth-of-type(1) p:last-child": "Analisi di immagini UAV e VHR, canopy mapping, segmentazione e geospatial ETL.",
            "#about .capability-item:nth-of-type(2) h3": "ML engineering per EO e CV",
            "#about .capability-item:nth-of-type(2) p:last-child": "Foundation model, feature extraction, weak supervision e segmentazione per Earth observation.",
            "#about .capability-item:nth-of-type(3) h3": "Data engineering e validazione scientifica",
            "#about .capability-item:nth-of-type(3) p:last-child": "ETL scalabili, pipeline riproducibili, workflow SLURM-aware e diagnostica dei modelli.",
            "#projects .section-eyebrow": "Lavori selezionati",
            "#projects .section-title": "Progetti che mostrano come costruisco sistemi di remote sensing.",
            "#projects .section-copy": "Un case study principale, poi due progetti di supporto tra workflow UAV riproducibili e ingegneria open-source per EO.",
            "#projects .case-study .card-eyebrow": "Sistema in evidenza",
            "#projects .case-study h3": "SegEdge",
            "#projects .case-study__lede": "Pensato per passare da tile orthophoto a esecuzioni di segmentazione ripetibili.",
            "#projects .pipeline-step:nth-of-type(1) .pipeline-step__eyebrow": "Input",
            "#projects .pipeline-step:nth-of-type(1) strong": "Orthophoto",
            "#projects .pipeline-step:nth-of-type(2) .pipeline-step__eyebrow": "Stack del modello",
            "#projects .pipeline-step:nth-of-type(2) strong": "DINOv3 + SAM 2",
            "#projects .pipeline-step:nth-of-type(3) .pipeline-step__eyebrow": "Esecuzione",
            "#projects .pipeline-step:nth-of-type(3) strong": "Run pronti per SLURM",
            "#projects .case-study__visual-note": "Codice orientato a package, runner sperimentali e wrapper per inferenza batch.",
            "#projects .case-study .project-summary": "Un sistema di segmentazione per remote sensing dedicato a tree-crown delineation ed estrazione di campi agricoli, organizzato in modo che esperimenti ed esecuzioni operative condividano la stessa base.",
            "#projects .case-study .project-meta span:nth-of-type(1)": "Ruolo: progettazione del repository, runner sperimentali, wrapper riusabili",
            "#projects .case-study .project-meta span:nth-of-type(2)": "Perche conta: porta la segmentazione di ricerca verso inferenza batch ripetibile",
            "#projects .case-study .project-tags li:nth-of-type(1)": "Chiome arboree",
            "#projects .case-study .project-tags li:nth-of-type(2)": "Campi agricoli",
            "#projects .case-study .project-tags li:nth-of-type(3)": "Inferenza HPC",
            "#projects .case-study .project-actions a": "Vedi il repository",
            "#projects .case-study .project-note": "L'esempio migliore di codice di ricerca trasformato in workflow operativo.",
            "#projects .project-card--supporting:nth-of-type(2) .card-eyebrow": "Workflow di ricerca",
            "#projects .project-card--supporting:nth-of-type(2) h3": "Estrazione multi-angolare di reflectance UAV",
            "#projects .project-card--supporting:nth-of-type(2) .project-summary": "Un workflow riproducibile per estrarre dati di reflectance UAV multi-angolare da orthophoto, geometria delle camere e campioni di campo senza ricostruire ogni volta l'analisi da zero.",
            "#projects .project-card--supporting:nth-of-type(2) .project-meta span:nth-of-type(1)": "Ruolo: ho strutturato la pipeline per riuso nella ricerca e output ripetibili",
            "#projects .project-card--supporting:nth-of-type(2) .project-meta span:nth-of-type(2)": "Stack: Python, R, Metashape",
            "#projects .project-card--supporting:nth-of-type(2) .project-note": "Utile quando un workflow di campo deve resistere oltre un singolo ciclo sperimentale.",
            "#projects .project-card--supporting:nth-of-type(2) .project-actions a": "Apri il repository",
            "#projects .project-card--supporting:nth-of-type(3) .card-eyebrow": "Contributo open-source",
            "#projects .project-card--supporting:nth-of-type(3) h3": "Contributo a ESA OpenSR",
            "#projects .project-card--supporting:nth-of-type(3) .project-summary": "Lavoro di contributo su opensr-model, il progetto di super-resolution a latent diffusion per immagini Sentinel-2 RGB-NIR, con ingegneria orientata a package e attenta all'HPC.",
            "#projects .project-card--supporting:nth-of-type(3) .project-meta span:nth-of-type(1)": "Ruolo: contributo su struttura del repository e workflow di esecuzione",
            "#projects .project-card--supporting:nth-of-type(3) .project-meta span:nth-of-type(2)": "Focus: EO super-resolution su Sentinel-2",
            "#projects .project-card--supporting:nth-of-type(3) .project-note": "Mostra come lavoro dentro una codebase open-source di ricerca esistente.",
            "#projects .project-card--supporting:nth-of-type(3) .project-actions a": "Apri il repository",
            "#experience .section-intro .section-eyebrow": "Esperienza",
            "#experience .section-title": "Ruoli attuali tra ricerca di dottorato, ingegneria e infrastrutture scientifiche.",
            "#experience .section-copy": "Divido il mio tempo tra ricerca sul remote sensing, ML engineering e data engineering per workflow scientifici.",
            "#experience .role-entry:nth-of-type(1) .role-meta span:nth-of-type(1)": "Attuale",
            "#experience .role-entry:nth-of-type(1) h3": "Dottorando, AI/DL per il Remote Sensing",
            "#experience .role-entry:nth-of-type(1) p": "Studio modelli per Earth observation e workflow di scientific ML per il remote sensing, con attenzione a qualita delle rappresentazioni, explainability e inferenza scalabile.",
            "#experience .role-entry:nth-of-type(1) .role-points li:nth-of-type(1)": "Lavoro su geospatial AI per analisi e segmentazione di immagini UAV e VHR.",
            "#experience .role-entry:nth-of-type(1) .role-points li:nth-of-type(2)": "Sviluppo backbone in stile DINO, segmentazione decoder-based e weak-to-strong supervision.",
            "#experience .role-entry:nth-of-type(1) .role-points li:nth-of-type(3)": "Studio segnali di explainability per validare il comportamento dei modelli nel monitoraggio ambientale.",
            "#experience .role-entry:nth-of-type(2) .role-meta span:nth-of-type(1)": "2025 - Attuale",
            "#experience .role-entry:nth-of-type(2) h3": "Data Engineer",
            "#experience .role-entry:nth-of-type(2) p": "Costruisco workflow HPC che collegano metriche infrastrutturali, consumi energetici e prezzi per KPI operativi piu chiari.",
            "#experience .role-entry:nth-of-type(2) .role-points li:nth-of-type(1)": "Ho sviluppato metriche di efficienza energetica per monitorare workload SLURM.",
            "#experience .role-entry:nth-of-type(2) .role-points li:nth-of-type(2)": "Ho integrato API sui prezzi dell'energia in analisi HPC per visibilita dei costi in tempo reale.",
            "#experience .role-entry:nth-of-type(2) .role-points li:nth-of-type(3)": "Ho lavorato su elaborazione performance-aware per ambienti di calcolo scientifico.",
            "#experience .role-entry:nth-of-type(3) .role-meta span:nth-of-type(1)": "2025 - Attuale",
            "#experience .role-entry:nth-of-type(3) h3": "Research Assistant",
            "#experience .role-entry:nth-of-type(3) p": "Mantengo e miglioro workflow ETL open-source per immagini UAV usate in ricerca e pubblicazioni di remote sensing.",
            "#experience .role-entry:nth-of-type(3) .role-points li:nth-of-type(1)": "Ho mantenuto tooling ETL per elaborazione UAV e analisi downstream.",
            "#experience .role-entry:nth-of-type(3) .role-points li:nth-of-type(2)": "Ho riprogettato i workflow di estrazione, migliorando il throughput di 30×.",
            "#experience .role-entry:nth-of-type(3) .role-points li:nth-of-type(3)": "Ho guidato analisi e sintesi bibliografica per un manoscritto in corso.",
            "#experience .experience-sidebar .sidebar-block:nth-of-type(1) .section-eyebrow": "Formazione",
            "#experience .credential-list li:nth-of-type(1) strong": "Dottorando, AI/DL per il Remote Sensing",
            "#experience .credential-list li:nth-of-type(2) strong": "MSc, Applied Data Science",
            "#experience .credential-list li:nth-of-type(3) strong": "BSc, Economics and Data Science",
            "#experience .experience-sidebar .sidebar-block:nth-of-type(2) .section-eyebrow": "Ricerca precedente",
            "#experience .sidebar-note h3": "Ricercatore volontario",
            "#experience .sidebar-note p": "Machine Learning Journal Club, Torino · 2021 - 2023",
            "#experience .sidebar-note .role-points li:nth-of-type(1)": "Ho preparato dataset EEG e applicato modelli di riduzione del rumore.",
            "#experience .sidebar-note .role-points li:nth-of-type(2)": "Ho tenuto workshop Python per studenti di biologia sul calcolo scientifico.",
            "#technologies .section-eyebrow": "Competenze",
            "#technologies .section-title": "Lo stack e ampio perche il lavoro tocca modelli, dati geospaziali e infrastruttura.",
            "#technologies .section-copy": "Questi sono gli strumenti e i metodi che uso piu spesso oggi in ricerca e ingegneria.",
            "#technologies .matrix-card:nth-of-type(1) h3": "Programmazione",
            "#technologies .matrix-card:nth-of-type(1) .stack-list li:nth-of-type(3)": "Workflow guidati da configurazione e scripting riproducibile",
            "#technologies .matrix-card:nth-of-type(2) h3": "ML e AI",
            "#technologies .matrix-card:nth-of-type(3) h3": "Remote sensing e geospaziale",
            "#technologies .matrix-card:nth-of-type(3) .stack-list li:nth-of-type(2)": "Elaborazione orthophoto e workflow vettoriali/raster",
            "#technologies .matrix-card:nth-of-type(3) .stack-list li:nth-of-type(3)": "Canopy mapping e segmentazione basata su orthophoto",
            "#technologies .matrix-card:nth-of-type(4) h3": "Modelli e metodi",
            "#technologies .matrix-card:nth-of-type(4) .stack-list li:nth-of-type(1)": "Weak supervision e feature retrieval",
            "#technologies .matrix-card:nth-of-type(4) .stack-list li:nth-of-type(2)": "DenseCRF e segmentazione topology-aware",
            "#technologies .matrix-card:nth-of-type(4) .stack-list li:nth-of-type(3)": "Feature attribution, diagnostica dell'attenzione, analisi di layer e canali",
            "#technologies .matrix-card:nth-of-type(5) h3": "Infrastruttura e delivery",
            "#technologies .matrix-card:nth-of-type(5) .stack-list li:nth-of-type(2)": "Inferenza distribuita e pipeline multi-stage",
            "#technologies .matrix-card:nth-of-type(5) .stack-list li:nth-of-type(4)": "Analisi di performance ed energia per il calcolo scientifico",
            "#publications .section-eyebrow": "Ricerca",
            "#publications .section-title": "La mia direzione di ricerca attuale e centrata su modelli di remote sensing di cui ci si possa fidare.",
            "#publications .section-copy": "Il filo conduttore non e solo la performance predittiva. E costruire modelli EO e workflow scientifici che restino interpretabili, verificabili e computazionalmente realistici.",
            "#publications .card-eyebrow": "Direzione attuale del PhD",
            "#publications h3": "Foundation model, explainability e segmentazione per Earth observation",
            "#publications .publication-copy p:last-child": "Mi sto concentrando su backbone visuali per EO, weak-to-strong supervision, segmentazione decoder-based e workflow di explainability che aiutino a validare cio che i modelli stanno davvero usando.",
            "#publications .publication-notes p:nth-of-type(1)": "<strong>Remote sensing</strong> immagini UAV, dati VHR, struttura della canopy, orthophoto",
            "#publications .publication-notes p:nth-of-type(2)": "<strong>Explainability</strong> feature attribution, diagnostica dell'attenzione, analisi dei layer",
            "#publications .publication-notes p:nth-of-type(3)": "<strong>Sistemi</strong> pipeline riproducibili, inferenza distribuita, elaborazione HPC-aware",
            "#contact .section-eyebrow": "Contatti",
            "#contact .section-title": "Se il lavoro ti sembra rilevante, contattarmi e semplice.",
            "#contact .section-copy": "L'email e il canale migliore per ruoli e collaborazioni. LinkedIn e GitHub servono per avere contesto piu velocemente.",
            "#contact .contact-row:nth-of-type(1) .contact-row__label": "Email"
        }
    },
    de: {
        pageTitle: "Davide Mattioli | ML Engineer, Data Engineer und Doktorand",
        languageLabel: "🌍",
        languageAriaLabel: "Sprache",
        languages: {
            en: "🇬🇧",
            it: "🇮🇹",
            de: "🇩🇪"
        },
        nav: {
            about: "Profil",
            projects: "Projekte",
            funProjects: "Fun-Projekte",
            experience: "Erfahrung",
            technologies: "Kompetenzen",
            publications: "Forschung",
            contact: "Kontakt"
        },
        themeLabels: {
            dark: "Zum dunklen Design wechseln",
            light: "Zum hellen Design wechseln"
        },
        copy: {
            "#profile .section-eyebrow": "Davide Mattioli · ML Engineer · Data Engineer · Doktorand",
            "#profile .hero-title": "ML- und Data-Engineering fur Remote Sensing.",
            "#profile .hero-lede": "Doktorand in AI/DL fur Remote Sensing an der Universitat Goettingen. Ich arbeite an Earth-Observation-Modellen, skalierbaren Datenpipelines und Scientific-ML-Systemen.",
            "#profile .hero-actions .btn-primary": "Ausgewahlte Projekte",
            "#profile .hero-actions .btn-secondary": "CV herunterladen",
            "#profile .hero-actions .text-link": "E-Mail",
            "#profile .hero-proof:nth-of-type(1) h2": "Geospatial AI und Remote Sensing",
            "#profile .hero-proof:nth-of-type(1) p": "UAV- und VHR-Bilddaten, Canopy Mapping, Segmentierung und geospatiales ETL.",
            "#profile .hero-proof:nth-of-type(2) h2": "ML Engineering fur EO und CV",
            "#profile .hero-proof:nth-of-type(2) p": "Foundation Models, weak supervision, Segmentierung und Retrieval.",
            "#profile .hero-proof:nth-of-type(3) h2": "Data Engineering und HPC",
            "#profile .hero-proof:nth-of-type(3) p": "SLURM-Analytik, verteilte Inferenz und reproduzierbare Forschungspipelines.",
            "#profile .hero-context__label": "Aktueller Fokus",
            "#profile .hero-context__list li:nth-of-type(1)": "Promotionsforschung in AI/DL fur Remote Sensing an der Universitat Goettingen.",
            "#profile .hero-context__list li:nth-of-type(2)": "ML Engineering fur Earth-Observation-Modelle, Segmentierung und Explainability.",
            "#profile .hero-context__list li:nth-of-type(3)": "Data Engineering fur geospatiales ETL und wissenschaftliche Compute-Workflows.",
            "#about .section-eyebrow": "Forschungs- und Engineering-Fokus",
            "#about .section-title": "Meine Arbeit liegt an der Schnittstelle von Earth Observation, Modelldesign und wissenschaftlicher Infrastruktur.",
            "#about .section-copy": "Ich arbeite als ML Engineer und Data Engineer und vertiefe gleichzeitig meine Remote-Sensing-Forschung im Rahmen meiner Promotion.",
            "#about .capability-item:nth-of-type(1) h3": "Geospatial AI und Remote Sensing",
            "#about .capability-item:nth-of-type(1) p:last-child": "Analyse von UAV- und VHR-Bilddaten, Canopy Mapping, Segmentierung und geospatiales ETL.",
            "#about .capability-item:nth-of-type(2) h3": "ML Engineering fur EO und CV",
            "#about .capability-item:nth-of-type(2) p:last-child": "Foundation Models, Feature Extraction, weak supervision und Segmentierung fur Earth Observation.",
            "#about .capability-item:nth-of-type(3) h3": "Data Engineering und wissenschaftliche Validierung",
            "#about .capability-item:nth-of-type(3) p:last-child": "Skalierbares ETL, reproduzierbare Pipelines, SLURM-basierte Workflows und Modelldiagnostik.",
            "#projects .section-eyebrow": "Ausgewahlte Arbeiten",
            "#projects .section-title": "Projekte, die zeigen, wie ich Remote-Sensing-Systeme baue.",
            "#projects .section-copy": "Ein zentrales Fallbeispiel, dazu zwei unterstutzende Projekte zu reproduzierbaren UAV-Workflows und EO-Open-Source-Engineering.",
            "#projects .case-study .card-eyebrow": "Zentrales System",
            "#projects .case-study h3": "SegEdge",
            "#projects .case-study__lede": "Entwickelt, um von Orthophoto-Kacheln zu wiederholbaren Segmentierungslaufen zu kommen.",
            "#projects .pipeline-step:nth-of-type(1) .pipeline-step__eyebrow": "Input",
            "#projects .pipeline-step:nth-of-type(1) strong": "Orthophotos",
            "#projects .pipeline-step:nth-of-type(2) .pipeline-step__eyebrow": "Modell-Stack",
            "#projects .pipeline-step:nth-of-type(2) strong": "DINOv3 + SAM 2",
            "#projects .pipeline-step:nth-of-type(3) .pipeline-step__eyebrow": "Ausfuhrung",
            "#projects .pipeline-step:nth-of-type(3) strong": "SLURM-fahige Laufe",
            "#projects .case-study__visual-note": "Package-orientierter Code, Experiment-Runner und Wrapper fur Batch-Inferenz.",
            "#projects .case-study .project-summary": "Ein Remote-Sensing-Segmentierungssystem fur Baumkronenabgrenzung und landwirtschaftliche Feldextraktion, so organisiert, dass Experimente und operative Laufe dieselbe Basis nutzen.",
            "#projects .case-study .project-meta span:nth-of-type(1)": "Rolle: Repository-Design, Experiment-Runner, wiederverwendbare Wrapper",
            "#projects .case-study .project-meta span:nth-of-type(2)": "Warum es zahlt: macht aus Forschungssegmentierung wiederholbare Batch-Inferenz",
            "#projects .case-study .project-tags li:nth-of-type(1)": "Baumkronen",
            "#projects .case-study .project-tags li:nth-of-type(2)": "Landwirtschaftliche Flachen",
            "#projects .case-study .project-tags li:nth-of-type(3)": "HPC-Inferenz",
            "#projects .case-study .project-actions a": "Repository ansehen",
            "#projects .case-study .project-note": "Bestes Beispiel dafur, wie Forschungs-Code zu einem operativen Workflow wird.",
            "#projects .project-card--supporting:nth-of-type(2) .card-eyebrow": "Forschungs-Workflow",
            "#projects .project-card--supporting:nth-of-type(2) h3": "Multiangulare UAV-Reflectance-Extraktion",
            "#projects .project-card--supporting:nth-of-type(2) .project-summary": "Ein reproduzierbarer Workflow zur Extraktion multiangularer UAV-Reflectance-Daten aus Orthophotos, Kamerageometrie und Feldproben, ohne die Analyse jedes Mal neu aufzubauen.",
            "#projects .project-card--supporting:nth-of-type(2) .project-meta span:nth-of-type(1)": "Rolle: Pipeline fur Forschungsreuse und wiederholbare Outputs strukturiert",
            "#projects .project-card--supporting:nth-of-type(2) .project-meta span:nth-of-type(2)": "Stack: Python, R, Metashape",
            "#projects .project-card--supporting:nth-of-type(2) .project-note": "Nutzlich, wenn ein Feld-Workflow mehr als einen einzelnen Versuch uberstehen muss.",
            "#projects .project-card--supporting:nth-of-type(2) .project-actions a": "Repository offnen",
            "#projects .project-card--supporting:nth-of-type(3) .card-eyebrow": "Open-Source-Beitrag",
            "#projects .project-card--supporting:nth-of-type(3) h3": "Beitrag zu ESA OpenSR",
            "#projects .project-card--supporting:nth-of-type(3) .project-summary": "Beitragsarbeit an opensr-model, dem latent-diffusion-basierten Super-Resolution-Projekt fur RGB-NIR-Sentinel-2-Daten, mit package-orientiertem und HPC-aware Engineering.",
            "#projects .project-card--supporting:nth-of-type(3) .project-meta span:nth-of-type(1)": "Rolle: Beitrage zu Repository-Struktur und Ausfuhrungs-Workflow",
            "#projects .project-card--supporting:nth-of-type(3) .project-meta span:nth-of-type(2)": "Fokus: EO-Super-Resolution fur Sentinel-2",
            "#projects .project-card--supporting:nth-of-type(3) .project-note": "Zeigt, wie ich in einer bestehenden Open-Source-Forschungs-Codebase arbeite.",
            "#projects .project-card--supporting:nth-of-type(3) .project-actions a": "Repository offnen",
            "#experience .section-intro .section-eyebrow": "Erfahrung",
            "#experience .section-title": "Aktuelle Rollen zwischen Promotionsforschung, Engineering und wissenschaftlicher Infrastruktur.",
            "#experience .section-copy": "Ich teile meine Zeit zwischen Remote-Sensing-Forschung, ML Engineering und Data Engineering fur wissenschaftliche Workflows.",
            "#experience .role-entry:nth-of-type(1) .role-meta span:nth-of-type(1)": "Aktuell",
            "#experience .role-entry:nth-of-type(1) h3": "Doktorand, AI/DL fur Remote Sensing",
            "#experience .role-entry:nth-of-type(1) p": "Ich erforsche Earth-Observation-Modelle und Scientific-ML-Workflows fur Remote Sensing, mit Fokus auf Reprasentationsqualitat, Explainability und skalierbare Inferenz.",
            "#experience .role-entry:nth-of-type(1) .role-points li:nth-of-type(1)": "Arbeit an Geospatial AI fur Analyse und Segmentierung von UAV- und VHR-Bilddaten.",
            "#experience .role-entry:nth-of-type(1) .role-points li:nth-of-type(2)": "Untersuchung von DINO-artigen Backbones, decoder-basierter Segmentierung und weak-to-strong supervision.",
            "#experience .role-entry:nth-of-type(1) .role-points li:nth-of-type(3)": "Analyse von Explainability-Signalen zur Validierung des Modellverhaltens im Umweltmonitoring.",
            "#experience .role-entry:nth-of-type(2) .role-meta span:nth-of-type(1)": "2025 - Aktuell",
            "#experience .role-entry:nth-of-type(2) h3": "Data Engineer",
            "#experience .role-entry:nth-of-type(2) p": "Ich baue HPC-Workflows, die Infrastrukturmetriken, Energieverbrauch und Preisdaten fur klarere operative KPIs verbinden.",
            "#experience .role-entry:nth-of-type(2) .role-points li:nth-of-type(1)": "Entwicklung von Energieeffizienzmetriken fur das Monitoring von SLURM-Workloads.",
            "#experience .role-entry:nth-of-type(2) .role-points li:nth-of-type(2)": "Integration von Energiepreis-APIs in HPC-Analysen fur Echtzeit-Kostentransparenz.",
            "#experience .role-entry:nth-of-type(2) .role-points li:nth-of-type(3)": "Arbeit an performance-aware Processing fur wissenschaftliche Compute-Umgebungen.",
            "#experience .role-entry:nth-of-type(3) .role-meta span:nth-of-type(1)": "2025 - Aktuell",
            "#experience .role-entry:nth-of-type(3) h3": "Research Assistant",
            "#experience .role-entry:nth-of-type(3) p": "Ich pflege und verbessere Open-Source-ETL-Workflows fur UAV-Bilddaten in Remote-Sensing-Forschung und Publikationen.",
            "#experience .role-entry:nth-of-type(3) .role-points li:nth-of-type(1)": "Pflege von ETL-Tooling fur UAV-Verarbeitung und nachgelagerte Analysen.",
            "#experience .role-entry:nth-of-type(3) .role-points li:nth-of-type(2)": "Neugestaltung der Extraktions-Workflows mit 30× hoherem Durchsatz.",
            "#experience .role-entry:nth-of-type(3) .role-points li:nth-of-type(3)": "Leitung von Analyse und Literatursynthese fur ein laufendes Manuskript.",
            "#experience .experience-sidebar .sidebar-block:nth-of-type(1) .section-eyebrow": "Ausbildung",
            "#experience .credential-list li:nth-of-type(1) strong": "Doktorand, AI/DL fur Remote Sensing",
            "#experience .credential-list li:nth-of-type(2) strong": "MSc, Applied Data Science",
            "#experience .credential-list li:nth-of-type(3) strong": "BSc, Economics and Data Science",
            "#experience .experience-sidebar .sidebar-block:nth-of-type(2) .section-eyebrow": "Fruhere Forschungsarbeit",
            "#experience .sidebar-note h3": "Freiwilliger Forscher",
            "#experience .sidebar-note p": "Machine Learning Journal Club, Turin · 2021 - 2023",
            "#experience .sidebar-note .role-points li:nth-of-type(1)": "Aufbereitung von EEG-Datensatzen und Anwendung von Noise-Reduction-Modellen.",
            "#experience .sidebar-note .role-points li:nth-of-type(2)": "Python-Workshops fur Biologiestudierende zum wissenschaftlichen Rechnen.",
            "#technologies .section-eyebrow": "Kompetenzen",
            "#technologies .section-title": "Der Stack ist breit, weil die Arbeit Modelle, geospatiale Daten und Infrastruktur verbindet.",
            "#technologies .section-copy": "Das sind die Werkzeuge und Methoden, die ich heute in Forschung und Engineering am haufigsten nutze.",
            "#technologies .matrix-card:nth-of-type(1) h3": "Programmierung",
            "#technologies .matrix-card:nth-of-type(1) .stack-list li:nth-of-type(3)": "Konfigurationsgetriebene Workflows und reproduzierbares Scripting",
            "#technologies .matrix-card:nth-of-type(2) h3": "ML und AI",
            "#technologies .matrix-card:nth-of-type(3) h3": "Remote Sensing und Geospatial",
            "#technologies .matrix-card:nth-of-type(3) .stack-list li:nth-of-type(2)": "Orthophoto-Verarbeitung und Vektor/Raster-Workflows",
            "#technologies .matrix-card:nth-of-type(3) .stack-list li:nth-of-type(3)": "Canopy Mapping und orthophoto-basierte Segmentierung",
            "#technologies .matrix-card:nth-of-type(4) h3": "Modelle und Methoden",
            "#technologies .matrix-card:nth-of-type(4) .stack-list li:nth-of-type(1)": "Weak supervision und Feature Retrieval",
            "#technologies .matrix-card:nth-of-type(4) .stack-list li:nth-of-type(2)": "DenseCRF und topology-aware Segmentierung",
            "#technologies .matrix-card:nth-of-type(4) .stack-list li:nth-of-type(3)": "Feature Attribution, Attention-Diagnostik, Layer- und Kanalanalyse",
            "#technologies .matrix-card:nth-of-type(5) h3": "Infrastruktur und Delivery",
            "#technologies .matrix-card:nth-of-type(5) .stack-list li:nth-of-type(2)": "Verteilte Inferenz und mehrstufige Pipelines",
            "#technologies .matrix-card:nth-of-type(5) .stack-list li:nth-of-type(4)": "Performance- und Energieanalytik fur wissenschaftliches Rechnen",
            "#publications .section-eyebrow": "Forschung",
            "#publications .section-title": "Meine aktuelle Forschungsrichtung konzentriert sich auf Remote-Sensing-Modelle, denen man vertrauen kann.",
            "#publications .section-copy": "Der rote Faden ist nicht nur bessere Vorhersageleistung. Es geht darum, EO-Modelle und wissenschaftliche Workflows aufzubauen, die interpretierbar, testbar und rechnerisch realistisch bleiben.",
            "#publications .card-eyebrow": "Aktuelle PhD-Richtung",
            "#publications h3": "Foundation Models, Explainability und Segmentierung fur Earth Observation",
            "#publications .publication-copy p:last-child": "Aktuell konzentriere ich mich auf visuelle Backbones fur EO, weak-to-strong supervision, decoder-basierte Segmentierung und Explainability-Workflows, die sichtbar machen, worauf sich Modelle wirklich stutzen.",
            "#publications .publication-notes p:nth-of-type(1)": "<strong>Remote Sensing</strong> UAV-Bilddaten, VHR-Daten, Canopy-Struktur, Orthophotos",
            "#publications .publication-notes p:nth-of-type(2)": "<strong>Explainability</strong> Feature Attribution, Attention-Diagnostik, Layer-Analyse",
            "#publications .publication-notes p:nth-of-type(3)": "<strong>Systeme</strong> reproduzierbare Pipelines, verteilte Inferenz, HPC-aware Processing",
            "#contact .section-eyebrow": "Kontakt",
            "#contact .section-title": "Wenn die Arbeit relevant wirkt, bin ich leicht erreichbar.",
            "#contact .section-copy": "Fur Rollen und Zusammenarbeit ist E-Mail am besten. LinkedIn und GitHub liefern schnellen Kontext.",
            "#contact .contact-row:nth-of-type(1) .contact-row__label": "E-Mail"
        }
    }
};

const funProjects = [
    {
        key: "roleplay",
        href: "./Rp!/landing.html",
        labels: {
            en: "Roleplay Wikis",
            it: "Roleplay Wikis",
            de: "Roleplay Wikis"
        }
    },
    {
        key: "compNeur",
        href: "./CompNeur/Comp_landing.html",
        labels: {
            en: "CompNeur",
            it: "CompNeur",
            de: "CompNeur"
        }
    },
    {
        key: "finance",
        href: "./finance/finance.html",
        labels: {
            en: "Finance",
            it: "Finance",
            de: "Finance"
        }
    },
    {
        key: "indovinaIlComune",
        href: "./indovina-il-comune-il-gioco/",
        labels: {
            en: "Indovina il comune!",
            it: "Indovina il comune!",
            de: "Indovina il comune!"
        }
    }
];

const navOrder = ["about", "experience", "projects", "technologies", "publications", "contact"];

let currentLanguage = "en";

document.addEventListener("DOMContentLoaded", async () => {
    applyStoredTheme();
    applyStoredLanguage();
    await loadSections();
    rebuildNavFromDom();
    bindHamburger();
    bindThemeToggle();
    bindLanguageSelectors();
    applyTranslations(currentLanguage);
    setActiveLinkOnScroll();
    initScrollProgress();
});

async function loadSections() {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    const results = await Promise.allSettled(
        sectionFiles.map((name) =>
            fetch(`sections/${name}.html`).then((response) => {
                if (!response.ok) throw new Error(`${name}: ${response.status}`);
                return response.text();
            })
        )
    );

    mainContent.innerHTML = results
        .map((result, index) => {
            if (result.status === "fulfilled") return result.value;
            console.warn("[Sections] Failed to load", sectionFiles[index], result.reason);
            return "";
        })
        .join("");
}

function rebuildNavFromDom() {
    const presentItems = navOrder.filter((id) => document.getElementById(id));

    renderNavList(document.querySelector("#desktop-nav .nav-links"), presentItems, {
        themeButtonId: "themeToggleButton",
        languageSelectId: "languageSelectDesktop",
        languageLabelId: "languageLabelDesktop"
    });
    renderNavList(
        document.querySelector("#hamburger-nav .menu-links ul") || document.querySelector("#hamburger-nav .menu-links"),
        presentItems,
        {
            themeButtonId: "themeToggleButtonMobile",
            languageSelectId: "languageSelectMobile",
            languageLabelId: "languageLabelMobile"
        }
    );
    renderNavList(document.getElementById("footer-nav-links"), presentItems, null);
}

function renderNavList(container, items, controls) {
    if (!container) return;

    const ul = container.tagName.toLowerCase() === "ul" ? container : document.createElement("ul");
    ul.innerHTML = "";
    const isMobileMenu = Boolean(controls?.themeButtonId?.includes("Mobile"));

    if (controls) {
        const themeLi = document.createElement("li");
        themeLi.className = "nav-theme";
        themeLi.innerHTML = `<button id="${controls.themeButtonId}" type="button" aria-label="Toggle theme">◐</button>`;
        ul.appendChild(themeLi);

        const languageLi = document.createElement("li");
        languageLi.className = "nav-language";
        languageLi.innerHTML = `
            <label class="language-picker" for="${controls.languageSelectId}">
                <span id="${controls.languageLabelId}" class="language-picker__label"></span>
                <select id="${controls.languageSelectId}" class="language-picker__select" aria-label="Language"></select>
            </label>
        `;
        ul.appendChild(languageLi);
    }

    items.forEach((id) => {
        const li = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#${id}`;
        link.dataset.nav = id;
        li.appendChild(link);
        ul.appendChild(li);
    });

    if (controls) {
        ul.appendChild(createFunProjectsNavItem(isMobileMenu));
    }

    if (container !== ul) {
        container.innerHTML = "";
        container.appendChild(ul);
    }
}

function createFunProjectsNavItem(isMobileMenu) {
    const li = document.createElement("li");
    li.className = isMobileMenu ? "nav-fun-projects nav-fun-projects--mobile" : "nav-fun-projects";

    const linksMarkup = funProjects
        .map(
            (project) =>
                `<a class="nav-dropdown__link" data-fun-project-link="${project.key}" href="${project.href}"></a>`
        )
        .join("");

    li.innerHTML = `
        <details class="nav-dropdown${isMobileMenu ? " nav-dropdown--mobile" : ""}">
            <summary class="nav-dropdown__toggle" data-fun-projects-label></summary>
            <div class="nav-dropdown__menu">
                ${linksMarkup}
            </div>
        </details>
    `;

    return li;
}

function applyStoredTheme() {
    const savedTheme = localStorage.getItem("theme");
    document.body.classList.toggle("dark-theme", savedTheme === "dark");
}

function applyStoredLanguage() {
    const queryLanguage = new URLSearchParams(window.location.search).get("lang");
    if (translations[queryLanguage]) {
        currentLanguage = queryLanguage;
        localStorage.setItem("language", queryLanguage);
        return;
    }

    const savedLanguage = localStorage.getItem("language");
    currentLanguage = translations[savedLanguage] ? savedLanguage : "en";
}

function bindThemeToggle() {
    const buttons = Array.from(document.querySelectorAll("#themeToggleButton, #themeToggleButtonMobile"));
    if (!buttons.length) return;

    const syncThemeButtons = () => {
        const isDark = document.body.classList.contains("dark-theme");
        const themeText = translations[currentLanguage].themeLabels[isDark ? "light" : "dark"];

        buttons.forEach((button) => {
            button.textContent = "◐";
            button.setAttribute("aria-label", themeText);
            button.dataset.theme = isDark ? "dark" : "light";
        });
    };

    syncThemeButtons();

    buttons.forEach((button) => {
        button.onclick = () => {
            const nextIsDark = !document.body.classList.contains("dark-theme");
            document.body.classList.toggle("dark-theme", nextIsDark);
            localStorage.setItem("theme", nextIsDark ? "dark" : "light");
            syncThemeButtons();
        };
    });
}

function bindLanguageSelectors() {
    const selectors = Array.from(document.querySelectorAll(".language-picker__select"));
    if (!selectors.length) return;

    const buildOptions = (select) => {
        select.innerHTML = "";
        Object.entries(translations[currentLanguage].languages).forEach(([code, label]) => {
            const option = document.createElement("option");
            option.value = code;
            option.textContent = label;
            option.selected = code === currentLanguage;
            select.appendChild(option);
        });
    };

    selectors.forEach((select) => {
        buildOptions(select);
        select.addEventListener("change", (event) => {
            setLanguage(event.target.value);
        });
    });

    syncLanguageSelectors();
}

function syncLanguageSelectors() {
    document.querySelectorAll(".language-picker__select").forEach((select) => {
        const currentOptions = Array.from(select.options);
        currentOptions.forEach((option) => {
            option.textContent = translations[currentLanguage].languages[option.value];
        });
        select.value = currentLanguage;
        select.setAttribute("aria-label", translations[currentLanguage].languageAriaLabel);
    });

    document.querySelectorAll(".language-picker__label").forEach((label) => {
        label.textContent = translations[currentLanguage].languageLabel;
    });
}

function setLanguage(language) {
    if (!translations[language]) return;
    currentLanguage = language;
    localStorage.setItem("language", language);
    applyTranslations(language);
    bindThemeToggle();
    syncLanguageSelectors();
}

function applyTranslations(language) {
    const translation = translations[language];
    if (!translation) return;

    document.documentElement.lang = language;
    document.title = translation.pageTitle;

    Object.entries(translation.copy).forEach(([selector, text]) => {
        const element = document.querySelector(selector);
        if (!element) return;

        if (text.includes("<strong>")) {
            element.innerHTML = text;
        } else {
            element.textContent = text;
        }
    });

    document.querySelectorAll("[data-nav]").forEach((link) => {
        const id = link.dataset.nav;
        link.textContent = translation.nav[id];
    });

    document.querySelectorAll("[data-fun-projects-label]").forEach((label) => {
        label.textContent = translation.nav.funProjects;
    });

    document.querySelectorAll("[data-fun-project-link]").forEach((link) => {
        const project = funProjects.find((entry) => entry.key === link.dataset.funProjectLink);
        if (!project) return;
        link.textContent = project.labels[language] || project.labels.en;
    });
}

function bindHamburger() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    if (!menu || !icon) return;

    const closeMenu = () => {
        menu.classList.remove("open");
        icon.classList.remove("open");
        icon.setAttribute("aria-expanded", "false");
    };

    icon.onclick = () => {
        const shouldOpen = !menu.classList.contains("open");
        menu.classList.toggle("open", shouldOpen);
        icon.classList.toggle("open", shouldOpen);
        icon.setAttribute("aria-expanded", shouldOpen ? "true" : "false");
    };

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });
}

function setActiveLinkOnScroll() {
    const sections = navOrder.map((id) => document.getElementById(id)).filter(Boolean);
    if (!sections.length) return;

    const updateActive = (id) => {
        document.querySelectorAll("#desktop-nav a, #hamburger-nav a, footer a").forEach((link) => {
            const targetId = link.getAttribute("href")?.replace("#", "");
            link.classList.toggle("active", targetId === id);
        });
    };

    const observer = new IntersectionObserver(
        (entries) => {
            const visibleEntries = entries
                .filter((entry) => entry.isIntersecting)
                .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

            if (visibleEntries.length) {
                updateActive(visibleEntries[0].target.id);
            }
        },
        {
            rootMargin: "-18% 0px -62% 0px",
            threshold: [0.15, 0.35, 0.6]
        }
    );

    sections.forEach((section) => observer.observe(section));
    updateActive(sections[0].id);
}

function initScrollProgress() {
    const progressBar = document.getElementById("scroll-progress");
    if (!progressBar) return;

    const update = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const available = document.documentElement.scrollHeight - window.innerHeight;
        const progress = available > 0 ? (scrollTop / available) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
}
