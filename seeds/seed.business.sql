-- first remove any data that may be present
TRUNCATE  business;

-- insert schedule
INSERT INTO business
  (business_name, business_password)
  VALUES
    ('G&L','$2a$12$JtJrxBevbeelnf/NUnrYb.HWnM4hlK5ne//MJzM8typchqpQV3pq6'),
    ('Mighty Fine','$2a$12$JtJrxBevbeelnf/NUnrYb.HWnM4hlK5ne//MJzM8typchqpQV3pq6'),
    ('Wendys','$2a$12$JtJrxBevbeelnf/NUnrYb.HWnM4hlK5ne//MJzM8typchqpQV3pq6'),
    ('Construction LLC','$2a$12$JtJrxBevbeelnf/NUnrYb.HWnM4hlK5ne//MJzM8typchqpQV3pq6'),
    ('Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.','$2a$12$JtJrxBevbeelnf/NUnrYb.HWnM4hlK5ne//MJzM8typchqpQV3pq6'),
    ('To Be Updated Inc','$2a$12$JtJrxBevbeelnf/NUnrYb.HWnM4hlK5ne//MJzM8typchqpQV3pq6'),
    ('To Be Deleted LLC','$2a$12$JtJrxBevbeelnf/NUnrYb.HWnM4hlK5ne//MJzM8typchqpQV3pq6');

