"use client";

export default function PDFDownloadButton({ filename, token }: { filename: string; token: string }) {
  const downloadPDF = async () => {
    try {
      const res = await fetch(`http://localhost:8001/download/${encodeURIComponent(filename)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Failed to download PDF");
    }
  };

  return (
    <button
      onClick={downloadPDF}
      className="mt-4 inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
    >
      📄 Download PDF Report
    </button>
  );
}