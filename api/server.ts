import express from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json({ limit: '50mb' }));

const AgentRequestSchema = z.object({
  strokes: z.array(z.any()),
  notes: z.string().optional(),
  files: z.array(z.string()).optional(),
});

const ExportSchema = z.object({
  type: z.enum(['pdf', 'png', 'csv', 'json']),
  data: z.any(),
});

let documents: any[] = [];
let keys: any[] = [];

app.get('/health', (_req, res) => res.json({ status: 'ok', version: '1.0.0' }));

app.post('/api/agent/process', (req, res) => {
  const parse = AgentRequestSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error });

  const { strokes, notes } = parse.data;
  const charts = strokes.length > 0 ? [{ type: 'line', points: strokes.slice(0, 20) }] : [];
  const doc = {
    id: Date.now().toString(36),
    createdAt: new Date().toISOString(),
    charts,
    text: notes || 'Auto-generated document from canvas',
    files: parse.data.files || [],
  };
  documents.push(doc);
  res.json({ success: true, document: doc });
});

app.post('/api/export', (req, res) => {
  const parse = ExportSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error });

  const { type, data } = parse.data;
  const filename = `export-${Date.now()}.${type}`;
  res.json({ success: true, filename, url: `https://api.synthetic-solutions.dev/download/${filename}`, content: data });
});

app.get('/api/documents', (_req, res) => res.json({ documents }));
app.get('/api/keys', (_req, res) => res.json({ keys }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Synthetic Solutions Document Edition API running on port ${PORT}`));