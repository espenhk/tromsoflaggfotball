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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_notification_recipients: {
        Row: {
          active: boolean
          created_at: string
          email: string
          id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          id?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          id?: string
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          body_md_en: string | null
          body_md_no: string
          created_at: string
          id: string
          key: string
          kind: string
          page: string
          sort_order: number
          title_en: string | null
          title_no: string | null
          updated_at: string
          visible: boolean
        }
        Insert: {
          body_md_en?: string | null
          body_md_no?: string
          created_at?: string
          id?: string
          key: string
          kind: string
          page: string
          sort_order?: number
          title_en?: string | null
          title_no?: string | null
          updated_at?: string
          visible?: boolean
        }
        Update: {
          body_md_en?: string | null
          body_md_no?: string
          created_at?: string
          id?: string
          key?: string
          kind?: string
          page?: string
          sort_order?: number
          title_en?: string | null
          title_no?: string | null
          updated_at?: string
          visible?: boolean
        }
        Relationships: []
      }
      ig_post_exports: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          kind: string
          name: string
          payload: Json
          photos_dropped: boolean
          slide_count: number
          templates: string[] | null
          updated_at: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          kind?: string
          name: string
          payload: Json
          photos_dropped?: boolean
          slide_count?: number
          templates?: string[] | null
          updated_at?: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          kind?: string
          name?: string
          payload?: Json
          photos_dropped?: boolean
          slide_count?: number
          templates?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      matches: {
        Row: {
          away_color: string | null
          away_logo: string | null
          away_name: string
          away_score: number | null
          away_tag: string | null
          created_at: string
          home_color: string | null
          home_logo: string | null
          home_name: string
          home_score: number | null
          home_tag: string | null
          id: string
          kicks_off_at: string
          notes: string | null
          round_label: string | null
          updated_at: string
          venue: string | null
        }
        Insert: {
          away_color?: string | null
          away_logo?: string | null
          away_name: string
          away_score?: number | null
          away_tag?: string | null
          created_at?: string
          home_color?: string | null
          home_logo?: string | null
          home_name: string
          home_score?: number | null
          home_tag?: string | null
          id?: string
          kicks_off_at: string
          notes?: string | null
          round_label?: string | null
          updated_at?: string
          venue?: string | null
        }
        Update: {
          away_color?: string | null
          away_logo?: string | null
          away_name?: string
          away_score?: number | null
          away_tag?: string | null
          created_at?: string
          home_color?: string | null
          home_logo?: string | null
          home_name?: string
          home_score?: number | null
          home_tag?: string | null
          id?: string
          kicks_off_at?: string
          notes?: string | null
          round_label?: string | null
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          id: string
          reveal_mode: boolean
          theme: string
          updated_at: string
        }
        Insert: {
          id: string
          reveal_mode?: boolean
          theme?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reveal_mode?: boolean
          theme?: string
          updated_at?: string
        }
        Relationships: []
      }
      social_posts_cache: {
        Row: {
          caption: string
          comments: number | null
          fetched_at: string
          id: string
          image: string | null
          likes: number | null
          permalink: string
          raw: Json | null
          source: string
          timestamp: string
        }
        Insert: {
          caption?: string
          comments?: number | null
          fetched_at?: string
          id: string
          image?: string | null
          likes?: number | null
          permalink: string
          raw?: Json | null
          source: string
          timestamp: string
        }
        Update: {
          caption?: string
          comments?: number | null
          fetched_at?: string
          id?: string
          image?: string | null
          likes?: number | null
          permalink?: string
          raw?: Json | null
          source?: string
          timestamp?: string
        }
        Relationships: []
      }
      training_signups: {
        Row: {
          age_group: string | null
          coach_notes: string | null
          contact: string
          created_at: string
          id: string
          language: string
          message: string | null
          name: string
          preferred_date: string | null
        }
        Insert: {
          age_group?: string | null
          coach_notes?: string | null
          contact: string
          created_at?: string
          id?: string
          language?: string
          message?: string | null
          name: string
          preferred_date?: string | null
        }
        Update: {
          age_group?: string | null
          coach_notes?: string | null
          contact?: string
          created_at?: string
          id?: string
          language?: string
          message?: string | null
          name?: string
          preferred_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ig_post_extract_templates: { Args: { p: Json }; Returns: string[] }
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
