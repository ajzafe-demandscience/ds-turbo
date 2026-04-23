"use client";

type FooterNewsletterFormProps = {
  inputPlaceholder?: string | null;
  buttonLabel?: string | null;
};

export function FooterNewsletterForm({
  inputPlaceholder,
  buttonLabel,
}: FooterNewsletterFormProps) {
  return (
    <form
      className="flex rounded-full bg-white p-1"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <input
        className="min-w-0 flex-1 rounded-full border-0 bg-transparent px-3 py-1.5 text-[#5f5f5f] text-sm outline-none placeholder:text-[#8d8d8d]"
        placeholder={inputPlaceholder || "Enter business email"}
        type="email"
      />
      <button
        className="rounded-full bg-[#cf2f5b] px-5 py-1.5 font-semibold text-sm text-white transition-colors hover:bg-[#bb294f]"
        type="submit"
      >
        {buttonLabel || "Sign Up"}
      </button>
    </form>
  );
}
