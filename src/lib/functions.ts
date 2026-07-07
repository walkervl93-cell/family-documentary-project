import { supabase } from './supabase'

const FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL
  ? `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`
  : ''

export interface CreateCheckoutInput {
  packageType: string
  addons: string[]
  slotId: string
  scheduledAt: string
  clientEmail: string
  origin: string
  intake: {
    storytellerName: string
    relationship: string
    bestContact?: string
    topics?: string
    sensitiveTopics?: string
    preferredLanguage?: string
  }
}

export async function createCheckoutSession(input: CreateCheckoutInput) {
  const { data, error } = await supabase.functions.invoke<{ url: string; bookingId: string }>(
    'stripe-checkout',
    { body: input },
  )
  if (error) throw error
  if (!data) throw new Error('No response from checkout function')
  return data
}

export async function getBookingStatus(bookingId: string, sessionId: string) {
  const res = await fetch(
    `${FUNCTIONS_URL}/booking-status?booking_id=${bookingId}&session_id=${sessionId}`,
    { headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY } },
  )
  if (!res.ok) throw new Error('Could not fetch booking status')
  return res.json() as Promise<{
    status: string
    scheduledAt: string
    callLink: string | null
    clientEmail: string
  }>
}
