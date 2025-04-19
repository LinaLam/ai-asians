import AIPlayground from "@/components/ai-playground"

export default function Home() {
  return (
    <div className="min-h-screen bg-ghibli-bg bg-fixed bg-cover bg-center">
      <main className="container max-w-6xl mx-auto py-10 px-4">
        <AIPlayground />
      </main>
    </div>
  )
}
