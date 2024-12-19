"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthButtons from "@/components/common/AuthButton";
import DynamicForm from "@/components/common/form/DynamicForm";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/common/Loader";

const HomePage = () => {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<string | null>(null); // Default to null

  useEffect(() => {
    const tab = searchParams.get("tab") || "login"; // Default to "login" if no tab is specified
    setActiveTab(tab); // Set the active tab based on the URL
  }, [searchParams]);

  const onTabsChange = (newTab: string) => {
    window.history.pushState({}, "", `?tab=${newTab}`); // Update the URL without reloading
    setActiveTab(newTab); // Update the active tab in state
  };

  if (!activeTab) {
    // Avoid rendering until activeTab is determined
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-1 flex justify-center items-center px-1 md:px-4 py-8">
        <div className="w-full max-w-lg space-y-6 bg-neutral-200/10 p-2 md:p-8 rounded-lg shadow-2xl">
          <Tabs onValueChange={onTabsChange} value={activeTab}>
            <TabsList className="w-full">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {/* Login Panel */}
              <div className="space-y-6">
                <div className="primary p-4 rounded-t-lg">
                  <h2 className="text-2xl font-bold">Login</h2>
                  <p className="text-sm">Enter your credentials to access your account</p>
                </div>
                <AuthButtons />
                <DynamicForm formType="login" />
              </div>
            </TabsContent>

            <TabsContent value="register">
              {/* Register Panel */}
              <div className="space-y-6">
                <div className="bg-primary p-4 rounded-t-lg">
                  <h2 className="text-2xl font-bold">Register</h2>
                  <p className="text-sm">Create an account by filling in your details</p>
                </div>
                <AuthButtons />
                <DynamicForm formType="register" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
