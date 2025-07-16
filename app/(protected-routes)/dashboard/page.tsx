"use client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();
  console.log(session);
  if (!session?.user?.roles) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Welcome to Your Dashboard</h1>
          <div className="flex items-center gap-2 bg-muted px-3 py-1 rounded-full text-sm">
            <span className="text-primary">Role:</span>
            <span className="font-medium">{session.user.roles.join(", ")}</span>
          </div>
        </div>
        <Button variant="outline">Settings</Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <div className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="p-4">
                <div className="grid gap-4">
                  <Button className="w-full">
                    <User className="mr-2" />
                    Profile Settings
                  </Button>
                  <Button className="w-full">My Projects</Button>
                  <Button className="w-full">Team Members</Button>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="p-4">
                <div className="text-center">
                  <h2 className="text-xl font-semibold">
                    Analytics Coming Soon
                  </h2>
                  <p className="text-muted-foreground">
                    Stay tuned for detailed analytics and insights.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </div>
  );
}
