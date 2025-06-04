const BASE_URL = import.meta.env.VITE_LANGGRAPH_URL;
const API_KEY = import.meta.env.VITE_LANGGRAPH_KEY;

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
      ...(options.headers || {})
    }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return res;
}

export async function createAssistant() {
  const res = await request('/assistants', {
    method: 'POST',
    body: JSON.stringify({ graph_id: 'react_agent' })
  });
  return res.json();
}

export async function createThread() {
  const res = await request('/threads', { method: 'POST', body: JSON.stringify({}) });
  return res.json();
}

// Send input to the agent and stream text output
export async function streamRun(threadId, assistantId, input, onToken) {
  const res = await request(`/threads/${threadId}/runs/stream`, {
    method: 'POST',
    body: JSON.stringify({ assistant_id: assistantId, input })
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let lines = buffer.split('\n');
    buffer = lines.pop();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith('data:')) continue;
      const data = trimmed.replace(/^data:\s*/, '');
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data);
        if (json.text) onToken(json.text);
      } catch (err) {
        console.error('Stream parse error', err, data);
      }
    }
  }
}

