USE fraudfishing;

-- user
CREATE TABLE user (
  id             BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name           VARCHAR(80)      NOT NULL,
  email          VARCHAR(50)      NOT NULL,
  password_hash  VARCHAR(255)     NOT NULL,
  salt           VARCHAR(255)     NOT NULL,
  is_admin       TINYINT(1)       NOT NULL DEFAULT 0,
  created_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- category
CREATE TABLE category (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name         VARCHAR(50)     NOT NULL,
  description  TEXT            NULL,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- status
CREATE TABLE status (
  id    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name  VARCHAR(20)     NOT NULL,
  PRIMARY KEY (id)
);

-- report
CREATE TABLE report (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id      BIGINT UNSIGNED NOT NULL,
  category_id  BIGINT UNSIGNED NOT NULL,
  title        VARCHAR(100)     NOT NULL,
  description  TEXT            NOT NULL,
  url          VARCHAR(255)    NOT NULL,
  status_id    BIGINT UNSIGNED NOT NULL,
  image_url    VARCHAR(255)    NULL,
  created_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id)     REFERENCES user(id),
  FOREIGN KEY (category_id) REFERENCES category(id),
  FOREIGN KEY (status_id)   REFERENCES status(id)
);

-- report_status_history
CREATE TABLE report_status_history (
  id           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  report_id    BIGINT UNSIGNED NOT NULL,
  from_status  BIGINT UNSIGNED NULL,
  to_status    BIGINT UNSIGNED NOT NULL,
  note         VARCHAR(255)    NULL,
  changed_at   TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  changed_by   BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (report_id)   REFERENCES report(id),
  FOREIGN KEY (from_status) REFERENCES status(id),
  FOREIGN KEY (to_status)   REFERENCES status(id),
  FOREIGN KEY (changed_by)  REFERENCES user(id)
);

-- tag
CREATE TABLE tag (
  id       BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name     VARCHAR(30)     NOT NULL,
  use_num  INT             NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
);

-- report_has_tag (PK compuesta)
CREATE TABLE report_has_tag (
  report_id  BIGINT UNSIGNED NOT NULL,
  tag_id     BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (report_id, tag_id),
  FOREIGN KEY (report_id) REFERENCES report(id),
  FOREIGN KEY (tag_id)    REFERENCES tag(id)
);

-- notifications (mínima)
CREATE TABLE notifications (
  id         BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    BIGINT UNSIGNED NOT NULL,
  seen       TINYINT(1)      NOT NULL DEFAULT 0,
  created_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (user_id) REFERENCES user(id)
);
