"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"
import { SignInButton, useAuth } from "@clerk/nextjs"
import { redirect } from "next/navigation"

// Define the pricing plans data structure
const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Per editor",
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false,
    features: ["Basic Analytics Dashboard", "5GB Cloud Storage", "Email and Chat Support"],
  },
  {
    name: "Pro",
    price: "$19",
    description: "Per editor",
    buttonText: "Get Started",
    buttonVariant: "default" as const,
    popular: true,
    features: [
      "Everything in Free Plan",
      "5GB Cloud Storage",
      "Email and Chat Support",
      "Access to Community Forum",
      "Single User Access",
      "Access to Basic Templates",
      "Mobile App Access",
      "1 Custom Report Per Month",
      "Monthly Product Updates",
      "Standard Security Features",
    ],
  },
  {
    name: "Startup",
    price: "$29",
    description: "Per editor",
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false,
    features: ["Everything in Pro Plan", "5GB Cloud Storage", "Email and Chat Support"],
  },
]

export default function Pricing() {
  const { isLoaded, isSignedIn } = useAuth();
  
    function handleGetStarted() {
      if (!isLoaded) {
        return;
      }
  
      if (isSignedIn) {
        // User is already signed in, proceed to payment page
        redirect("/payment/subscription");
      }
      // If not signed in, the button click will be handled by the SignInButton component
    }
  return (
    <section className="py-18">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl space-y-6 text-center">
          <h1 className="text-center text-4xl font-semibold lg:text-5xl">Pricing that Scales with You</h1>
          <p>
            Gemini is evolving to be more than just the models. It supports an entire to the APIs and platforms helping
            developers and businesses innovate.
          </p>
        </div>

        <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Card key={index} className="relative">
              {plan.popular && (
                <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
                  Popular
                </span>
              )}

              <CardHeader>
                <CardTitle className="font-medium">{plan.name}</CardTitle>
                <span className="my-3 block text-2xl font-semibold">{plan.price} / mo</span>
                <CardDescription className="text-sm">{plan.description}</CardDescription>
                <Button asChild variant={plan.buttonVariant} className="mt-4 w-full cursor-pointer" onClick={handleGetStarted}>
                  {isSignedIn ? (
                    <>{plan.buttonText}</>
                  ) : (
                    <SignInButton
                      mode="modal"
                      fallbackRedirectUrl={"/payment/one-time"}
                    >
                      {plan.buttonText}
                    </SignInButton>
                  )}
                </Button>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}