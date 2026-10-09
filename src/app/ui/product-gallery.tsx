"use client";
import Image from "next/image";
import { useState } from "react";
export function ProductGallery({ images, title }: { images: string[]; title: string }) {
 const [index, setIndex] = useState(0);
 if (!images.length) return <div className="flex aspect-square items-center justify-center rounded-3xl bg-stone-100 text-stone-500">تصویر موجود نیست</div>;
 return <section aria-label="تصاویر محصول"><div className="relative aspect-square overflow-hidden rounded-3xl bg-stone-100"><Image src={images[index]} alt={`${title} — تصویر ${index + 1}`} fill unoptimized sizes="(max-width: 768px) 100vw, 50vw" className="object-contain p-8" /></div>{images.length > 1 && <div className="mt-4 flex gap-3">{images.map((image, i) => <button key={`${image}-${i}`} aria-label={`مشاهده تصویر ${i + 1}`} aria-pressed={i === index} onClick={() => setIndex(i)} className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-800 ${i === index ? "border-teal-700" : "border-transparent"}`}><Image src={image} alt="" fill unoptimized className="object-contain p-2" sizes="80px" /></button>)}</div>}</section>;
}
