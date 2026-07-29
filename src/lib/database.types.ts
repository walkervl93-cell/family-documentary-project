export type InquiryStatus = 'new' | 'contacted' | 'booked' | 'closed'
export type InquiryService = 'documentary' | 'guided_session'
export type PickupStatus = 'new' | 'scheduled' | 'completed' | 'closed'
export type BookingStatus =
  | 'consult_scheduled'
  | 'payment_requested'
  | 'pending_payment'
  | 'booked'
  | 'interview_completed'
  | 'media_received'
  | 'in_editing'
  | 'ready_for_review'
  | 'delivered'
  | 'canceled'
export type BookingServiceType = 'documentary' | 'guided_session' | 'audio'
export type ConsultType = 'phone' | 'video'
export type ProfileRole = 'client' | 'admin' | 'interviewer'
export type MediaSource = 'upload' | 'mail-in'
export type RescheduleStatus = 'pending' | 'approved' | 'denied'

export interface Database {
  public: {
    Tables: {
      inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          location: string | null
          timeline: string | null
          message: string | null
          status: InquiryStatus
          service: InquiryService
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['inquiries']['Row'], 'id' | 'status' | 'service' | 'created_at'> & {
          id?: string
          status?: InquiryStatus
          service?: InquiryService
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['inquiries']['Insert']>
        Relationships: []
      }
      pickup_requests: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          location: string | null
          media_types: string[] | null
          media_count: string | null
          preferred_time_slot: string | null
          status: PickupStatus
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['pickup_requests']['Row'], 'id' | 'status' | 'created_at'> & {
          id?: string
          status?: PickupStatus
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['pickup_requests']['Insert']>
        Relationships: []
      }
      bookings: {
        Row: {
          id: string
          client_id: string | null
          client_email: string
          service_type: BookingServiceType
          consult_type: ConsultType
          package_type: string | null
          addons: string[]
          status: BookingStatus
          scheduled_at: string
          interviewer_id: string | null
          slot_id: string | null
          call_link: string | null
          stripe_payment_intent_id: string | null
          stripe_checkout_session_id: string | null
          amount_paid: number | null
          payment_link_url: string | null
          payment_amount: number | null
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['bookings']['Row'],
          | 'id'
          | 'client_id'
          | 'interviewer_id'
          | 'status'
          | 'created_at'
          | 'call_link'
          | 'stripe_payment_intent_id'
          | 'stripe_checkout_session_id'
          | 'amount_paid'
          | 'payment_link_url'
          | 'payment_amount'
          | 'package_type'
          | 'addons'
        > & {
          id?: string
          client_id?: string | null
          interviewer_id?: string | null
          status?: BookingStatus
          created_at?: string
          call_link?: string | null
          stripe_payment_intent_id?: string | null
          stripe_checkout_session_id?: string | null
          amount_paid?: number | null
          payment_link_url?: string | null
          payment_amount?: number | null
          package_type?: string | null
          addons?: string[]
        }
        Update: Partial<Database['public']['Tables']['bookings']['Insert']>
        Relationships: []
      }
      intake_forms: {
        Row: {
          id: string
          booking_id: string
          storyteller_name: string
          relationship: string
          best_contact: string | null
          topics: string | null
          sensitive_topics: string | null
          preferred_language: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['intake_forms']['Row'], 'id' | 'created_at'> & {
          id?: string
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['intake_forms']['Insert']>
        Relationships: []
      }
      media_uploads: {
        Row: {
          id: string
          booking_id: string
          file_url: string | null
          file_type: string | null
          uploaded_at: string
          source: MediaSource
          shipping_tracking_number: string | null
        }
        Insert: Omit<Database['public']['Tables']['media_uploads']['Row'], 'id' | 'uploaded_at'> & {
          id?: string
          uploaded_at?: string
        }
        Update: Partial<Database['public']['Tables']['media_uploads']['Insert']>
        Relationships: []
      }
      deliverables: {
        Row: {
          id: string
          booking_id: string
          file_url: string
          version: number
          delivered_at: string
          revision_requested: boolean
        }
        Insert: Omit<Database['public']['Tables']['deliverables']['Row'], 'id' | 'delivered_at'> & {
          id?: string
          delivered_at?: string
        }
        Update: Partial<Database['public']['Tables']['deliverables']['Insert']>
        Relationships: []
      }
      availability_slots: {
        Row: {
          id: string
          interviewer_id: string | null
          start_time: string
          end_time: string
          is_booked: boolean
        }
        Insert: Omit<Database['public']['Tables']['availability_slots']['Row'], 'id' | 'is_booked'> & {
          id?: string
          is_booked?: boolean
        }
        Update: Partial<Database['public']['Tables']['availability_slots']['Insert']>
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          role: ProfileRole
          name: string | null
          phone: string | null
        }
        Insert: Database['public']['Tables']['profiles']['Row']
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
        Relationships: []
      }
      reschedule_requests: {
        Row: {
          id: string
          booking_id: string
          requested_time: string | null
          reason: string | null
          status: RescheduleStatus
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['reschedule_requests']['Row'], 'id' | 'status' | 'created_at'> & {
          id?: string
          status?: RescheduleStatus
          created_at?: string
        }
        Update: Partial<Database['public']['Tables']['reschedule_requests']['Insert']>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      claim_bookings: {
        Args: Record<string, never>
        Returns: void
      }
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      book_consult: {
        Args: {
          p_slot_id: string
          p_client_email: string
          p_service_type: BookingServiceType
          p_consult_type: ConsultType
          p_storyteller_name: string
          p_relationship: string
          p_best_contact: string | null
          p_topics: string | null
          p_sensitive_topics: string | null
          p_preferred_language: string | null
        }
        Returns: string
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
