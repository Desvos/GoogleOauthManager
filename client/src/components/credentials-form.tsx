import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CredentialsFormProps {
  onSubmit: (clientId: string, clientSecret: string) => void;
}

export default function CredentialsForm({ onSubmit }: CredentialsFormProps) {
  const [loading, setLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: localStorage.getItem("clientId") || "",
      clientSecret: localStorage.getItem("clientSecret") || "",
    },
  });
  
  const handleSubmit = async (values: FormValues) => {
    setLoading(true);
    // Simulate a small delay to show loading state
    setTimeout(() => {
      onSubmit(values.clientId, values.clientSecret);
      setLoading(false);
    }, 500);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client ID</FormLabel>
              <FormControl>
                <Input placeholder="Your Google API Client ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="clientSecret"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client Secret</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="Your Google API Client Secret" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading}
        >
          {loading ? "Processing..." : "Authenticate with Google"}
        </Button>
      </form>
    </Form>
  );
}
