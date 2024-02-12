-- AddForeignKey
ALTER TABLE
    "events" DROP CONSTRAINT "events_organizer_id_fkey",
ADD
    CONSTRAINT "events_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "tickets" DROP CONSTRAINT "tickets_event_id_fkey",
ADD
    CONSTRAINT "tickets_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "reviews" DROP CONSTRAINT "reviews_event_id_fkey",
ADD
    CONSTRAINT "reviews_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "reviews" DROP CONSTRAINT "reviews_user_id_fkey",
ADD
    CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE
    "refresh_token" DROP CONSTRAINT "refresh_token_user_id_fkey",
ADD
    CONSTRAINT "refresh_token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE;