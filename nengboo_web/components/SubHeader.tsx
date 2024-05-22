export const SubHeader = (title: { title: string }) => {
  return (
    <section className="flex items-center justify-center mb-8">
      <div className="w-[140px] h-9 p-2 bg-neutral-100 rounded-[100px] justify-center items-center gap-2.5 inline-flex mt-28">
        <div className="w-[113px] h-[22px] justify-center items-center flex">
          <p className="w-[113px] h-[22px] text-center text-neutral-800 text-xl font-medium ">
            {title.title}
          </p>
        </div>
      </div>
    </section>
  );
};
