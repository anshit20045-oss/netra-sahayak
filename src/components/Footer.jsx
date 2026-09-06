export default function Footer() {
  return (
    <footer className="border-t border-[var(--color-line)] bg-[var(--color-ink)] text-[#c7cede]">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-[16px] text-white">Netra Sahayak</p>
          <p className="mt-1 text-[13px]">
            Explainable AI for Diabetic Retinopathy Screening in Rural India · SIH26038
          </p>
        </div>
        <p className="text-[12.5px]">Prototype for Smart India Hackathon — not for clinical use.</p>
      </div>
    </footer>
  );
}
