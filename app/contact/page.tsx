"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // Open email client with pre-filled details
    const subject = encodeURIComponent(formData.subject || "FundiHub Contact")
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    )
    window.location.href = `mailto:calvincewise@gmail.com?subject=${subject}&body=${body}`

    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
    }, 600)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />

      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/5 to-transparent px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary">
            Get in Touch
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            We'd Love to <span className="text-primary">Hear From You</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Have a question, feedback, or partnership idea? Reach out — we
            usually respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Cards + Form */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Contact Info */}
            <div className="space-y-4 lg:col-span-2">
              <a
                href="tel:+254799112919"
                className="group block rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Mon - Sat, 8am - 8pm EAT
                    </p>
                    <p className="mt-1 text-sm font-medium text-primary">
                      +254 799 112 919
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="mailto:calvincewise@gmail.com"
                className="group block rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      We reply within 24 hours
                    </p>
                    <p className="mt-1 text-sm font-medium break-all text-primary">
                      calvincewise@gmail.com
                    </p>
                  </div>
                </div>
              </a>

              <a
                href="https://wa.me/254799112919"
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/15">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">WhatsApp</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Quickest way to reach us
                    </p>
                    <p className="mt-1 text-sm font-medium text-primary">
                      Chat with us instantly
                    </p>
                  </div>
                </div>
              </a>

              <div className="rounded-xl border border-border/60 bg-card p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Based in
                    </p>
                    <p className="mt-1 text-sm font-medium">Nairobi, Kenya</p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-card p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Business Hours</h3>
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Mon - Fri</span>
                        <span className="font-medium text-foreground">
                          8am - 8pm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Saturday</span>
                        <span className="font-medium text-foreground">
                          9am - 6pm
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sunday</span>
                        <span className="font-medium text-foreground">
                          Closed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <Card className="border-border/60 lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </p>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                      <Send className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">
                      Message Sent!
                    </h3>
                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                      Thanks for reaching out. We've opened your email client to
                      send the message. We'll respond shortly.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          required
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        required
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            subject: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <textarea
                        id="message"
                        required
                        rows={6}
                        placeholder="Tell us more about what you need..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            message: e.target.value,
                          })
                        }
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="bg-muted/20 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-xl font-bold sm:text-2xl">
            Looking for Something Else?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Check out these resources
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Link
              href="/about"
              className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <h3 className="font-semibold">About Us</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Learn more about FundiHub
              </p>
            </Link>
            <Link
              href="/for-fundis"
              className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <h3 className="font-semibold">For Fundis</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Join as a professional
              </p>
            </Link>
            <Link
              href="/refer-earn"
              className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent"
            >
              <h3 className="font-semibold">Refer & Earn</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Earn by referring fundis
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Compact Footer */}
      <footer className="mt-auto border-t border-border bg-muted/30 px-4 py-6">
        <div className="text-center text-sm text-muted-foreground">
          © 2026 FundiHub. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
