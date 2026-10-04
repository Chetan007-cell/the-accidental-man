"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main id="main" className="page-wrap">
      <p className="eyebrow">A SMALL DETOUR</p>
      <h1 className="page-title">
        Something went
        <br />a little off course.
      </h1>
      <p className="page-intro">
        The page couldn’t load just now. Please try again.
      </p>
      <button className="button" type="button" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}
