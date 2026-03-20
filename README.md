## Social Media Feed

A responsive social media feed built with Next.js, Tailwind CSS, and Zustand.

---

## Important Note

- When create the post I manually generate the **title** according to content coz it is hidden in ui design. In ui it only contains content and image upload
- And also Video upload is not design in database design but can upload video or image as you want and file max size is **10MB**

---

## Requirements

- node >= 24.13.0

## Post Feed

- Infinite Scrolling using **Intersection Observer**
- Skeleton Loaders

## Reactions & Comments

- **Synchronized Store Ticks**: Implements wrapper triggers (`incrementCommentCount`) that keep reaction ticks fully aligned with cache counters without pulling duplicate bulk arrays contextually.

## Tech Stack & Structure

- **Frontend Framework**: Next.js (App Router)
- **CSS Framework Style layouts**: Tailwind CSS + Shadcn UI Components
- **State Management wrapper hooks**: Zustand Store
- **Validation context models**: Zod Validation Schema Frames
- **Form Handling triggers**: React-Hook-Form

## Folder Structure Highlights

```text
├── components/          # Reusable shared global layout widgets
├── modules/             # functional layouts scoped neatly (auth, posts)
├── lib/api/             # API handlers (apiClient axios configuration layers)
├── stores/             # Zustand caches hooks
└── validations/        # Zod schema boundaries
```

---

## Setup Projects

1. **Clone the repository**

   ```bash
   git clone https://github.com/hlaingwinphyoe/social_frontend_nextjs.git
   cd social_frontend_nextjs
   ```

2. **Install Dependencies**

```bash
npm install
```

3. **Configure Environment Variables**

Create a `.env.local` file in your root folder and point it to your backend API domain endpoint:

```env
NEXT_PUBLIC_API_URL="http://127.0.0.1:8000/api"
```

4. **Start Development Server**

```bash
npm run dev
```
