"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import type { Photo } from "@/data/photos";
import { usePresence } from "@/hooks/use-presence";
import { track } from "@/lib/analytics";
import { fill } from "@/lib/format";
import { useOptionalBooking } from "@/components/booking/booking-context";

type LightboxMessages = Pick<Dictionary, "lightbox" | "allPhotos" | "cta">;

type LightboxContextValue = { open: (index: number, trigger?: HTMLElement | null) => void };

const LightboxContext = createContext<LightboxContextValue | null>(null);

export function useLightbox() {
  const value = useContext(LightboxContext);
  if (!value) throw new Error("useLightbox must be used inside <LightboxProvider>");
  return value;
}

export function LightboxProvider({
  photos,
  locale,
  t,
  source,
  children,
}: {
  photos: Photo[];
  locale: Locale;
  t: LightboxMessages;
  /** Where "Check dates" in the viewer is reported from. */
  source: "lightbox";
  children: ReactNode;
}) {
  const [index, setIndex] = useState<number | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const open = useCallback((i: number, el?: HTMLElement | null) => {
    trigger.current = el ?? (document.activeElement as HTMLElement | null);
    setIndex(i);
  }, []);
  const close = useCallback(() => {
    setIndex(null);
    const el = trigger.current;
    if (el && document.contains(el)) window.setTimeout(() => el.focus({ preventScroll: true }), 0);
  }, []);
  return (
    <LightboxContext.Provider value={{ open }}>
      {children}
      <Lightbox photos={photos} index={index} setIndex={setIndex} close={close} locale={locale} t={t} source={source} />
    </LightboxContext.Provider>
  );
}

/** Opens the lightbox at `index` and reports `open_gallery`. */
export function PhotoTrigger({
  index,
  className,
  label,
  style,
  children,
}: {
  index: number;
  className?: string;
  label?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}) {
  const { open } = useLightbox();
  return (
    <button
      type="button"
      className={className}
      style={style}
      aria-label={label}
      data-event="open_gallery"
      onClick={(e) => {
        track("open_gallery", { photo_index: index + 1 });
        open(index, e.currentTarget);
      }}
    >
      {children}
    </button>
  );
}

function Lightbox({
  photos,
  index,
  setIndex,
  close,
  locale,
  t,
  source,
}: {
  photos: Photo[];
  index: number | null;
  setIndex: (i: number) => void;
  close: () => void;
  locale: Locale;
  t: LightboxMessages;
  source: "lightbox";
}) {
  const open = index !== null;
  const { mounted, state } = usePresence(open, 200);
  const [shown, setShown] = useState(0);
  if (index !== null && index !== shown) setShown(index);
  const dialog = useRef<HTMLDialogElement>(null);
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const booking = useOptionalBooking();
  const router = useRouter();
  const total = photos.length;
  const photo = photos[shown];

  const go = useCallback((delta: number) => setIndex((shown + delta + total) % total), [shown, total, setIndex]);

  useEffect(() => {
    const el = dialog.current;
    if (!mounted || !el) return;
    if (!el.open) el.showModal();
    document.documentElement.style.overflow = "hidden";
    document.documentElement.dataset.overlay = "";
    return () => {
      document.documentElement.style.overflow = "";
      delete document.documentElement.dataset.overlay;
    };
  }, [mounted]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") go(1);
      if (event.key === "ArrowLeft") go(-1);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, go]);

  function checkDates(el: HTMLElement) {
    close();
    if (booking) window.setTimeout(() => booking.openDates(source, el), 220);
    else router.push(`/${locale}?dates=1&source=${source}`);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    swipe.current = { x: event.clientX, y: event.clientY };
  }
  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (!swipe.current) return;
    const dx = event.clientX - swipe.current.x;
    const dy = event.clientY - swipe.current.y;
    swipe.current = null;
    if (dy > 80 && Math.abs(dy) > Math.abs(dx)) close();
    else if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
  }

  if (!mounted || !photo) return null;
  const counter = fill("{n} / {total}", { n: shown + 1, total });
  const groupName = t.allPhotos.groups[photo.group];
  const stripStart = Math.min(Math.max(0, shown - 3), Math.max(0, total - 8));
  const strip = photos.slice(stripStart, stripStart + 8);

  return (
    <dialog
      ref={dialog}
      className="modal lightbox"
      data-component="Lightbox"
      data-state={state}
      aria-label={t.lightbox.label}
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-3 md:h-[72px] md:border-b md:border-line md:px-8">
          <button type="button" className="btn btn-secondary btn-sm btn-round text-xl md:hidden" aria-label={t.lightbox.close} onClick={close}>
            ×
          </button>
          <button type="button" className="btn btn-secondary btn-sm hidden md:inline-flex" onClick={close}>
            <span aria-hidden="true">×</span> {t.lightbox.close}
          </button>
          <p className="t-body font-medium tnum" aria-live="polite">
            {counter}
          </p>
          <button
            type="button"
            className="btn btn-primary btn-sm hidden md:inline-flex"
            data-event="open_date_picker"
            onClick={(e) => checkDates(e.currentTarget)}
          >
            {t.cta.checkDates}
          </button>
          <span className="w-11 md:hidden" />
        </div>

        <div
          className="relative flex min-h-0 flex-1 touch-pan-y items-center justify-center px-2 py-6 select-none [container-type:size] md:px-[120px]"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipe.current = null)}
        >
          <Image
            key={photo.id}
            src={photo.file}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 768px) calc(100vw - 240px), 100vw"
            draggable={false}
            loading="eager"
            className="h-auto rounded-photo"
            style={{
              // Largest size that fits the area while keeping the photo's own corners rounded.
              width: `min(100cqw, ${(photo.width / photo.height).toFixed(4)} * 100cqh)`,
              aspectRatio: `${photo.width} / ${photo.height}`,
              animation: "fade-in 200ms var(--ease) both",
            }}
          />
          <button
            type="button"
            className="step absolute top-1/2 left-10 hidden size-[52px] -translate-y-1/2 bg-snow text-xl md:inline-flex"
            aria-label={t.lightbox.previous}
            onClick={() => go(-1)}
          >
            ←
          </button>
          <button
            type="button"
            className="step absolute top-1/2 right-10 hidden size-[52px] -translate-y-1/2 bg-snow text-xl md:inline-flex"
            aria-label={t.lightbox.next}
            onClick={() => go(1)}
          >
            →
          </button>
        </div>

        <div className="flex flex-col gap-1.5 px-5 pt-4 pb-8 md:items-center md:gap-3.5 md:px-8 md:pt-3.5 md:pb-5">
          <p className="t-body flex flex-col gap-1.5 md:block">
            <span className="t-label">{groupName}</span>
            <span className="hidden md:inline">&nbsp;&nbsp;</span>
            {photo.alt}
          </p>
          <div className="hidden gap-2 md:flex">
            {strip.map((p, i) => {
              const n = stripStart + i;
              const current = n === shown;
              return (
                <button
                  key={p.id}
                  type="button"
                  className={`relative h-[54px] w-[72px] overflow-hidden rounded-chip border-0 p-0 ${current ? "outline-2 outline-offset-2 outline-charcoal" : "opacity-50"}`}
                  aria-label={fill(current ? t.lightbox.thumbCurrent : t.lightbox.thumb, { n: n + 1 })}
                  aria-current={current || undefined}
                  onClick={() => setIndex(n)}
                >
                  <Image src={p.file} alt="" fill sizes="72px" loading="eager" className="object-cover" />
                </button>
              );
            })}
          </div>
          <p className="t-sm hidden md:block">{t.lightbox.hint}</p>
          <p className="t-sm md:hidden">{t.lightbox.hintMobile}</p>
        </div>
      </div>
    </dialog>
  );
}
