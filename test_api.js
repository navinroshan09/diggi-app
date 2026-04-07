async function test() {
  try {
    const res = await fetch(`${import.meta.env.backend_api_url}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: 'Iran USA war' })
    });
    const data = await res.json();
    const fs = await import('fs/promises');
    await fs.writeFile('response.json', JSON.stringify(data, null, 2));
    console.log("Saved to response.json");
  } catch (e) {
    console.error("Error:", e);
  }
}
test();


