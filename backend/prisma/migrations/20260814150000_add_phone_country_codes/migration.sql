-- Store the international dialing prefix separately from the 10-digit local number.
ALTER TABLE "users" ADD COLUMN "countryCode" TEXT;
ALTER TABLE "leads" ADD COLUMN "countryCode" TEXT;
