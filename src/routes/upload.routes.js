import express from "express";
import multer from "multer";
import fs from "fs";
import { ingestText } from "../services/rag/ingest.service.js";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Read file
    const fileBuffer = fs.readFileSync(req.file.path);

    // Load PDF
    const loadingTask = pdfjsLib.getDocument({ data: fileBuffer });
    const pdf = await loadingTask.promise;

    let fullText = "";

    // Extract text page by page
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map(item => item.str).join(" ");
      fullText += pageText + "\n\n";
    }

    // Ingest extracted text
    await ingestText(fullText, sessionId);

    // Delete temp file
    fs.unlinkSync(req.file.path);

    res.json({ message: "File processed successfully" });

  } catch (error) {
    console.error("PDF Upload Error:", error);
    res.status(500).json({ error: "Failed to process PDF" });
  }
});

export default router;