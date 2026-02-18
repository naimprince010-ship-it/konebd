# KoneBD Deployment Guide (বাংলায়)

আপনার KoneBD প্রকল্পটি **Vercel**-এ ডিপ্লয় করার জন্য নিচের ধাপগুলো অনুসরণ করুন। Next.js প্রজেক্টের জন্য Vercel হলো সেরা এবং সহজ মাধ্যম।

## ধাপ ১: GitHub-এ কোড আপলোড করুন
আপনার প্রোজেক্ট এখন লোকাল মেশিনে Git-এর আওতায় আছে। এটি GitHub-এ আপলোড করতে হবে।

1. [GitHub](https://github.com/)-এ গিয়ে একটি **New Repository** তৈরি করুন (নাম দিন `kone-bd` বা আপনার পছন্দ মতো)।
2. টার্মিনালে নিচের কমান্ডগুলো দিয়ে আপনার লোকাল কোড সেখানে পুশ করুন:

```bash
git remote add origin https://github.com/YOUR_USERNAME/kone-bd.git
git branch -M main
git push -u origin main
```
*(এখানে `YOUR_USERNAME` এর জায়গায় আপনার গিটহাব ইউজারনেম বসাবেন)*

## ধাপ ২: Vercel-এ ডিপ্লয় করুন

1. [Vercel Dashboard](https://vercel.com/dashboard)-এ যান এবং **Add New...** > **Project** এ ক্লিক করুন।
2. **Import Git Repository** সেকশনে আপনার তৈরি করা `kone-bd` রিপোজিটরিটি দেখতে পাবেন। **Import** বাটনে ক্লিক করুন।
3. **Configure Project** পেজে ডিফল্ট সেটিংস ঠিক থাকার কথা।
   - **Framework Preset:** Next.js
   - **Root Directory:** `./`
4. **Deploy** বাটনে ক্লিক করুন।

## ধাপ ৩: ডাটাবেস সেটআপ (MongoDB)
আপনার প্রজেক্ট এখন **MongoDB** ব্যবহার করছে। তাই Vercel-এ ডিপ্লয় করার আগে আপনার একটি ডাটাবেস কানেকশন স্ট্রিং লাগবে।

1. **MongoDB Atlas**-এ একটি ফ্রি একাউন্ট খুলুন এবং একটি ক্লাস্টার তৈরি করুন।
2. **Connect** বাটনে ক্লিক করে `Driver` হিসেবে `Node.js` সিলেক্ট করুন।
3. কানেকশন স্ট্রিংটি কপি করুন (এটি দেখতে অনেকটা এমন হবে: `mongodb+srv://user:pass@cluster.mongodb.net/myFirstDatabase`).
4. `password` এর জায়গায় আপনার ডাটাবেস পাসওয়ার্ড বসান।

## ধাপ ৪: Vercel-এ Environment Variable যুক্ত করা
Vercel-এ প্রজেক্ট ইম্পোর্ট করার সময় বা পরে **Settings > Environment Variables**-এ গিয়ে নিচের ভেরিয়েবলটি যুক্ত করুন:

- **Key:** `MONGODB_URI`
- **Value:** আপনার MongoDB কানেকশন স্ট্রিং

বাকি সব ধাপ আগের মতোই। এখন আপনার ডাটা পার্মানেন্টলি সেভ থাকবে!

> [!TIP]
> **PWA Support:** আপনার অ্যাপটি মোবাইল ফ্রেন্ডলি। ভবিষ্যতে এটিকে PWA (Progressive Web App) হিসেবে কনফিগার করলে আরও ভালো ইউজার এক্সপেরিয়েন্স পাওয়া যাবে।
