CREATE TABLE task_soldier
(
    soldier_id BIGINT NOT NULL,
    task_id    BIGINT NOT NULL,
    CONSTRAINT pk_task_soldier PRIMARY KEY (soldier_id, task_id)
);

ALTER TABLE task_soldier
    ADD CONSTRAINT fk_tassol_on_soldier FOREIGN KEY (soldier_id) REFERENCES soldier (id);

ALTER TABLE task_soldier
    ADD CONSTRAINT fk_tassol_on_task FOREIGN KEY (task_id) REFERENCES task (id);