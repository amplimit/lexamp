"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"

export default function NotificationSettings() {
  const { data: session } = useSession()
  const [isPending, setIsPending] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    messages: true,
    marketing: false,
  })

  useEffect(() => {
    async function loadNotificationSettings() {
      try {
        const response = await fetch("/api/settings/notifications")
        if (response.ok) {
          const data = await response.json()
          setNotifications({
            email: data.emailEnabled,
            push: data.pushEnabled,
            messages: data.messagesEnabled,
            marketing: data.marketingEnabled,
          })
        }
      } catch (error) {
        console.error("Failed to load notification settings:", error)
      }
    }

    if (session?.user?.email) {
      loadNotificationSettings()
    }
  }, [session?.user?.email])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsPending(true)

    try {
      const response = await fetch("/api/settings/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: notifications.email,
          push: notifications.push,
          messages: notifications.messages,
          marketing: notifications.marketing,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update notification settings")
      }

      toast({
        title: "Notifications updated",
        description: "Your notification preferences have been updated successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
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
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose what notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="text-sm text-muted-foreground">
                Receive notifications via email.
              </span>
            </Label>
            <Switch
              id="email-notifications"
              checked={notifications.email}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, email: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
              <span>Push Notifications</span>
              <span className="text-sm text-muted-foreground">
                Receive push notifications in your browser.
              </span>
            </Label>
            <Switch
              id="push-notifications"
              checked={notifications.push}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, push: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="message-notifications" className="flex flex-col space-y-1">
              <span>Message Notifications</span>
              <span className="text-sm text-muted-foreground">
                Receive notifications for new messages.
              </span>
            </Label>
            <Switch
              id="message-notifications"
              checked={notifications.messages}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, messages: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between space-x-2">
            <Label htmlFor="marketing-notifications" className="flex flex-col space-y-1">
              <span>Marketing Emails</span>
              <span className="text-sm text-muted-foreground">
                Receive emails about new features and updates.
              </span>
            </Label>
            <Switch
              id="marketing-notifications"
              checked={notifications.marketing}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, marketing: checked }))
              }
            />
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
