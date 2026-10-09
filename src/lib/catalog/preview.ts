import type { Product, Store } from "./schema";
export const previewStore: Store = { code: "sample", title: "خانه و زندگی", desc: "انتخاب‌های ساده برای لحظه‌های روزمره" };
export const previewProducts: Product[] = [
 { id: "101", code: "101", title: "ماگ سرامیکی", price: 285000, primary_price: 320000, images_url: ["/catalog/mug.svg", "/catalog/mug-detail.svg"], desc: "یک ماگ ساده برای قهوه صبحگاهی. این محصول و قیمت آن صرفاً برای نمایش نسخه نمونه است.", store: previewStore, features: [{ name: "رنگ", desc: "کرم,سبز" }] },
 { id: "102", code: "102", title: "کیف روزمره", price: 640000, images_url: ["/catalog/bag.svg"], desc: "همراه سبک روزهای شلوغ. اطلاعات این محصول نمونه است.", store: previewStore, features: [{ name: "رنگ", desc: "خاکی,زیتونی" }] },
 { id: "103", code: "103", title: "چراغ رومیزی", price: 1250000, images_url: ["/catalog/lamp.svg"], desc: "نوری گرم برای گوشه دنج خانه. اطلاعات این محصول نمونه است.", store: previewStore, features: [] },
];
