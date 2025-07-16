import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/interface/components/ui/button";
import { PostsFeature } from "@/interface/features/posts";

export default function PostsPage() {
   return (
      <div className="min-h-screen bg-gray-50">
         <div className="border-b bg-white px-4 py-3">
            <div className="mx-auto flex max-w-6xl items-center gap-4">
               <Link href="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                     <ArrowLeft className="h-4 w-4" />
                     Voltar
                  </Button>
               </Link>
               <h1 className="text-xl font-semibold">Posts</h1>
            </div>
         </div>

         <div className="mx-auto max-w-6xl p-6">
            <PostsFeature />
         </div>
      </div>
   );
}
