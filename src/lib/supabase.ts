export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5";
  };
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      darn_campaigns: {
        Row: {
          created_at: string | null;
          givebutter_campaign_id: string | null;
          id: string;
          is_active: boolean | null;
          label: string | null;
          school_name: string;
          zeffy_campaign_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          givebutter_campaign_id?: string | null;
          id?: string;
          is_active?: boolean | null;
          label?: string | null;
          school_name: string;
          zeffy_campaign_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          givebutter_campaign_id?: string | null;
          id?: string;
          is_active?: boolean | null;
          label?: string | null;
          school_name?: string;
          zeffy_campaign_id?: string | null;
        };
        Relationships: [];
      };
      darn_payments: {
        Row: {
          amount: number | null;
          campaign_id: string | null;
          created_at: string | null;
          currency: string | null;
          donor_email: string | null;
          id: string;
          raw_payload: Json | null;
          source: string;
          status: string | null;
          updated_at: string | null;
        };
        Insert: {
          amount?: number | null;
          campaign_id?: string | null;
          created_at?: string | null;
          currency?: string | null;
          donor_email?: string | null;
          id: string;
          raw_payload?: Json | null;
          source: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Update: {
          amount?: number | null;
          campaign_id?: string | null;
          created_at?: string | null;
          currency?: string | null;
          donor_email?: string | null;
          id?: string;
          raw_payload?: Json | null;
          source?: string;
          status?: string | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      darn_portal_profiles: {
        Row: {
          auth_user_id: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          is_active: boolean;
          role: Database["public"]["Enums"]["darn_app_role"];
          school_name: string | null;
        };
        Insert: {
          auth_user_id?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id?: string;
          is_active?: boolean;
          role?: Database["public"]["Enums"]["darn_app_role"];
          school_name?: string | null;
        };
        Update: {
          auth_user_id?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          is_active?: boolean;
          role?: Database["public"]["Enums"]["darn_app_role"];
          school_name?: string | null;
        };
        Relationships: [];
      };
      darn_portal_ticket_admin_details: {
        Row: {
          estimated_support_amount: number | null;
          fulfillment_notes: string | null;
          internal_notes: string | null;
          ticket_id: string;
          updated_at: string;
        };
        Insert: {
          estimated_support_amount?: number | null;
          fulfillment_notes?: string | null;
          internal_notes?: string | null;
          ticket_id: string;
          updated_at?: string;
        };
        Update: {
          estimated_support_amount?: number | null;
          fulfillment_notes?: string | null;
          internal_notes?: string | null;
          ticket_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "darn_portal_ticket_admin_details_ticket_id_fkey";
            columns: ["ticket_id"];
            isOneToOne: true;
            referencedRelation: "darn_portal_tickets";
            referencedColumns: ["id"];
          },
        ];
      };
      darn_portal_tickets: {
        Row: {
          assistance_details: string | null;
          assistance_reason: Database["public"]["Enums"]["darn_ticket_assistance_reason"];
          assistance_type: Database["public"]["Enums"]["darn_ticket_assistance_type"];
          created_at: string;
          created_by_profile_id: string;
          family_reference_code: string | null;
          id: string;
          needed_by: string | null;
          past_assistance: string | null;
          priority: Database["public"]["Enums"]["darn_ticket_priority"];
          request_details: string;
          requested_item: string;
          school_name: Database["public"]["Enums"]["school"];
          status: Database["public"]["Enums"]["darn_ticket_status"];
          updated_at: string;
        };
        Insert: {
          assistance_details?: string | null;
          assistance_reason?: Database["public"]["Enums"]["darn_ticket_assistance_reason"];
          assistance_type?: Database["public"]["Enums"]["darn_ticket_assistance_type"];
          created_at?: string;
          created_by_profile_id: string;
          family_reference_code?: string | null;
          id?: string;
          needed_by?: string | null;
          past_assistance?: string | null;
          priority?: Database["public"]["Enums"]["darn_ticket_priority"];
          request_details: string;
          requested_item: string;
          school_name?: Database["public"]["Enums"]["school"];
          status?: Database["public"]["Enums"]["darn_ticket_status"];
          updated_at?: string;
        };
        Update: {
          assistance_details?: string | null;
          assistance_reason?: Database["public"]["Enums"]["darn_ticket_assistance_reason"];
          assistance_type?: Database["public"]["Enums"]["darn_ticket_assistance_type"];
          created_at?: string;
          created_by_profile_id?: string;
          family_reference_code?: string | null;
          id?: string;
          needed_by?: string | null;
          past_assistance?: string | null;
          priority?: Database["public"]["Enums"]["darn_ticket_priority"];
          request_details?: string;
          requested_item?: string;
          school_name?: Database["public"]["Enums"]["school"];
          status?: Database["public"]["Enums"]["darn_ticket_status"];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "darn_portal_tickets_created_by_profile_id_fkey";
            columns: ["created_by_profile_id"];
            isOneToOne: false;
            referencedRelation: "darn_portal_profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          name: string;
          role: Database["public"]["Enums"]["roles"];
          school: Database["public"]["Enums"]["school"] | null;
          uuid: string;
        };
        Insert: {
          created_at?: string;
          name: string;
          role?: Database["public"]["Enums"]["roles"];
          school?: Database["public"]["Enums"]["school"] | null;
          uuid?: string;
        };
        Update: {
          created_at?: string;
          name?: string;
          role?: Database["public"]["Enums"]["roles"];
          school?: Database["public"]["Enums"]["school"] | null;
          uuid?: string;
        };
        Relationships: [];
      };
      requests: {
        Row: {
          created_at: string;
          description: string;
          id: number;
          status: Database["public"]["Enums"]["status"] | null;
          submitted_by: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id: number;
          status?: Database["public"]["Enums"]["status"] | null;
          submitted_by?: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: number;
          status?: Database["public"]["Enums"]["status"] | null;
          submitted_by?: string;
        };
        Relationships: [
          {
            foreignKeyName: "requests_submitted_by_fkey";
            columns: ["submitted_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["uuid"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      darn_app_role: "admin" | "counselor";
      darn_ticket_assistance_reason:
        | "Financial Hardship"
        | "Employment Change"
        | "Medical or Health Issue"
        | "Housing or Relocation"
        | "Family Change"
        | "Unexpected Expense"
        | "Other";
      darn_ticket_assistance_type:
        | "Utility Bill"
        | "Gift Card"
        | "Bicycle"
        | "Glasses"
        | "Clothing"
        | "Furniture"
        | "Bus Pass"
        | "Household Items"
        | "Other";
      darn_ticket_priority: "low" | "medium" | "high" | "urgent";
      darn_ticket_status:
        | "submitted"
        | "in_review"
        | "approved"
        | "fulfilled"
        | "closed"
        | "rejected";
      roles: "admin" | "counselor";
      school:
        | "Bexley High School"
        | "Bexley Middle School"
        | "Cassingham Elementary"
        | "Maryland Elementary"
        | "Montrose Elementary"
        | "Preschool"
        | "Other";
      status: "submitted" | "withdrawn" | "under review" | "declined" | "approved" | "completed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      darn_app_role: ["admin", "counselor"],
      darn_ticket_assistance_reason: [
        "Financial Hardship",
        "Employment Change",
        "Medical or Health Issue",
        "Housing or Relocation",
        "Family Change",
        "Unexpected Expense",
        "Other",
      ],
      darn_ticket_assistance_type: [
        "Utility Bill",
        "Gift Card",
        "Bicycle",
        "Glasses",
        "Clothing",
        "Furniture",
        "Bus Pass",
        "Household Items",
        "Other",
      ],
      darn_ticket_priority: ["low", "medium", "high", "urgent"],
      darn_ticket_status: ["submitted", "in_review", "approved", "fulfilled", "closed", "rejected"],
      roles: ["admin", "counselor"],
      school: [
        "Bexley High School",
        "Bexley Middle School",
        "Cassingham Elementary",
        "Maryland Elementary",
        "Montrose Elementary",
        "Preschool",
        "Other",
      ],
      status: ["submitted", "withdrawn", "under review", "declined", "approved", "completed"],
    },
  },
} as const;
