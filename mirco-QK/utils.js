export async function fetchResource(url) {
  const res = await fetch(url);
  return await res.text();
}
