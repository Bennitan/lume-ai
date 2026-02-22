# Lume AI: Intelligent Log Analysis Engine

Lume is a high-utility DevOps tool designed to bridge the gap between raw system logs and actionable insights using Local LLMs.

## 🚀 Features
* **AI Diagnosis:** Leverages Llama 3 (via Ollama) to provide instant explanations and fixes for complex error logs.
* **Real-time Monitoring:** Includes a background file watcher that detects modifications to system log files automatically.
* **Structured Analytics:** Categorizes errors by severity (Low, Medium, High) and provides AI confidence scoring.
* **History Tracking:** Persistent SQLite storage to keep track of past analyses.

## 🛠️ Tech Stack
* **Frontend:** React (Vite), Lucide-React
* **Backend:** FastAPI (Python), Watchdog, SQLite
* **AI Engine:** Ollama (Llama 3)