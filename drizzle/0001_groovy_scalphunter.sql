CREATE TABLE `clips` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`videoUrl` text NOT NULL,
	`videoSource` enum('youtube','upload') NOT NULL,
	`artistName` varchar(255) NOT NULL,
	`sceneTheme` varchar(255) NOT NULL,
	`keywords` text,
	`clipTitle` text NOT NULL,
	`clipDescription` text NOT NULL,
	`clipUrl` text,
	`startTime` int NOT NULL,
	`endTime` int NOT NULL,
	`duration` int NOT NULL,
	`hasSubtitles` int NOT NULL DEFAULT 0,
	`viralScore` int NOT NULL DEFAULT 0,
	`personaAnalysis` text,
	`themeAnalysis` text,
	`sentimentAnalysis` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clips_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyUsage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`date` varchar(10) NOT NULL,
	`clipsGenerated` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailyUsage_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPreferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`defaultArtistName` varchar(255),
	`defaultTheme` varchar(255),
	`subtitlesEnabled` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userPreferences_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userTiers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`tier` enum('lite','pro') NOT NULL DEFAULT 'lite',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userTiers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `clips` ADD CONSTRAINT `clips_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `dailyUsage` ADD CONSTRAINT `dailyUsage_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userPreferences` ADD CONSTRAINT `userPreferences_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `userTiers` ADD CONSTRAINT `userTiers_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;