-- Fix extension versions by updating to latest versions
ALTER EXTENSION IF EXISTS "uuid-ossp" UPDATE;
ALTER EXTENSION IF EXISTS "pgcrypto" UPDATE; 
ALTER EXTENSION IF EXISTS "pgjwt" UPDATE;