ALTER TABLE task
    ADD end_time VARCHAR(255);

ALTER TABLE task
    ADD start_time VARCHAR(255);

ALTER TABLE task
    DROP COLUMN "end";

ALTER TABLE task
    DROP COLUMN start;