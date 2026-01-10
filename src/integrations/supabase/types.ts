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
      admin_credentials: {
        Row: {
          created_at: string | null
          display_name: string | null
          failed_attempts: number | null
          id: string
          last_login_at: string | null
          locked_until: string | null
          password_hash: string
          updated_at: string | null
          user_id: string | null
          username: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          failed_attempts?: number | null
          id?: string
          last_login_at?: string | null
          locked_until?: string | null
          password_hash: string
          updated_at?: string | null
          user_id?: string | null
          username: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          failed_attempts?: number | null
          id?: string
          last_login_at?: string | null
          locked_until?: string | null
          password_hash?: string
          updated_at?: string | null
          user_id?: string | null
          username?: string
        }
        Relationships: []
      }
      admin_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["admin_role"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          created_at: string | null
          device_fingerprint: string
          expires_at: string
          id: string
          ip_address: unknown
          is_active: boolean | null
          last_activity: string | null
          location: Json | null
          requires_reauth: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device_fingerprint: string
          expires_at: string
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_activity?: string | null
          location?: Json | null
          requires_reauth?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device_fingerprint?: string
          expires_at?: string
          id?: string
          ip_address?: unknown
          is_active?: boolean | null
          last_activity?: string | null
          location?: Json | null
          requires_reauth?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      demo_accesses: {
        Row: {
          accessed_at: string | null
          demo_link_id: string | null
          device_fingerprint: string | null
          id: string
          ip_address: unknown
          location: Json | null
          modules_accessed: string[] | null
          user_agent: string | null
        }
        Insert: {
          accessed_at?: string | null
          demo_link_id?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: unknown
          location?: Json | null
          modules_accessed?: string[] | null
          user_agent?: string | null
        }
        Update: {
          accessed_at?: string | null
          demo_link_id?: string | null
          device_fingerprint?: string | null
          id?: string
          ip_address?: unknown
          location?: Json | null
          modules_accessed?: string[] | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "demo_accesses_demo_link_id_fkey"
            columns: ["demo_link_id"]
            isOneToOne: false
            referencedRelation: "demo_links"
            referencedColumns: ["id"]
          },
        ]
      }
      demo_links: {
        Row: {
          allowed_modules: string[] | null
          created_at: string | null
          created_by: string | null
          current_uses: number | null
          device_restrictions: Json | null
          expires_at: string
          geo_restrictions: Json | null
          id: string
          is_revoked: boolean | null
          max_uses: number | null
          metadata: Json | null
          token: string
        }
        Insert: {
          allowed_modules?: string[] | null
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          device_restrictions?: Json | null
          expires_at: string
          geo_restrictions?: Json | null
          id?: string
          is_revoked?: boolean | null
          max_uses?: number | null
          metadata?: Json | null
          token: string
        }
        Update: {
          allowed_modules?: string[] | null
          created_at?: string | null
          created_by?: string | null
          current_uses?: number | null
          device_restrictions?: Json | null
          expires_at?: string
          geo_restrictions?: Json | null
          id?: string
          is_revoked?: boolean | null
          max_uses?: number | null
          metadata?: Json | null
          token?: string
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
      dentaxy_modules: {
        Row: {
          classification_level: string | null
          created_at: string | null
          description: string | null
          display_name: string
          icon: string | null
          id: string
          is_enabled: boolean | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          classification_level?: string | null
          created_at?: string | null
          description?: string | null
          display_name: string
          icon?: string | null
          id?: string
          is_enabled?: boolean | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          classification_level?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string
          icon?: string | null
          id?: string
          is_enabled?: boolean | null
          name?: string
          status?: string | null
          updated_at?: string | null
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
      student_access_zones: {
        Row: {
          access_window_end: string | null
          access_window_start: string | null
          created_at: string | null
          geo_polygon: Json
          id: string
          institution: string | null
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          access_window_end?: string | null
          access_window_start?: string | null
          created_at?: string | null
          geo_polygon: Json
          id?: string
          institution?: string | null
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          access_window_end?: string | null
          access_window_start?: string | null
          created_at?: string | null
          geo_polygon?: Json
          id?: string
          institution?: string | null
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      student_chat_blocks: {
        Row: {
          blocked_at: string | null
          blocked_by: string | null
          expires_at: string | null
          id: string
          is_permanent: boolean | null
          reason: string | null
          user_id: string
          zone_id: string | null
        }
        Insert: {
          blocked_at?: string | null
          blocked_by?: string | null
          expires_at?: string | null
          id?: string
          is_permanent?: boolean | null
          reason?: string | null
          user_id: string
          zone_id?: string | null
        }
        Update: {
          blocked_at?: string | null
          blocked_by?: string | null
          expires_at?: string | null
          id?: string
          is_permanent?: boolean | null
          reason?: string | null
          user_id?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_chat_blocks_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "student_access_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      student_chat_messages: {
        Row: {
          content: string
          created_at: string | null
          deleted_at: string | null
          deleted_by: string | null
          id: string
          is_deleted: boolean | null
          user_id: string | null
          zone_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean | null
          user_id?: string | null
          zone_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          deleted_at?: string | null
          deleted_by?: string | null
          id?: string
          is_deleted?: boolean | null
          user_id?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_chat_messages_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "student_access_zones"
            referencedColumns: ["id"]
          },
        ]
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
      system_state: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
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
      webauthn_credentials: {
        Row: {
          counter: number | null
          created_at: string | null
          credential_id: string
          device_name: string | null
          id: string
          last_used_at: string | null
          public_key: string
          transports: string[] | null
          user_id: string
        }
        Insert: {
          counter?: number | null
          created_at?: string | null
          credential_id: string
          device_name?: string | null
          id?: string
          last_used_at?: string | null
          public_key: string
          transports?: string[] | null
          user_id: string
        }
        Update: {
          counter?: number | null
          created_at?: string | null
          credential_id?: string
          device_name?: string | null
          id?: string
          last_used_at?: string | null
          public_key?: string
          transports?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_kill_switch: {
        Args: { admin_user_id: string }
        Returns: undefined
      }
      check_rate_limit: {
        Args: {
          p_action: string
          p_identifier: string
          p_limit: number
          p_window_minutes?: number
        }
        Returns: boolean
      }
      deactivate_kill_switch: {
        Args: { admin_user_id: string }
        Returns: undefined
      }
      get_admin_by_username: { Args: { p_username: string }; Returns: string }
      get_admin_role: { Args: { user_uuid: string }; Returns: string }
      get_current_user_role: { Args: never; Returns: string }
      get_user_role: { Args: { user_uuid: string }; Returns: string }
      increment_copy_clicks: { Args: never; Returns: undefined }
      increment_user_daily_activity: {
        Args: { p_at?: string; p_seconds: number }
        Returns: undefined
      }
      is_admin: { Args: { user_uuid: string }; Returns: boolean }
      is_super_admin: { Args: { user_uuid: string }; Returns: boolean }
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
      system_manage_rate_limit: { Args: never; Returns: boolean }
      update_active_users_count: {
        Args: { new_count: number }
        Returns: undefined
      }
      verify_admin_login: {
        Args: { p_password: string; p_username: string }
        Returns: {
          admin_id: string
          display_name: string
          error_message: string
          success: boolean
        }[]
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "observer"
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
    Enums: {
      admin_role: ["super_admin", "admin", "observer"],
    },
  },
} as const
