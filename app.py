import os
import uuid
from flask import Flask, render_template, request, jsonify, redirect, url_for
from werkzeug.utils import secure_filename

from config import UPLOAD_FOLDER, MAX_CONTENT_LENGTH, ALLOWED_EXTENSIONS, SECRET_KEY
from services.parser import extract_text
from services.analyzer import analyze_resume

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = MAX_CONTENT_LENGTH
app.config['SECRET_KEY'] = SECRET_KEY


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze():
    # make sure we got a file
    if 'resume' not in request.files:
        return jsonify({"error": "No resume file uploaded."}), 400

    file = request.files['resume']
    job_description = request.form.get('job_description', '').strip()

    if file.filename == '':
        return jsonify({"error": "No file selected."}), 400

    if not job_description:
        return jsonify({"error": "Please paste a job description."}), 400

    if len(job_description) < 50:
        return jsonify({"error": "Job description is too short. Please paste the full job description."}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": "Invalid file format. Please upload a PDF or DOCX file."}), 400

    # save file to disk temporarily
    filename = secure_filename(file.filename)
    unique_name = f"{uuid.uuid4().hex}_{filename}"
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_name)

    try:
        file.save(file_path)

        resume_text = extract_text(file_path)

        if len(resume_text.strip()) < 50:
            return jsonify({"error": "Could not extract enough text from the resume. Please check your file."}), 400

        results = analyze_resume(resume_text, job_description)
        results['filename'] = filename

        return jsonify(results)

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)


@app.route('/results')
def results():
    return render_template('results.html')


if __name__ == '__main__':
    print("\n  CV Insight — Resume & ATS Checker")
    print("  Running at http://127.0.0.1:5000\n")
    app.run(debug=True, port=5000)
