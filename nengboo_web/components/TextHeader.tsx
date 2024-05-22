export const TextHeader = (title: { title: string }) => {
  return (
    <header className="flex mt-16 mb-14 justify-center">
      <p className="text-neutral-900 text-2xl font-bold text-center">
        {title.title}
      </p>
    </header>
  );
};
