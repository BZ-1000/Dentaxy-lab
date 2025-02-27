
import { Database as OriginalDatabase } from '@/integrations/supabase/types';

type CustomTables = {
  user_plans: {
    Row: {
      id: string
      plan_type: string
      created_at: string
    }
    Insert: {
      id: string
      plan_type: string
      created_at?: string
    }
    Update: {
      id?: string
      plan_type?: string
      created_at?: string
    }
    Relationships: []
  }
}

export type Database = OriginalDatabase & {
  public: {
    Tables: OriginalDatabase['public']['Tables'] & CustomTables
  }
}
