
CREATE TABLE IF NOT EXISTS accounts(
	account_id VARCHAR(255) PRIMARY KEY,
	email VARCHAR(255),
	name VARCHAR(255),
	password VARCHAR(255),
	roles VARCHAR(255),
	is_enabled BOOLEAN
);

CREATE TABLE IF NOT EXISTS posts(
	post_id VARCHAR(255) PRIMARY KEY,
	author_id VARCHAR(255),
	contents VARCHAR(255),
	created_date TIMESTAMP,
	FOREIGN KEY (author_id) REFERENCES accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS follows(
	follower_id VARCHAR(255),
	account_id VARCHAR(255),
	PRIMARY KEY(follower_id, account_id),
	FOREIGN KEY(follower_id) REFERENCES accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(account_id) REFERENCES accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS likes(
	account_id VARCHAR(255),
	post_id VARCHAR(255),
	PRIMARY KEY(account_id, post_id),
	FOREIGN KEY(account_id) REFERENCES accounts(account_id) ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY(post_id) REFERENCES posts(post_id) ON DELETE CASCADE ON UPDATE CASCADE
);