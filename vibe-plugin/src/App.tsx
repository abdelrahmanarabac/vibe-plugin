// src/App.tsx
import "./style.css";

function App() {
    const handleClick = () => {
        // ابعت رسالة لفيجما قولها "اشتغلي"
        parent.postMessage({ pluginMessage: { type: 'CREATE_TOKENS' } }, '*');
    };

    return (
        <div style={{ padding: 20, fontFamily: "sans-serif" }}>
            <h2>🎨 Vibe Tokens</h2>
            <p>اضغط لتحويل أفكارك لمتغيرات</p>
            <button
                onClick={handleClick}
                style={{
                    background: "#2563EB",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    width: "100%"
                }}
            >
                Generate Magic 🪄
            </button>
        </div>
    );
}

export default App;
