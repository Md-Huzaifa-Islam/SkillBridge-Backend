CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'STUDENT', 'TUTOR');

CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'BANNED');

ALTER TABLE "user" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
ADD COLUMN     "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE';
-- Migration file removed: better_auth no longer used
ALTER TABLE "user" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'STUDENT',
