type SectionIntroProps = {
  eyebrow: string;
  title: string;
  copy?: string;
  index?: string;
  align?: "left" | "split";
};

export function SectionIntro({
  eyebrow,
  title,
  copy,
  index,
  align = "split",
}: SectionIntroProps) {
  return (
    <header className={`section-intro section-intro--${align}`}>
      <div className="section-intro__label">
        {index ? <span aria-hidden="true">{index}</span> : null}
        <p className="eyebrow">{eyebrow}</p>
      </div>
      <div className="section-intro__body">
        <h2>{title}</h2>
        {copy ? <p className="section-intro__copy">{copy}</p> : null}
      </div>
    </header>
  );
}
