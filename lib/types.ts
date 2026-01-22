

export type Poll = {
  id: string;
  question: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  yes_votes?: number;
  no_votes?: number;
  total_votes?: number;
  creator_device_id?: string;
};

export type Vote = {
  id: string;
  poll_id: string;
  vote_value: boolean;
  created_at: string;
};
