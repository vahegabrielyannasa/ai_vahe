export default function Result({ story }) {
  if (!story) {
    return null;
  }

  return (
    <section className="creation-result" aria-live="polite" aria-labelledby="story-title">
      <p className="creation-eyebrow"><span /> Fresh from the storybook</p>
      <div className="creation-result__body">
        <h2 id="story-title">{story.title}</h2>
        <ol className="creation-result__pages">
          {story.pages.map((page, index) => (
            <li key={`${story.title}-${index}`}>
              <p>{page}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}