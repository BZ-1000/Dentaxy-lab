
import { Database as OriginalDatabase } from "@/integrations/supabase/types";

declare global {
  type Database = OriginalDatabase & {
    public: {
      Tables: {
        profiles: {
          Row: {
            id: string
            username: string | null
            updated_at: string | null
          }
          Insert: {
            id: string
            username?: string | null
            updated_at?: string | null
          }
          Update: {
            id?: string
            username?: string | null
            updated_at?: string | null
          }
          Relationships: [
            {
              foreignKeyName: "profiles_id_fkey"
              columns: ["id"]
              isOneToOne: true
              referencedRelation: "users"
              referencedColumns: ["id"]
            }
          ]
        }
      }
    }
  }
}

// Re-export to make it available
export type { Database }
