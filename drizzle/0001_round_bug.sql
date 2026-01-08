CREATE TABLE `mini_challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`challenge_text` text NOT NULL,
	`mode` enum('familiar','adultos','both') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mini_challenges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `question_packs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pack_id` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`mode` enum('familiar','adultos','both') NOT NULL,
	`price` int NOT NULL,
	`stripe_price_id` varchar(255),
	`is_active` int NOT NULL DEFAULT 1,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `question_packs_id` PRIMARY KEY(`id`),
	CONSTRAINT `question_packs_pack_id_unique` UNIQUE(`pack_id`)
);
--> statement-breakpoint
CREATE TABLE `questions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pack_id` varchar(64) NOT NULL,
	`question_text` text NOT NULL,
	`mode` enum('familiar','adultos') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `questions_id` PRIMARY KEY(`id`)
);
