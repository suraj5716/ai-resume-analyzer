// CV Insight — frontend logic

document.addEventListener('DOMContentLoaded', () => {
    initUploadPage();
});

function initUploadPage() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('resume-input');
    const form = document.getElementById('analyze-form');
    const textarea = document.getElementById('job-description');
    const charCount = document.getElementById('char-count');

    if (!dropZone) return; // Not on upload page

    // Drag & Drop
    dropZone.addEventListener('click', () => fileInput.click());

    ['dragenter', 'dragover'].forEach(e => {
        dropZone.addEventListener(e, (ev) => { ev.preventDefault(); dropZone.classList.add('dragover'); });
    });
    ['dragleave', 'drop'].forEach(e => {
        dropZone.addEventListener(e, (ev) => { ev.preventDefault(); dropZone.classList.remove('dragover'); });
    });

    dropZone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) handleFile(files[0]);
    });

    fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) handleFile(fileInput.files[0]);
    });

    // Remove file
    const removeBtn = document.getElementById('file-remove');
    if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            fileInput.value = '';
            document.getElementById('file-preview').style.display = 'none';
            document.querySelector('.drop-zone-content').style.display = 'block';
        });
    }

    // Character count
    if (textarea && charCount) {
        textarea.addEventListener('input', () => { charCount.textContent = textarea.value.length; });
    }

    // Form submit
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await submitAnalysis();
        });
    }
}

function handleFile(file) {
    const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
        showError('Please upload a PDF or DOCX file.');
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        showError('File size exceeds 5MB limit.');
        return;
    }

    // Transfer to input
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    document.getElementById('resume-input').files = dataTransfer.files;

    // Show preview
    document.querySelector('.drop-zone-content').style.display = 'none';
    const preview = document.getElementById('file-preview');
    preview.style.display = 'block';
    document.getElementById('file-name').textContent = file.name;
    document.getElementById('file-size').textContent = formatSize(file.size);
    hideError();
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

async function submitAnalysis() {
    const fileInput = document.getElementById('resume-input');
    const jd = document.getElementById('job-description').value.trim();
    const btn = document.getElementById('btn-analyze');

    if (!fileInput.files.length) { showError('Please upload your resume.'); return; }
    if (!jd) { showError('Please paste the job description.'); return; }
    if (jd.length < 50) { showError('Job description is too short. Paste the full description.'); return; }

    // Loading state
    btn.disabled = true;
    btn.querySelector('.btn-text').style.display = 'none';
    btn.querySelector('.btn-loading').style.display = 'flex';
    hideError();

    const formData = new FormData();
    formData.append('resume', fileInput.files[0]);
    formData.append('job_description', jd);

    try {
        const res = await fetch('/analyze', { method: 'POST', body: formData });
        const data = await res.json();

        if (!res.ok || data.error) {
            showError(data.error || 'Analysis failed.');
            return;
        }

        // Store results and navigate
        sessionStorage.setItem('analysisResults', JSON.stringify(data));
        window.location.href = '/results';
    } catch (err) {
        showError('Network error. Please try again.');
    } finally {
        btn.disabled = false;
        btn.querySelector('.btn-text').style.display = 'flex';
        btn.querySelector('.btn-loading').style.display = 'none';
    }
}

function showError(msg) {
    const el = document.getElementById('error-message');
    const text = document.getElementById('error-text');
    if (el && text) { text.textContent = msg; el.style.display = 'flex'; }
}
function hideError() {
    const el = document.getElementById('error-message');
    if (el) el.style.display = 'none';
}

// results page renderer

function renderResults(data) {
    // Filename
    const fnEl = document.getElementById('results-filename');
    if (fnEl) fnEl.textContent = data.filename || '';

    // Score Gauge
    animateGauge(data.overall_score, data.score_color);
    const verdict = document.getElementById('score-verdict');
    if (verdict) { verdict.textContent = data.score_label; verdict.style.color = data.score_color; }

    // Dimension Scores
    renderDimensions(data.dimension_scores);

    // Keyword Analysis
    renderKeywords(data.keyword_analysis);

    // Skills
    renderSkills(data.skills_analysis);

    // Formatting
    renderFormatting(data.formatting_analysis);

    // Impact
    renderImpact(data.impact_analysis);

    // Suggestions
    renderSuggestions(data.suggestions);
}

function animateGauge(score, color) {
    const fill = document.getElementById('gauge-fill');
    const scoreEl = document.getElementById('gauge-score');
    if (!fill || !scoreEl) return;

    const circumference = 2 * Math.PI * 85; // r=85
    const offset = circumference - (score / 100) * circumference;

    setTimeout(() => {
        fill.style.strokeDashoffset = offset;
        fill.style.stroke = color;
    }, 300);

    // Animate number
    let current = 0;
    const duration = 1500;
    const step = score / (duration / 16);
    const timer = setInterval(() => {
        current += step;
        if (current >= score) { current = score; clearInterval(timer); }
        scoreEl.textContent = Math.round(current);
    }, 16);

    scoreEl.style.color = color;
}

function renderDimensions(dims) {
    const grid = document.getElementById('dimension-grid');
    if (!grid) return;
    grid.innerHTML = '';

    for (const [key, dim] of Object.entries(dims)) {
        const color = dim.score >= 70 ? 'var(--success)' : dim.score >= 40 ? 'var(--warning)' : 'var(--danger)';
        const card = document.createElement('div');
        card.className = 'dimension-card';
        card.innerHTML = `
            <span class="dim-icon">${dim.icon}</span>
            <div class="dim-info">
                <div class="dim-label">${dim.label} <span class="dim-weight">(${dim.weight})</span></div>
                <div class="dim-score" style="color:${color}">${dim.score}/100</div>
                <div class="dim-bar"><div class="dim-bar-fill" style="background:${color}"></div></div>
            </div>`;
        grid.appendChild(card);

        // Animate bar
        setTimeout(() => {
            card.querySelector('.dim-bar-fill').style.width = dim.score + '%';
        }, 500);
    }
}

function renderKeywords(kw) {
    const stats = document.getElementById('keyword-stats');
    if (stats) stats.textContent = `${kw.total_matched}/${kw.total_jd_keywords} matched`;

    const matched = document.getElementById('matched-keywords');
    const missing = document.getElementById('missing-keywords');
    if (matched) matched.innerHTML = kw.matched_keywords.map(k => `<span class="pill pill-matched">${k}</span>`).join('');
    if (missing) missing.innerHTML = kw.missing_keywords.map(k => `<span class="pill pill-missing">${k}</span>`).join('');

    if (matched && !kw.matched_keywords.length) matched.innerHTML = '<span style="color:var(--text-muted);font-size:13px;">No matched keywords</span>';
    if (missing && !kw.missing_keywords.length) missing.innerHTML = '<span style="color:var(--text-muted);font-size:13px;">All keywords matched! 🎉</span>';
}

function renderSkills(sk) {
    const mc = document.getElementById('matched-skills-count');
    const msc = document.getElementById('missing-skills-count');
    const esc = document.getElementById('extra-skills-count');
    if (mc) mc.textContent = sk.matched_skills.length;
    if (msc) msc.textContent = sk.missing_skills.length;
    if (esc) esc.textContent = sk.extra_skills.length;

    const stats = document.getElementById('skills-stats');
    if (stats) stats.textContent = `${sk.total_resume_skills} in resume, ${sk.total_jd_skills} in JD`;

    const matched = document.getElementById('matched-skills');
    const missing = document.getElementById('missing-skills');
    const extra = document.getElementById('extra-skills');
    if (matched) matched.innerHTML = sk.matched_skills.map(s => `<span class="pill pill-matched">${s}</span>`).join('') || '<span style="color:var(--text-muted);font-size:13px;">None</span>';
    if (missing) missing.innerHTML = sk.missing_skills.map(s => `<span class="pill pill-missing">${s}</span>`).join('') || '<span style="color:var(--text-muted);font-size:13px;">None — great job!</span>';
    if (extra) extra.innerHTML = sk.extra_skills.map(s => `<span class="pill pill-extra">${s}</span>`).join('') || '<span style="color:var(--text-muted);font-size:13px;">None</span>';
}

function renderFormatting(fmt) {
    const list = document.getElementById('formatting-checks');
    if (!list) return;
    list.innerHTML = '';
    fmt.checks.forEach(c => {
        const item = document.createElement('div');
        item.className = 'check-item';
        item.innerHTML = `
            <span class="check-status">${c.passed ? '✅' : '❌'}</span>
            <div>
                <div class="check-name">${c.icon} ${c.name}</div>
                <div class="check-detail">${c.detail}</div>
            </div>`;
        list.appendChild(item);
    });
}

function renderImpact(imp) {
    const stats = document.getElementById('impact-stats');
    if (stats) {
        stats.innerHTML = `
            <div class="impact-stat"><div class="impact-stat-value">${imp.action_verbs_count}</div><div class="impact-stat-label">Action Verbs</div></div>
            <div class="impact-stat"><div class="impact-stat-value">${imp.quantified_achievements}</div><div class="impact-stat-label">Metrics Found</div></div>`;
    }
    const verbs = document.getElementById('impact-verbs');
    if (verbs && imp.action_verbs_found.length) {
        verbs.innerHTML = '<h3>Action Verbs Used</h3><div class="keyword-pills">' +
            imp.action_verbs_found.map(v => `<span class="pill pill-matched">${v}</span>`).join('') + '</div>';
    }
}

function renderSuggestions(suggestions) {
    const list = document.getElementById('suggestions-list');
    if (!list) return;
    list.innerHTML = '';
    if (!suggestions.length) {
        list.innerHTML = '<p style="color:var(--success);text-align:center;padding:24px;">Your resume looks great! No major suggestions. 🎉</p>';
        return;
    }
    suggestions.forEach(s => {
        const item = document.createElement('div');
        item.className = `suggestion-item suggestion-${s.priority}`;
        item.innerHTML = `
            <div class="suggestion-header">
                <span class="suggestion-priority priority-${s.priority}">${s.priority}</span>
                <span class="suggestion-title">${s.icon} ${s.title}</span>
            </div>
            <div class="suggestion-detail">${s.detail}</div>`;
        list.appendChild(item);
    });
}
