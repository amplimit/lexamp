"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"

export default function AppearanceSettings() {
  const { data: session } = useSession()
  const [isPending, setIsPending] = useState(false)
  const [appearance, setAppearance] = useState({
    theme: "system",
    fontSize: "normal",
  })

  useEffect(() => {
    async function loadAppearanceSettings() {
      try {
        const response = await fetch("/api/settings/appearance")
        if (response.ok) {
          const data = await response.json()
          setAppearance({
            theme: data.theme || "system",
            fontSize: data.fontSize || "normal",
          })
        }
      } catch (error) {
        console.error("Failed to load appearance settings:", error)
      }
    }

    if (session?.user?.email) {
      loadAppearanceSettings()
    }
  }, [session?.user?.email])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsPending(true)

    try {
      const response = await fetch("/api/settings/appearance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(appearance),
      })

      if (!response.ok) {
        throw new Error("Failed to update appearance settings")
      }

      toast({
        title: "Appearance updated",
        description: "Your appearance settings have been updated successfully.",
      })

      // Apply theme changes immediately
      document.documentElement.setAttribute("data-theme", appearance.theme)
      const fontSizeMap = {
        small: "14px",
        normal: "16px",
        large: "18px",
      } as const;
      document.documentElement.style.fontSize = fontSizeMap[appearance.fontSize as keyof typeof fontSizeMap] || "16px";
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update appearance settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>
            Customize the appearance of the application.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Theme</h3>
            <RadioGroup
              defaultValue={appearance.theme}
              onValueChange={(value) =>
                setAppearance((prev) => ({ ...prev, theme: value }))
              }
              className="grid grid-cols-3 gap-4"
            >
              <div>
                <RadioGroupItem
                  value="light"
                  id="theme-light"
                  className="sr-only"
                />
                <Label
                  htmlFor="theme-light"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <span>Light</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="dark"
                  id="theme-dark"
                  className="sr-only"
                />
                <Label
                  htmlFor="theme-dark"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <span>Dark</span>
                </Label>
              </div>
              <div>
                <RadioGroupItem
                  value="system"
                  id="theme-system"
                  className="sr-only"
                />
                <Label
                  htmlFor="theme-system"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <span>System</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fontSize">Font Size</Label>
            <Select
              value={appearance.fontSize}
              onValueChange={(value) =>
                setAppearance((prev) => ({ ...prev, fontSize: value }))
              }
            >
              <SelectTrigger id="fontSize">
                <SelectValue placeholder="Select font size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
