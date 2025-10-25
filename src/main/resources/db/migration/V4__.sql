ALTER TABLE task
    DROP CONSTRAINT fk_task_on_profile;

ALTER TABLE task
    DROP COLUMN profile_id;