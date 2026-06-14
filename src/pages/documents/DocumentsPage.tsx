import React, { useState, useRef, useMemo } from "react";
import { FileText, Upload, Eye, PenTool, Search, Trash2, Download } from "lucide-react";

const initialDocs = [
  { id: 1, name: "Startup Agreement.pdf", type: "PDF", size: "2.4 MB", status: "Draft", date: "2025-06-12" },
  { id: 2, name: "Investor Contract.docx", type: "DOCX", size: "1.2 MB", status: "In Review", date: "2025-06-10" },
];

export const DocumentsPage: React.FC = () => {
  const [docs, setDocs] = useState(initialDocs);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isSigning, setIsSigning] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredDocs = useMemo(() => {
    return docs
      .filter((doc) => 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === "All" || doc.status === filterStatus)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [docs, searchTerm, filterStatus]);

  // Upload Function
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await new Promise(r => setTimeout(r, 1000));

    const newDoc = {
      id: Date.now(),
      name: file.name,
      type: file.name.split('.').pop()?.toUpperCase() || "PDF",
      size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
      status: "Draft" as const,
      date: new Date().toISOString().split('T')[0],
    };

    setDocs([newDoc, ...docs]);
    alert(`✅ "${file.name}" uploaded successfully!`);

    setIsUploading(false);
    e.target.value = "";
  };

  // Button Click Handler
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Signature Pad
  const startDrawing = (e: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : e.touches[0].clientX - rect.left;
    const y = e.clientY ? e.clientY - rect.top : e.touches[0].clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const endDrawing = () => setIsDrawing(false);

  const clearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const signDocument = () => {
    if (!selectedDoc) return;
    const canvas = canvasRef.current;
    if (!canvas || canvas.toDataURL() === canvas.toDataURL("image/png", 0)) {
      alert("Please draw your signature first!");
      return;
    }

    setDocs(prev => prev.map(d => d.id === selectedDoc.id ? { ...d, status: "Signed" } : d));
    setIsSigning(true);
    setTimeout(() => {
      alert(`✅ ${selectedDoc.name} signed successfully!`);
      setIsSigning(false);
      clearSignature();
    }, 800);
  };

  const deleteDocument = (id: number) => {
    if (!confirm("Delete this document?")) return;
    setDocs(docs.filter(doc => doc.id !== id));
    if (selectedDoc?.id === id) setSelectedDoc(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">📄 Document Chamber</h1>
            <p className="text-gray-600 mt-1">Upload, Preview & E-Sign Contracts</p>
          </div>

          {/* Upload Button */}
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-medium transition-all active:scale-95 shadow-md"
          >
            {isUploading ? "Uploading..." : <><Upload size={20} /> Upload Document</>}
          </button>

          {/* Hidden Input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleUpload}
            accept=".pdf,.doc,.docx"
          />
        </div>

        {/* Search & Filter */}
        <div className="flex gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-6 py-4 border border-gray-300 rounded-2xl bg-white focus:outline-none focus:border-blue-500"
          >
            <option value="All">All Status</option>
            <option value="Draft">Draft</option>
            <option value="In Review">In Review</option>
            <option value="Signed">Signed</option>
          </select>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Documents List */}
          <div className="lg:col-span-7 bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-6">All Documents ({filteredDocs.length})</h2>
            <div className="space-y-4 max-h-[calc(100vh-380px)] overflow-y-auto pr-2">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all hover:shadow-md
                    ${selectedDoc?.id === doc.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                  onClick={() => setSelectedDoc(doc)}
                >
                  <div className="flex items-center gap-4">
                    <FileText className="text-blue-600" size={28} />
                    <div>
                      <p className="font-medium text-lg">{doc.name}</p>
                      <p className="text-sm text-gray-500">{doc.type} • {doc.size}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 text-sm font-medium rounded-full
                      ${doc.status === "Signed" ? "bg-green-100 text-green-700" : 
                        doc.status === "In Review" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                      {doc.status}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); alert(`Downloading ${doc.name}`); }}>
                      <Download size={20} />
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id); }} className="text-red-500 hover:text-red-700">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Preview & Signature */}
          <div className="lg:col-span-5 bg-white rounded-3xl shadow p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <Eye size={24} /> Preview & E-Signature
            </h2>

            {selectedDoc ? (
              <div className="space-y-6">
                <div className="bg-gray-100 p-5 rounded-2xl">
                  <p className="font-semibold text-xl">{selectedDoc.name}</p>
                  <p className="text-gray-500">{selectedDoc.type} • {selectedDoc.size}</p>
                </div>

                <div className="h-60 bg-gradient-to-br from-gray-900 to-black rounded-2xl flex items-center justify-center text-white/60">
                  <FileText size={80} className="opacity-40" />
                </div>

                <div>
                  <div className="flex justify-between mb-3">
                    <h3 className="font-medium">Draw Your Signature</h3>
                    <button onClick={clearSignature} className="text-blue-600 hover:underline text-sm">Clear</button>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl bg-white overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={520}
                      height={180}
                      className="cursor-crosshair w-full"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={endDrawing}
                      onMouseLeave={endDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={endDrawing}
                    />
                  </div>
                </div>

                <button
                  onClick={signDocument}
                  disabled={isSigning || selectedDoc.status === "Signed"}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-5 rounded-2xl font-semibold text-lg transition flex items-center justify-center gap-2"
                >
                  <PenTool size={22} />
                  {isSigning ? "Signing..." : selectedDoc.status === "Signed" ? "Already Signed" : "Sign Document"}
                </button>
              </div>
            ) : (
              <div className="h-96 flex items-center justify-center text-center text-gray-400">
                <div>
                  <FileText size={70} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg">Select a document to preview and sign</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};