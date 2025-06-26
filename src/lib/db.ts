import { createClient, SupabaseClient } from '@supabase/supabase-js';

import { Database } from '@/types/supabase.types';
import {
  Availability,
  encodeAvailabilityList,
  decodeAvailabilityString,
} from '@/lib/availability';

type User = Database['public']['Tables']['users']['Row'];
type Event = Database['public']['Tables']['events']['Row'];
type EventUser = Database['public']['Tables']['event_users']['Row'];
type WeeklyAvailability =
  Database['public']['Tables']['weekly_availabilities']['Row'];

class DbClient {
  private client: SupabaseClient<Database>;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
    this.client = createClient<Database>(supabaseUrl, supabaseKey);
  }

  async getAllUserNames(): Promise<string[]> {
    const { data, error } = await this.client
      .from('users')
      .select('name')
      .order('name', { ascending: true });
    if (error) throw error;
    return data.map((x) => x.name);
  }

  async updateWeeklyAvailability(
    user_id: number,
    start_day: string,
    avails: Availability[]
  ) {
    const avail_string = encodeAvailabilityList(avails);
    const { error } = await this.client.from('weekly_availabilities').upsert({
      availability: avail_string,
      start_day: start_day,
      user_id: user_id,
    });
    if (error) throw error;
  }

  async getWeeklyAvailability(
    user_id: number,
    start_day: string
  ): Promise<Availability[]> {
    const { data, error } = await this.client
      .from('weekly_availabilities')
      .select('availability')
      .eq('user_id', user_id)
      .eq('start_day', start_day);
    if (error) throw error;
    return decodeAvailabilityString(data[0].availability);
  }

  // each row is a week
  // strategy: get the month, start, end of day, get all relevant sundays
  // async getMonthlyAvailability(user_id: number, start_day: string): Promise<Availability[][]> {
  // }
}

export const dbClient = new DbClient();
