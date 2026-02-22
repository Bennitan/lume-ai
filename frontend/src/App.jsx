import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Terminal, Send, Cpu, Activity, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

function App() {
  const [log, setLog] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/history');
      setHistory(res.data);
    } catch (err) {
      console.error("History fetch failed");
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const res = await axios.post('http://127.0.0.1:8000/analyze', { log_text: log });
      setAnalysis(res.data);
      fetchHistory();
    } catch (err) {
      setAnalysis({ explanation: "Error connecting to Lume Backend.", severity: "high", confidence: 0 });
    }
    setLoading(false);
  };

  const getSeverityColor = (sev) => {
    if (sev === 'high') return '#ef4444';
    if (sev === 'medium') return '#f59e0b';
    return '#10b981';
  };

  return (
    <div style={{ 
      backgroundColor: '#0f172a', 
      color: 'white', 
      height: '100vh', 
      width: '100vw', 
      display: 'flex', 
      overflow: 'hidden', 
      margin: 0, 
      padding: 0,
      position: 'fixed', // Forces full screen coverage
      top: 0,
      left: 0
    }}>
      
      {/* Sidebar */}
      <aside style={{ 
        width: '320px', 
        backgroundColor: '#1e293b', 
        borderRight: '1px solid #334155', 
        padding: '25px', 
        display: 'flex', 
        flexDirection: 'column',
        flexShrink: 0 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
          <Clock size={22} color="#94a3b8" />
          <h2 style={{ fontSize: '1.2rem', margin: 0, color: '#f8fafc' }}>Past Fixes</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', overflowY: 'auto', pr: '5px' }}>
          {history.length > 0 ? history.map((item) => (
            <div key={item.id} style={{ 
              padding: '14px', 
              backgroundColor: '#0f172a', 
              borderRadius: '10px', 
              borderLeft: `4px solid ${getSeverityColor(item.severity)}`,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: getSeverityColor(item.severity), marginBottom: '5px' }}>
                {item.severity?.toUpperCase()}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {item.log}
              </div>
            </div>
          )) : (
            <div style={{ color: '#475569', fontSize: '0.9rem', fontStyle: 'italic' }}>No history yet...</div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        padding: '50px', 
        overflowY: 'auto' 
      }}>
        <header style={{ width: '100%', maxWidth: '900px', display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <Cpu size={36} color="#38bdf8" />
          <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: '0 15px', letterSpacing: '-1px' }}>
            LUME <span style={{ color: '#38bdf8' }}>AI</span>
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontSize: '0.85rem', fontWeight: '600', backgroundColor: 'rgba(74, 222, 128, 0.1)', padding: '5px 12px', borderRadius: '20px' }}>
            <Activity size={16} /> LIVE ENGINE
          </div>
        </header>

        <section style={{ width: '100%', maxWidth: '900px' }}>
          <div style={{ backgroundColor: '#1e293b', padding: '30px', borderRadius: '20px', border: '1px solid #334155', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <textarea 
              rows="8" 
              style={{ 
                width: '100%', 
                backgroundColor: '#0f172a', 
                border: '1px solid #334155', 
                color: '#f8fafc', 
                padding: '20px', 
                borderRadius: '12px', 
                marginBottom: '20px', 
                outline: 'none', 
                boxSizing: 'border-box',
                fontFamily: 'monospace',
                fontSize: '1rem'
              }}
              value={log}
              onChange={(e) => setLog(e.target.value)}
              placeholder="Paste raw log data or error traces here..."
            />
            <button 
              onClick={handleAnalyze}
              disabled={loading || !log}
              style={{ 
                backgroundColor: loading ? '#334155' : '#38bdf8', 
                color: '#0f172a', 
                border: 'none', 
                padding: '14px 28px', 
                borderRadius: '10px', 
                fontWeight: '800', 
                cursor: loading ? 'not-allowed' : 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                fontSize: '1rem'
              }}
            >
              <Send size={20} /> {loading ? "Analyzing with Llama 3..." : "Run AI Diagnosis"}
            </button>
          </div>

          {/* Analysis Result */}
          {analysis && (
            <div style={{ 
              marginTop: '30px', 
              padding: '35px', 
              backgroundColor: '#1e293b', 
              borderRadius: '20px', 
              borderLeft: `8px solid ${getSeverityColor(analysis.severity)}`,
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Terminal size={24} color={getSeverityColor(analysis.severity)} /> Analysis Result
                </h3>
                <span style={{ backgroundColor: getSeverityColor(analysis.severity), color: '#0f172a', padding: '6px 16px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '900' }}>
                  {analysis.confidence}% CONFIDENCE
                </span>
              </div>
              <p style={{ color: '#cbd5e1', lineHeight: '1.8', fontSize: '1.1rem', marginBottom: '25px' }}>{analysis.explanation}</p>
              <div style={{ 
                padding: '20px', 
                backgroundColor: '#0f172a', 
                borderRadius: '12px', 
                display: 'flex', 
                gap: '15px', 
                alignItems: 'flex-start', 
                color: '#38bdf8',
                border: '1px solid rgba(56, 189, 248, 0.2)'
              }}>
                <CheckCircle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ display: 'block', marginBottom: '5px', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>Recommended Fix:</strong>
                  <span style={{ fontSize: '1.1rem', color: '#f8fafc' }}>{analysis.fix}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;