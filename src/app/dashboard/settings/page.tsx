"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProfileSettings from "@/components/settings/ProfileSettings"
import NotificationSettings from "@/components/settings/NotificationSettings"
import SecuritySettings from "@/components/settings/SecuritySettings"
import AppearanceSettings from "@/components/settings/AppearanceSettings"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="space-y-6 p-10 pb-16">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and set preferences.
        </p>
      </div>
      <Separator />
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings />
        </TabsContent>
        <TabsContent value="notifications" className="space-y-6">
          <NotificationSettings />
        </TabsContent>
        <TabsContent value="security" className="space-y-6">
          <SecuritySettings />
        </TabsContent>
        <TabsContent value="appearance" className="space-y-6">
          <AppearanceSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
