// Indicates this module is intended to run in a client-side environment.
'use client';
export const dynamic = 'force-dynamic';

// Import necessary modules and hooks.
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormSchema } from '@/lib/types';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '../../../../public/next.svg';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Loader from '@/components/global/Loader';
import { Separator } from '@/components/ui/separator';
import { actionLoginUser } from '@/lib/server-actions/auth-actions';

// Component definition for the LoginPage.
const LoginPage = () => {
  // Hook for navigating programmatically within the application.
  const router = useRouter();
  // State for managing error messages related to form submission.
  const [submitError, setSubmitError] = useState('');

  // Initialize form handling with react-hook-form and Zod for schema validation.
  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange', // Validation will occur on every input change.
    resolver: zodResolver(FormSchema), // Integrate Zod schema validation.
    defaultValues: { email: '', password: '' }, // Set initial form values.
  });

  // Derived state to indicate if the form is currently submitting.
  const isLoading = form.formState.isSubmitting;

  // Handler for form submission that conforms to the expected type.
  const onSubmit: SubmitHandler<z.infer<typeof FormSchema>> = async (formData) => {
    // Attempt to log in the user with the provided credentials.
    const { error } = await actionLoginUser(formData);
    if (error) {
      // If there's an error, reset the form and set the error message.
      form.reset();
      setSubmitError(error.message);
    } else {
      // On successful login, redirect the user to the dashboard.
      router.replace('/dashboard');
    }
  };

  // Component's JSX layout.
  return (
    <Form {...form}>
      <form
        onChange={() => {
          // Clear any existing error messages when the form changes.
          if (submitError) setSubmitError('');
        }}
        onSubmit={form.handleSubmit(onSubmit)} // Handle form submission.
        className="w-full sm:justify-center sm:w-[400px] space-y-6 flex flex-col"
      >
        <Link
          href="/"
          className="w-full flex justify-left items-center"
        >
          <Image
            src={Logo}
            alt="SaaS Prasana Logo"
            width={50}
            height={50}
          />
          <span className="font-semibold dark:text-white text-4xl first-letter:ml-2">
            SaaS Notion..
          </span>
        </Link>
        <FormDescription
          className="text-foreground/60"
        >
          An all-In-One Collaboration and Productivity Platform
        </FormDescription>
        <FormField
          disabled={isLoading}
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          disabled={isLoading}
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* // Display error messages if present. */}
        {submitError && <FormMessage>{submitError}</FormMessage>} 
        <Button
          type="submit"
          className="w-full p-6"
          size="lg"
          disabled={isLoading}
        >
             {/* // Show loader when the form is submitting. */}
          {!isLoading ? 'Login' : <Loader />}
        </Button>
        <span className="self-container">
          Dont have an account?{' '}
          <Link
            href="/createAccount"
            className="text-primary"
          >
            Sign Up
          </Link>
        </span>
      </form>
    </Form>
  );
};

// Export the LoginPage for use in other parts of the application.
export default LoginPage;
