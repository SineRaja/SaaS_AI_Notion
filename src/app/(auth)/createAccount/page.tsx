'use client';
export const dynamic = 'force-dynamic';
// Importing React library for building UI components.
import React, { useMemo, useState } from 'react';
// Importing button, form components, and input controls for building the form.
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
// Importing Zod resolver for form validation.
import { zodResolver } from '@hookform/resolvers/zod';
// Utility for conditionally applying CSS classes.
import clsx from 'clsx';
// Next.js components for images and links.
import Image from 'next/image';
import Link from 'next/link';
// Router hooks from Next.js to manage navigation and search parameters.
import { useRouter, useSearchParams } from 'next/navigation';
// Zod for schema validation.
import { z } from 'zod';

// Static imports for assets and utility functions.
import Logo from '../../../../public/next.svg';
import Loader from '@/components/global/Loader';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MailCheck } from 'lucide-react';
import { FormSchema } from '@/lib/types';
import { actionSignUpUser } from '@/lib/server-actions/auth-actions';
import { useForm } from 'react-hook-form';


// Defining the schema for the signup form, validating email, password, and confirm password fields.
const SignUpFormSchema = z
  .object({
    email: z.string().describe('Email').email({ message: 'Invalid Email' }),
    password: z
      .string()
      .describe('Password')
      .min(6, 'Password must be minimum 6 characters'),
    confirmPassword: z
      .string()
      .describe('Confirm Password')
      .min(6, 'Password must be minimum 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

// Main component for the signup page.
const Signup = () => {
    // Hooks for routing and managing URL search parameters.
    const router = useRouter();
    const searchParams = useSearchParams();
    // State hooks for managing errors and confirmation messages.
    const [submitError, setSubmitError] = useState('');
    const [confirmation, setConfirmation] = useState(false);
  
    // Determining if there's an error message in the search parameters.
  const codeExchangeError = useMemo(() => {
    if (!searchParams) return '';
    return searchParams.get('error_description');
  }, [searchParams]);

  // Conditional styles based on the presence of an error.
  const confirmationAndErrorStyles = useMemo(
    () =>
      clsx('bg-primary', {
        'bg-red-500/10': codeExchangeError,
        'border-red-500/50': codeExchangeError,
        'text-red-700': codeExchangeError,
      }),
    [codeExchangeError]
  );

   // Setting up form handlers using react-hook-form with Zod for validation.
  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

   // Checking if the form is currently submitting.
  const isLoading = form.formState.isSubmitting;
   // Handler for submitting the form.
  const onSubmit = async ({ email, password }: z.infer<typeof FormSchema>) => {
    const { error } = await actionSignUpUser({ email, password });
    if (error) {
      setSubmitError(error.message);
      form.reset();// Resetting form after an error.
      return;
    }
    setConfirmation(true);// Setting confirmation state if no errors.
  };

   // Rendering the form UI.
  return (
    <Form {...form}>
      <form
        onChange={() => {
          if (submitError) setSubmitError('');// Clear error on form change.
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:justify-center sm:w-[400px]
        space-y-6 flex
        flex-col
        "
      >
        <Link
          href="/"
          className="
          w-full
          flex
          justify-left
          items-center"
        >
          <Image
            src={Logo}
            alt="SaaS Prasana Logo"
            width={50}
            height={50}
          />
          <span
            className="font-semibold
          dark:text-white text-4xl first-letter:ml-2"
          >
            SaaS Notion
          </span>
        </Link>
        <FormDescription
          className="
        text-foreground/60"
        >
          An all-In-One Collaboration and Productivity Platform
        </FormDescription>
        {/* Conditionally rendering form fields only if not confirmed and no exchange error. */}
        {!confirmation && !codeExchangeError && (
          <>
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
            <FormField
              disabled={isLoading}
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full p-6"
              disabled={isLoading}
            >
              {!isLoading ? 'Create Account' : <Loader />}
            </Button>
          </>
        )}

        {submitError && <FormMessage>{submitError}</FormMessage>}
        <span className="self-container">
          Already have an account?{' '}
          <Link
            href="/singin"
            className="text-primary"
          >
            Login
          </Link>
        </span>
        {(confirmation || codeExchangeError) && (
          <>
            <Alert className={confirmationAndErrorStyles}>
              {!codeExchangeError && <MailCheck className="h-4 w-4" />}
              <AlertTitle>
                {codeExchangeError ? 'Invalid Link' : 'Check your email.'}
              </AlertTitle>
              <AlertDescription>
                {codeExchangeError || 'An email confirmation has been sent.'}
              </AlertDescription>
            </Alert>
          </>
        )}
      </form>
    </Form>
  );
};

export default Signup;