/*
  # Tır Şoförleri Platform - Initial Database Schema

  ## Genel Bakış
  Bu migrasyon tır şoförleri için sosyal platform ve iş bulma uygulamasının
  temel veritabanı yapısını oluşturur.

  ## Yeni Tablolar
  
  ### 1. profiles - Kullanıcı Profilleri
  ### 2. vehicles - Araç Bilgileri
  ### 3. job_listings - İş İlanları
  ### 4. bids - Teklifler
  ### 5. conversations - Sohbet Odaları
  ### 6. messages - Mesajlar
  ### 7. vehicle_locations - GPS Geçmişi

  ## Güvenlik
  Tüm tablolarda Row Level Security etkinleştirilmiştir
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  phone text,
  is_plus_member boolean DEFAULT false,
  plus_expires_at timestamptz,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plate_number text NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  current_lat numeric,
  current_lng numeric,
  is_tracking_enabled boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create job_listings table
CREATE TABLE IF NOT EXISTS job_listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  origin_city text NOT NULL,
  origin_lat numeric NOT NULL,
  origin_lng numeric NOT NULL,
  destination_city text NOT NULL,
  destination_lat numeric NOT NULL,
  destination_lng numeric NOT NULL,
  cargo_type text NOT NULL,
  cargo_weight numeric NOT NULL,
  price numeric NOT NULL,
  currency text DEFAULT 'TRY',
  departure_date date NOT NULL,
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bids table
CREATE TABLE IF NOT EXISTS bids (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES job_listings(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, user_id)
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  participant_2_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  CHECK (participant_1_id < participant_2_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create vehicle_locations table
CREATE TABLE IF NOT EXISTS vehicle_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  speed numeric DEFAULT 0,
  heading numeric DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_job_listings_user_id ON job_listings(user_id);
CREATE INDEX IF NOT EXISTS idx_job_listings_status ON job_listings(status);
CREATE INDEX IF NOT EXISTS idx_bids_job_id ON bids(job_id);
CREATE INDEX IF NOT EXISTS idx_bids_user_id ON bids(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_vehicle_locations_vehicle_id ON vehicle_locations(vehicle_id);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_locations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Vehicles policies
CREATE POLICY "Users can manage own vehicles"
  ON vehicles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Job listings policies
CREATE POLICY "Anyone can view job listings"
  ON job_listings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "PLUS members can create jobs"
  ON job_listings FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_plus_member = true
    )
  );

CREATE POLICY "Users can update own jobs"
  ON job_listings FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own jobs"
  ON job_listings FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Bids policies
CREATE POLICY "Job owner and bidder can view bids"
  ON bids FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    auth.uid() IN (SELECT user_id FROM job_listings WHERE job_listings.id = bids.job_id)
  );

CREATE POLICY "PLUS members can create bids"
  ON bids FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_plus_member = true
    )
  );

-- Conversations policies
CREATE POLICY "Participants can view conversations"
  ON conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = participant_1_id OR auth.uid() = participant_2_id);

CREATE POLICY "PLUS members can create conversations"
  ON conversations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_plus_member = true
    )
  );

-- Messages policies
CREATE POLICY "Participants can view messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    conversation_id IN (
      SELECT id FROM conversations
      WHERE participant_1_id = auth.uid() OR participant_2_id = auth.uid()
    )
  );

CREATE POLICY "PLUS members can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.is_plus_member = true
    )
    AND auth.uid() = sender_id
  );

-- Vehicle locations policies
CREATE POLICY "Vehicle owner can manage locations"
  ON vehicle_locations FOR ALL
  TO authenticated
  USING (vehicle_id IN (SELECT id FROM vehicles WHERE user_id = auth.uid()))
  WITH CHECK (vehicle_id IN (SELECT id FROM vehicles WHERE user_id = auth.uid()));

-- Function to handle new user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();