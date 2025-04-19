"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Loader } from "lucide-react"
import ModelRenderer from "@/components/model-renderer"
import { generateRendering } from "@/app/actions"
import { ModeToggle } from "@/components/mode-toggle"
import Image from "next/image"
export default function AIPlayground() {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{
    deepseek: string | null
    deepseekPostTraining: string | null
    claude: string | null
  }>({
    deepseek: null,
    deepseekPostTraining: null,
    claude: null,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)

    try {
      const renderings = await generateRendering(prompt)
      setResults(renderings)
    } catch (error) {
      console.error("Error generating renderings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 relative z-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-medium tracking-tight text-ghibli-dark font-ghibli">
            3D Rendering Playground
          </h1>
          <p className="text-ghibli-dark/80 mt-1">Compare 3D renderings across Deepseek, Deepseek Post-Training, and Claude 3.7 Sonnet. </p>
        </div>
        <ModeToggle />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-3 max-w-2xl mx-auto mb-10">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what you want to render..."
          className="flex-1 h-12 bg-white/70 backdrop-blur-sm border-ghibli-accent/30 shadow-sm text-ghibli-dark placeholder:text-ghibli-dark/50"
          disabled={isLoading}
        />
        <Button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="h-12 px-6 font-medium bg-ghibli-accent hover:bg-ghibli-accent/90 text-white"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate
            </>
          )}
        </Button>
      </form>

      <div className="flex flex-row md:flex-col w-full bg-red-500 gap-5">
        <RenderCard
          title="Deepseek"
          subtitle="Base model"
          isLoading={isLoading}
          sceneData={results.deepseek}
          className="flex-1"
        />

        <RenderCard
          title="Deepseek Post-Training"
          subtitle="Enhanced model"
          isLoading={isLoading}
          sceneData={results.deepseekPostTraining}
          className="flex-1"

        />

        <RenderCard
          title="Claude-3.7 Sonnet"
          subtitle="Advanced model"
          isLoading={isLoading}
          sceneData={results.claude}
          className="flex-1"
        />
      </div>

      {results.deepseek && (
        <Card className="mt-10 bg-white/70 backdrop-blur-sm rounded-xl overflow-hidden">
          <Tabs defaultValue="comparison" className="w-full">
            <div className="px-6 pt-6">
              <TabsList className="grid w-full grid-cols-3 h-10 bg-ghibli-light/50">
                <TabsTrigger
                  value="comparison"
                  className="data-[state=active]:bg-ghibli-accent data-[state=active]:text-white"
                >
                  Comparison
                </TabsTrigger>
                <TabsTrigger
                  value="details"
                  className="data-[state=active]:bg-ghibli-accent data-[state=active]:text-white"
                >
                  Technical Details
                </TabsTrigger>
                <TabsTrigger
                  value="fullscreen"
                  className="data-[state=active]:bg-ghibli-accent data-[state=active]:text-white"
                >
                  Fullscreen View
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="comparison" className="flex flex-col gap-6 p-6">
              <h3 className="text-sm font-medium mb-4 text-ghibli-dark">Rendering Comparison</h3>
              <div className="flex flex-col gap-4 items-start justify-center">
                <ComparisonItem
                  title="Deepseek"
                  description="Basic geometry and lighting, simpler textures, standard rendering techniques."
                />
                <ComparisonItem
                  title="Deepseek Post-Training"
                  description="Enhanced geometry detail, improved textures, better lighting effects and shadows."
                />
                <ComparisonItem
                  title="Claude-3.7 Sonnet"
                  description="Complex geometry, photorealistic textures, advanced lighting with global illumination, and atmospheric effects."
                />
              </div>
            </TabsContent>
            <TabsContent value="details" className="p-6">
              <h3 className="text-sm font-medium mb-4 text-ghibli-dark">Technical Details</h3>
              <div className="space-y-4 text-sm">
                <p className="pb-2 border-b border-ghibli-accent/20">
                  <span className="text-ghibli-dark/70">Prompt:</span>{" "}
                  <span className="font-medium text-ghibli-dark">{prompt}</span>
                </p>
                <div className="grid grid-cols-3 gap-8">
                  <TechnicalDetails title="Deepseek" polygons="~10,000" resolution="1K" renderTime="2.3s" />
                  <TechnicalDetails
                    title="Deepseek Post-Training"
                    polygons="~25,000"
                    resolution="2K"
                    renderTime="3.8s"
                  />
                  <TechnicalDetails title="Claude-3.7 Sonnet" polygons="~50,000" resolution="4K" renderTime="5.2s" />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="fullscreen" className="p-6">
              <div className="h-[500px] grid grid-cols-3 gap-4">
                <div className="h-full rounded-xl overflow-hidden bg-ghibli-light/30">
                  {results.deepseek && <ModelRenderer sceneData={results.deepseek} fullscreen />}
                </div>
                <div className="h-full rounded-xl overflow-hidden bg-ghibli-light/30">
                  {results.deepseekPostTraining && (
                    <ModelRenderer sceneData={results.deepseekPostTraining} fullscreen />
                  )}
                </div>
                <div className="h-full rounded-xl overflow-hidden bg-ghibli-light/30">
                  {results.claude && <ModelRenderer sceneData={results.claude} fullscreen />}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      )}

      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-30 pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64">
          <Image
            src="/images/ghibli-cloud1.png"
            alt="Decorative cloud"
            width={256}
            height={256}
            className="animate-float-slow"
          />
        </div>
        <div className="absolute bottom-20 left-10 w-48 h-48">
          <Image
            src="/images/ghibli-cloud2.png"
            alt="Decorative cloud"
            width={192}
            height={192}
            className="animate-float"
          />
        </div>
      </div>
    </div>
  )
}

function RenderCard({
  title,
  subtitle,
  isLoading,
  sceneData,
}: {
  title: string
  subtitle: string
  isLoading: boolean
  sceneData: string | null
  className?: string
}) {
  return (
    <Card>
      <div className="p-5 border-b flex items-center justify-between">
        <div>
          <h3 className="font-medium text-sm">{title}</h3>
          <p className="text-xs">{subtitle}</p>
        </div>
        {isLoading && <Loader className="h-4 w-4 animate-spin" />}
      </div>
      <CardContent>
        <div className="h-[280px] flex items-center justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader className="h-8 w-8 animate-spin" />
              <p className="text-xs">Generating...</p>
            </div>
          ) : sceneData ? (
            <ModelRenderer sceneData={sceneData} />
          ) : (
            <p className="text-xs">Enter a prompt to generate a 3D rendering</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ComparisonItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-center justify-center gap-4">
      <h4 className="flex-shrink-0 text-sm font-medium text-ghibli-dark">{title}</h4>
      <p className="text-sm text-ghibli-dark/70 flex-1">{description}</p>
    </div>
  )
}

function TechnicalDetails({
  title,
  polygons,
  resolution,
  renderTime,
}: {
  title: string
  polygons: string
  resolution: string
  renderTime: string
}) {
  return (
    <div>
      <h4 className="text-sm font-medium mb-2 text-ghibli-dark">{title}</h4>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-ghibli-dark/70">Polygon count</span>
          <span className="text-ghibli-dark">{polygons}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ghibli-dark/70">Texture resolution</span>
          <span className="text-ghibli-dark">{resolution}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-ghibli-dark/70">Rendering time</span>
          <span className="text-ghibli-dark">{renderTime}</span>
        </div>
      </div>
    </div>
  )
}
