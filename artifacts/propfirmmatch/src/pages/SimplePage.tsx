export default function SimplePage({ title, body }: { title: string; body: string }) {
  return (
    <main className="simple-page">
      <h1>{title}</h1>
      <p>{body}</p>
    </main>
  );
}
