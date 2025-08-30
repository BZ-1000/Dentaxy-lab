export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_button_usage: {
        Row: {
          clicked_at: string
          date: string
          id: string
          section_name: string
          user_id: string
        }
        Insert: {
          clicked_at?: string
          date?: string
          id?: string
          section_name: string
          user_id: string
        }
        Update: {
          clicked_at?: string
          date?: string
          id?: string
          section_name?: string
          user_id?: string
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      dental_terms: {
        Row: {
          categoria: string
          contexto_uso: string | null
          created_at: string
          definicion: string
          id: string
          seccion_formulario: string
          sinonimos: string[] | null
          subcategoria: string | null
          termino: string
          updated_at: string
        }
        Insert: {
          categoria: string
          contexto_uso?: string | null
          created_at?: string
          definicion: string
          id?: string
          seccion_formulario: string
          sinonimos?: string[] | null
          subcategoria?: string | null
          termino: string
          updated_at?: string
        }
        Update: {
          categoria?: string
          contexto_uso?: string | null
          created_at?: string
          definicion?: string
          id?: string
          seccion_formulario?: string
          sinonimos?: string[] | null
          subcategoria?: string | null
          termino?: string
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          created_at: string
          donor_name: string
          id: string
          message: string | null
          session_id: string | null
        }
        Insert: {
          amount?: number
          created_at?: string
          donor_name: string
          id?: string
          message?: string | null
          session_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          donor_name?: string
          id?: string
          message?: string | null
          session_id?: string | null
        }
        Relationships: []
      }
      educational_resources: {
        Row: {
          author: string | null
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          publication_date: string | null
          title: string
          type: string
          updated_at: string
          url: string | null
        }
        Insert: {
          author?: string | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          publication_date?: string | null
          title: string
          type: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          author?: string | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          publication_date?: string | null
          title?: string
          type?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      medical_events: {
        Row: {
          created_at: string
          description: string | null
          event_date: string
          event_type: string
          id: string
          is_completed: boolean | null
          notification_settings: Json | null
          patient_info: Json | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          event_date: string
          event_type: string
          id?: string
          is_completed?: boolean | null
          notification_settings?: Json | null
          patient_info?: Json | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          event_date?: string
          event_type?: string
          id?: string
          is_completed?: boolean | null
          notification_settings?: Json | null
          patient_info?: Json | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          advance_times: number[] | null
          browser_enabled: boolean | null
          created_at: string
          email_enabled: boolean | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          advance_times?: number[] | null
          browser_enabled?: boolean | null
          created_at?: string
          email_enabled?: boolean | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          advance_times?: number[] | null
          browser_enabled?: boolean | null
          created_at?: string
          email_enabled?: boolean | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      platform_metrics: {
        Row: {
          id: string
          metric_name: string
          metric_value: number
          updated_at: string
        }
        Insert: {
          id?: string
          metric_name: string
          metric_value?: number
          updated_at?: string
        }
        Update: {
          id?: string
          metric_name?: string
          metric_value?: number
          updated_at?: string
        }
        Relationships: []
      }
      platform_updates: {
        Row: {
          created_at: string
          description: string
          id: string
          release_date: string
          title: string
          version: string
        }
        Insert: {
          created_at?: string
          description: string
          id?: string
          release_date?: string
          title: string
          version: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          release_date?: string
          title?: string
          version?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          count: number | null
          created_at: string | null
          id: string
          identifier: string
          window_start: string | null
        }
        Insert: {
          action: string
          count?: number | null
          created_at?: string | null
          id?: string
          identifier: string
          window_start?: string | null
        }
        Update: {
          action?: string
          count?: number | null
          created_at?: string | null
          id?: string
          identifier?: string
          window_start?: string | null
        }
        Relationships: []
      }
      secrets: {
        Row: {
          created_at: string
          name: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          name: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          name?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          plan_type: string | null
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          plan_type?: string | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          plan_type?: string | null
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      usage_limits: {
        Row: {
          ai_generations_used: number
          created_at: string
          histories_generated: number
          id: string
          max_ai_generations: number
          max_histories: number
          period_end: string
          period_start: string
          plan_type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          ai_generations_used?: number
          created_at?: string
          histories_generated?: number
          id?: string
          max_ai_generations?: number
          max_histories?: number
          period_end: string
          period_start?: string
          plan_type: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          ai_generations_used?: number
          created_at?: string
          histories_generated?: number
          id?: string
          max_ai_generations?: number
          max_histories?: number
          period_end?: string
          period_start?: string
          plan_type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_activity_sessions: {
        Row: {
          created_at: string
          date: string
          duration_minutes: number | null
          id: string
          session_end: string | null
          session_start: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          duration_minutes?: number | null
          id?: string
          session_end?: string | null
          session_start?: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          duration_minutes?: number | null
          id?: string
          session_end?: string | null
          session_start?: string
          user_id?: string
        }
        Relationships: []
      }
      user_daily_activity: {
        Row: {
          activity_date: string
          created_at: string
          first_session_at: string | null
          id: string
          total_seconds: number
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_date?: string
          created_at?: string
          first_session_at?: string | null
          id?: string
          total_seconds?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_date?: string
          created_at?: string
          first_session_at?: string | null
          id?: string
          total_seconds?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_plans: {
        Row: {
          created_at: string
          id: string
          plan_type: string
        }
        Insert: {
          created_at?: string
          id: string
          plan_type: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_type?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          id: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          username?: string
        }
        Relationships: []
      }
      user_ratings: {
        Row: {
          created_at: string
          feedback: string | null
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_rate_limit: {
        Args: {
          p_action: string
          p_identifier: string
          p_limit: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_user_role: {
        Args: { user_uuid: string }
        Returns: string
      }
      increment_copy_clicks: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      increment_user_daily_activity: {
        Args: { p_at?: string; p_seconds: number }
        Returns: undefined
      }
      log_audit_event: {
        Args: {
          p_action: string
          p_details?: Json
          p_ip_address?: unknown
          p_resource_id?: string
          p_resource_type: string
          p_user_agent?: string
          p_user_id: string
        }
        Returns: undefined
      }
      system_manage_rate_limit: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_active_users_count: {
        Args: { new_count: number }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
