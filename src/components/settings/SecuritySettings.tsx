"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { useSession } from "next-auth/react"

export default function SecuritySettings() {
  const { data: session } = useSession()
  const [isPending, setIsPending] = useState(false)
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)

  useEffect(() => {
    async function loadSecuritySettings() {
      try {
        const response = await fetch("/api/settings/security")
        if (response.ok) {
          const data = await response.json()
          setTwoFactorEnabled(data.twoFactorEnabled)
        }
      } catch (error) {
        console.error("Failed to load security settings:", error)
      }
    }

    if (session?.user?.email) {
      loadSecuritySettings()
    }
  }, [session?.user?.email])

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    setIsPending(true)

    try {
      // Validate passwords if changing password
      if (passwords.new || passwords.confirm || passwords.current) {
        if (passwords.new !== passwords.confirm) {
          toast({
            title: "Error",
            description: "New passwords do not match.",
            variant: "destructive",
          })
          setIsPending(false)
          return
        }

        if (!passwords.current) {
          toast({
            title: "Error",
            description: "Please enter your current password.",
            variant: "destructive",
          })
          setIsPending(false)
          return
        }
      }

      const response = await fetch("/api/settings/security", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwords.current || undefined,
          newPassword: passwords.new || undefined,
          twoFactorEnabled,
        }),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error || "Failed to update security settings")
      }

      // Clear password fields after successful update
      if (passwords.new) {
        setPasswords({ current: "", new: "", confirm: "" })
      }

      toast({
        title: "Security settings updated",
        description: "Your security settings have been updated successfully.",
      })
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update security settings. Please try again.",
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
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Update your password and manage two-factor authentication.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            <div className="space-y-2">
              <Label htmlFor="current">Current Password</Label>
              <Input
                id="current"
                type="password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, current: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new">New Password</Label>
              <Input
                id="new"
                type="password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, new: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Confirm New Password</Label>
              <Input
                id="confirm"
                type="password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, confirm: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="2fa" className="flex flex-col space-y-1">
                <span>Enable Two-Factor Authentication</span>
                <span className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account.
                </span>
              </Label>
              <Switch
                id="2fa"
                checked={twoFactorEnabled}
                onCheckedChange={setTwoFactorEnabled}
              />
            </div>
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
