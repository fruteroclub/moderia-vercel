"use client";

export default function RecallTestButton() {
  const handleClick = async () => {
    try {
      const res = await fetch("/api/recall");
      const data = await res.json();

      if (data.success) {
        console.log("✅ Recall flow success:", data.message);
      } else {
        console.error("❌ Recall API error:", data.error);
      }
    } catch (err) {
      console.error("❌ Fetch failed:", err);
    }
  };

  return (
    <button onClick={handleClick} className="dashboard-button">
      ▶️ Run Recall SDK Test (via API)
    </button>
  );
}


