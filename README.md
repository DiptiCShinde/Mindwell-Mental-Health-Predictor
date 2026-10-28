# Mindwell — Student Mental Health Score Predictor

Mindwell is a student project that estimates a mental health score from information about study, sleep, physical activity, stress, and social media use. It includes a web form and a Python API powered by a trained machine learning model.

🔗 **Live Demo:** [https://mindwell-mental-health-predictor-1.onrender.com/](https://mindwell-mental-health-predictor-1.onrender.com/)

> **Please note:** This project is for learning and self-reflection. Its score is a model estimate, not a diagnosis or a replacement for professional support.

## Features

- Collects lifestyle and social media information through a web form.
- Sends the information to a FastAPI server.
- Displays the score returned by the model.
- Includes a Jupyter notebook showing how the data and model were developed.

## Project files

| File | Description |
|---|---|
| `main.py` | Runs the FastAPI prediction service. |
| `Mental_Health_Model.pkl` | Trained model used by the service. |
| `index.html`, `style.css`, `script.js` | Frontend form, design, and API connection. |
| `Model_Building.ipynb` | Notebook for exploring the data and building the model. |
| `Student Social Media And Mental Health Impact.csv` | Dataset used in the notebook. |
| `requirements.txt` | Python packages needed to run the API. |

## Run locally

### 1. Open a terminal in the project folder

In VS Code, open the project folder and select **Terminal → New Terminal**.

### 2. Create and activate a Python environment

For Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

If PowerShell blocks activation, use Command Prompt:

```cmd
.venv\Scripts\activate.bat
```

### 3. Install the packages

```bash
pip install -r requirements.txt
```

### 4. Start the API

```bash
uvicorn main:app --reload
```

Keep the terminal open while using the website. The API runs at `http://127.0.0.1:8000`. Its interactive documentation is at `http://127.0.0.1:8000/docs`.

### 5. Open the website

In VS Code, open `index.html`, right-click inside the editor, and select **Open with Live Server**. The frontend is configured to connect to the API at `http://127.0.0.1:8000`.

If the API address changes, update `API_BASE_URL` near the top of `script.js`.

## Deploy the API with Render

Create a **Web Service** in Render and connect your GitHub repository. If the project files are in the repository root, use:

- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

Make sure Render’s **Root Directory** points to the folder containing `main.py`, `requirements.txt`, and `Mental_Health_Model.pkl`.

After deploying the API, update `API_BASE_URL` in `script.js` to your Render service URL before publishing the frontend.

## Model evaluation

The notebook trains a Linear Regression model using a 70/30 train-test split. Its saved evaluation reports a test R² of about **0.753** and a mean absolute error of about **0.513 score points**. These results describe performance on the notebook’s dataset split and do not guarantee an individual prediction’s accuracy.

## Limitations

The model reflects the data it was trained on and may not represent everyone’s circumstances. Its predictions should not be used to make clinical or treatment decisions. If you are concerned about your mental health, consider speaking with a qualified professional or someone you trust.

